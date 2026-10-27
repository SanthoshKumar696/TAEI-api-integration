import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

const AbhaTokenService = require("../src/services/abha/AbhaTokenService");
const AbhaCertificateService = require("../src/services/abha/AbhaCertificateService");
const AbhaProfileServiceModule = require("../src/services/abha/AbhaProfileService");
const AbhaProfileService = AbhaProfileServiceModule.default || AbhaProfileServiceModule;
const EncryptionUtil = require("../src/utils/abha/encryption");
const abhaService = require("../src/services/abha/AbhaService").default;

test("searchAbhaByMobile validates a normal mobile number and encrypts the value", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalGetPublicKey = AbhaCertificateService.getPublicKey;
  const originalEncryptData = EncryptionUtil.encryptData;
  const originalAxiosPost = axios.post;

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    AbhaCertificateService.getPublicKey = async () => "public-key";
    EncryptionUtil.encryptData = ((data: string, key: string) => `ENC:${data}:${key}`) as typeof EncryptionUtil.encryptData;

    axios.post = (async (url: string, body: any, config: any) => {
      assert.match(url, /\/v3\/profile\/account\/abha\/search$/);
      assert.deepEqual(body, {
        scope: ["search-abha"],
        mobile: "ENC:9876543210:public-key"
      });
      assert.equal(config.headers.BENEFIT_NAME, "TNCMCHIS");

      return {
        data: [{
          txnId: "search-txn-123",
          ABHA: [{
            index: 1,
            ABHANumber: "91-1234-5678-9012",
            name: "Sample User",
            gender: "M",
            kycVerified: true,
            authMethods: ["MOBILE_OTP"]
          }]
        }]
      } as any;
    }) as typeof axios.post;

    const result = await abhaService.searchAbhaByMobile("9876543210");

    assert.equal(result.txnId, "search-txn-123");
    assert.equal(result.records.length, 1);
    assert.equal(result.records[0].ABHANumber, "91-1234-5678-9012");
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    AbhaCertificateService.getPublicKey = originalGetPublicKey;
    EncryptionUtil.encryptData = originalEncryptData;
    axios.post = originalAxiosPost;
  }
});

test("generateAbhaLoginOtp encrypts the selected index and reuses the search transaction ID", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalGetPublicKey = AbhaCertificateService.getPublicKey;
  const originalEncryptData = EncryptionUtil.encryptData;
  const originalAxiosPost = axios.post;

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    AbhaCertificateService.getPublicKey = async () => "public-key";
    EncryptionUtil.encryptData = ((data: string, key: string) => `ENC:${data}:${key}`) as typeof EncryptionUtil.encryptData;

    const existingTxnState = (abhaService as any).searchTransactionStore;
    existingTxnState.set("search-txn-123", {
      records: [{ index: 1 }],
      createdAt: Date.now()
    });

    axios.post = (async (url: string, body: any) => {
      assert.match(url, /\/v3\/profile\/login\/request\/otp$/);
      assert.deepEqual(body, {
        scope: ["abha-login", "search-abha", "mobile-verify"],
        loginHint: "index",
        loginId: "ENC:1:public-key",
        otpSystem: "abdm",
        txnId: "search-txn-123"
      });

      return {
        data: {
          txnId: "otp-txn-123",
          message: "OTP sent to mobile number ending with ******1234"
        }
      } as any;
    }) as typeof axios.post;

    const result = await abhaService.generateAbhaLoginOtp(1, "search-txn-123");

    assert.equal(result.txnId, "otp-txn-123");
    assert.equal(result.message, "OTP sent to mobile number ending with ******1234");
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    AbhaCertificateService.getPublicKey = originalGetPublicKey;
    EncryptionUtil.encryptData = originalEncryptData;
    axios.post = originalAxiosPost;
  }
});

test("verifyAbhaLoginOtp encrypts the OTP and uses the OTP transaction ID", async () => {
  const originalGetAbhaToken = AbhaTokenService.getAbhaToken;
  const originalGetPublicKey = AbhaCertificateService.getPublicKey;
  const originalEncryptData = EncryptionUtil.encryptData;
  const originalCreateOrUpdateFromLogin = AbhaProfileService.createOrUpdateFromLogin;
  const originalAxiosPost = axios.post;

  try {
    AbhaTokenService.getAbhaToken = async () => "gateway-token";
    AbhaCertificateService.getPublicKey = async () => "public-key";
    EncryptionUtil.encryptData = ((data: string, key: string) => `ENC:${data}:${key}`) as typeof EncryptionUtil.encryptData;
    AbhaProfileService.createOrUpdateFromLogin = async () => [{ id: 1, abha_number: "91-1234-5678-9012" }];

    axios.post = (async (url: string, body: any) => {
      assert.match(url, /\/v3\/profile\/login\/verify$/);
      assert.deepEqual(body, {
        scope: ["abha-login", "mobile-verify"],
        authData: {
          authMethods: ["otp"],
          otp: {
            txnId: "otp-txn-123",
            otpValue: "ENC:123456:public-key"
          }
        }
      });

      return {
        data: {
          authResult: "success",
          message: "OTP verified",
          token: "access-token",
          refreshToken: "refresh-token",
          expiresIn: 3600,
          refreshExpiresIn: 86400,
          accounts: [{ ABHANumber: "91-1234-5678-9012" }]
        }
      } as any;
    }) as typeof axios.post;

    const result = await abhaService.verifyAbhaLoginOtp("otp-txn-123", "123456");

    assert.equal(result.authResult, "success");
    assert.equal(result.profiles[0].abha_number, "91-1234-5678-9012");
  } finally {
    AbhaTokenService.getAbhaToken = originalGetAbhaToken;
    AbhaCertificateService.getPublicKey = originalGetPublicKey;
    EncryptionUtil.encryptData = originalEncryptData;
    AbhaProfileService.createOrUpdateFromLogin = originalCreateOrUpdateFromLogin;
    axios.post = originalAxiosPost;
  }
});
