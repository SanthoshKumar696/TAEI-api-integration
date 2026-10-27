import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

const AbhaTokenService = require("../src/services/abha/AbhaTokenService");
const abhaService = require("../src/services/abha/AbhaService").default;

test("downloadAbhaCardFile sends a single Bearer X-token and returns JPEG bytes", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalAxiosGet = axios.get;
  const imageBytes = new Uint8Array([0xff, 0xd8, 0xff, 0x00]).buffer;

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    axios.get = (async (url: string, config: any) => {
      assert.match(url, /\/v3\/profile\/account\/abha-card$/);
      assert.equal(config.responseType, "arraybuffer");
      assert.equal(config.headers["X-token"], "Bearer abha-user-token");
      assert.equal(config.headers.Accept, "image/*, application/pdf;q=0.9, */*;q=0.1");
      assert.match(config.headers["REQUEST-ID"], /^[0-9a-f-]{36}$/i);
      assert.equal(new Date(config.headers.TIMESTAMP).toISOString(), config.headers.TIMESTAMP);
      assert.equal(config.headers["X-CM-ID"], "sbx");

      return {
        data: imageBytes,
        headers: { "content-type": "image/jpeg" }
      } as any;
    }) as typeof axios.get;

    const result = await abhaService.downloadAbhaCardFile("Bearer abha-user-token");

    assert.equal(result.contentType, "image/jpeg");
    assert.deepEqual(result.data, Buffer.from(imageBytes));
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    axios.get = originalAxiosGet;
  }
});

test("downloadAbhaCardFile maps an expired ABHA X-token to a safe 401 response", async () => {
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
      abhaService.downloadAbhaCardFile("Bearer abha-user-token"),
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
