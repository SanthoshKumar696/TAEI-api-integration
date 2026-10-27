import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

const AbhaTokenService = require("../src/services/abha/AbhaTokenService");
const abhaService = require("../src/services/abha/AbhaService").default;

test("getAbhaAccountDetails returns ABDM JSON and forwards a single Bearer X-token", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalAxiosGet = axios.get;
  const accountDetails = {
    ABHANumber: "91-1234-5678-9012",
    preferredAbhaAddress: "sample@abdm",
    additionalField: { preserved: true }
  };

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    axios.get = (async (url: string, config: any) => {
      assert.match(url, /\/v3\/profile\/account$/);
      assert.equal(config.responseType, "json");
      assert.equal(config.headers["X-token"], "Bearer abha-user-token");
      assert.match(config.headers["REQUEST-ID"], /^[0-9a-f-]{36}$/i);
      assert.equal(new Date(config.headers.TIMESTAMP).toISOString(), config.headers.TIMESTAMP);
      assert.equal(config.headers["X-CM-ID"], "sbx");
      return { data: accountDetails } as any;
    }) as typeof axios.get;

    const result = await abhaService.getAbhaAccountDetails("Bearer abha-user-token");

    assert.deepEqual(result, accountDetails);
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    axios.get = originalAxiosGet;
  }
});

test("getAbhaAccountDetails maps an expired X-token to a sanitized 401", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalAxiosGet = axios.get;

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    axios.get = (async () => {
      throw {
        isAxiosError: true,
        response: { status: 401, data: "sensitive upstream response" }
      };
    }) as typeof axios.get;

    await assert.rejects(
      abhaService.getAbhaAccountDetails("Bearer abha-user-token"),
      (error: any) => {
        assert.equal(error.status, 401);
        assert.match(error.data.message, /invalid or expired/i);
        assert.doesNotMatch(JSON.stringify(error), /sensitive upstream response|abha-user-token/);
        return true;
      }
    );
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    axios.get = originalAxiosGet;
  }
});
