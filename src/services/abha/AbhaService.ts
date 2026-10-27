import axios from "axios";
import { getAbhaToken } from "./AbhaTokenService";
import { getPublicKey } from "./AbhaCertificateService";
import { encryptData } from "../../utils/abha/encryption";
import { ABHA_CONFIG } from "../../config/abha.config";
import { getAbhaHeaders } from "../../utils/abha/abhaHeaders";
import AbhaProfileRepository from "../../repositories/AbhaProfileRepository";
import { decryptJSON } from "../../utils/abha/aesEncryption";
import AbhaProfileService from "./AbhaProfileService";

import https from "https";
import crypto from "crypto";



class AbhaService {

  private readonly searchTransactionStore = new Map<string, { records: any[]; createdAt: number }>();

  private normalizeMobile(mobile: string): string {
    const normalized = String(mobile ?? "").trim().replace(/\s+/g, "");

    if (!/^\d{10}$/.test(normalized)) {
      throw {
        status: 400,
        data: {
          message: "Mobile number must be exactly 10 digits.",
          code: "INVALID_MOBILE"
        }
      };
    }

    return normalized;
  }

  private validateTxnId(txnId: string, fieldName = "txnId"): string {
    if (!txnId || String(txnId).trim() === "") {
      throw {
        status: 400,
        data: {
          message: `${fieldName} is required`,
          code: "MISSING_TXN_ID"
        }
      };
    }

    return String(txnId).trim();
  }

  private getSearchRecordsForTransaction(txnId: string) {
    const txn = this.searchTransactionStore.get(txnId);

    if (!txn) {
      throw {
        status: 400,
        data: {
          message: "Search transaction was not found or has expired.",
          code: "INVALID_SEARCH_TXN_ID"
        }
      };
    }

    return txn.records;
  }

  private sanitizeSearchRecords(records: any[]): any[] {
    return (Array.isArray(records) ? records : []).map((record: any) => ({
      index: record?.index,
      ABHANumber: record?.ABHANumber,
      name: record?.name,
      gender: record?.gender,
      kycVerified: record?.kycVerified,
      authMethods: Array.isArray(record?.authMethods) ? record.authMethods : []
    }));
  }

  async searchAbhaByMobile(mobile: string) {
    try {
      const normalizedMobile = this.normalizeMobile(mobile);
      const token = await getAbhaToken();
      const publicKey = await getPublicKey();
      const encryptedMobile = encryptData(normalizedMobile, publicKey);

      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/abha/search`,
        {
          scope: ["search-abha"],
          mobile: encryptedMobile
        },
        { headers: getAbhaHeaders(token, undefined, ABHA_CONFIG.ABHA.BENEFIT_NAME) }
      );

      const payload = Array.isArray(response.data) ? response.data : [response.data];
      const searchResponse = payload[0] ?? {};
      const records = this.sanitizeSearchRecords(Array.isArray(searchResponse.ABHA) ? searchResponse.ABHA : []);
      const txnId = typeof searchResponse.txnId === "string" ? searchResponse.txnId : "";

      if (txnId) {
        this.searchTransactionStore.set(txnId, { records: Array.isArray(searchResponse.ABHA) ? searchResponse.ABHA : [], createdAt: Date.now() });
      }

      return {
        success: true,
        txnId,
        records,
        message: records.length ? "ABHA records found." : "No ABHA records found for the provided mobile number."
      };
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async searchAbha(mobile: string) {
    return this.searchAbhaByMobile(mobile);
  }

  async generateAbhaLoginOtp(index: number | string, txnId: string) {
    try {
      const validTxnId = this.validateTxnId(txnId, "txnId");
      const parsedIndex = Number(index);

      if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
        throw {
          status: 400,
          data: {
            message: "Selected index must be a non-negative integer.",
            code: "INVALID_INDEX"
          }
        };
      }

      const records = this.getSearchRecordsForTransaction(validTxnId);
      const validRecord = records.find((record: any) => Number(record?.index) === parsedIndex);

      if (!validRecord) {
        throw {
          status: 400,
          data: {
            message: "Selected ABHA record is not part of the current search transaction.",
            code: "INVALID_INDEX"
          }
        };
      }

      const token = await getAbhaToken();
      const publicKey = await getPublicKey();
      const encryptedIndex = encryptData(String(parsedIndex), publicKey);

      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/request/otp`,
        {
          scope: ["abha-login", "search-abha", "mobile-verify"],
          loginHint: "index",
          loginId: encryptedIndex,
          otpSystem: "abdm",
          txnId: validTxnId
        },
        { headers: getAbhaHeaders(token) }
      );

      const otpTxnId = response.data?.txnId || response.data?.otpTxnId || "";

      return {
        success: true,
        txnId: otpTxnId,
        message: response.data?.message || "OTP sent successfully."
      };
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async generateSearchOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async requestSearchOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyAbhaLoginOtp(otpTxnId: string, otp: string) {
    try {
      const validOtpTxnId = this.validateTxnId(otpTxnId, "otpTxnId");
      const normalizedOtp = String(otp ?? "").trim();

      if (!/^\d{4,8}$/.test(normalizedOtp)) {
        throw {
          status: 400,
          data: {
            message: "OTP must contain 4 to 8 digits only.",
            code: "INVALID_OTP"
          }
        };
      }

      const token = await getAbhaToken();
      const publicKey = await getPublicKey();
      const encryptedOtp = encryptData(normalizedOtp, publicKey);

      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`,
        {
          scope: ["abha-login", "mobile-verify"],
          authData: {
            authMethods: ["otp"],
            otp: {
              txnId: validOtpTxnId,
              otpValue: encryptedOtp
            }
          }
        },
        { headers: getAbhaHeaders(token) }
      );

      if (Array.isArray(response.data?.accounts) && response.data?.token) {
        const savedProfiles = await AbhaProfileService.createOrUpdateFromLogin(response.data);

        return {
          ...response.data,
          profiles: savedProfiles.map((profile: any) => ({
            id: profile.id,
            abha_number: profile.abha_number
          }))
        };
      }

      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async verifyAbhaUser(abhaNumber: string, txnId: string, tToken: string): Promise<unknown> {
    const normalizedAbhaNumber = String(abhaNumber ?? "").trim();
    const normalizedTxnId = String(txnId ?? "").trim();
    const normalizedTToken = String(tToken ?? "").trim();
    if (!normalizedAbhaNumber || !normalizedTxnId || !normalizedTToken) {
      throw {
        status: 400,
        data: { message: "ABHANumber, txnId, and tToken are required." }
      };
    }

    let gatewayToken: string;
    try {
      gatewayToken = await getAbhaToken();
    } catch {
      throw {
        status: 502,
        data: { message: "Unable to authorize the request with ABDM." }
      };
    }

    const headers = getAbhaHeaders(gatewayToken, undefined, undefined, normalizedTToken);
    try {
      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify/user`,
        {
          ABHANumber: normalizedAbhaNumber,
          txnId: normalizedTxnId
        },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const upstreamStatus = error.response?.status;
        if (upstreamStatus === 401) {
          throw {
            status: 401,
            data: { message: "ABDM rejected the OTP verification token." }
          };
        }
        if (upstreamStatus === 403) {
          throw {
            status: 403,
            data: { message: "ABDM denied user verification." }
          };
        }
      }

      throw {
        status: 502,
        data: { message: "Unable to verify the ABHA user with ABDM." }
      };
    }
  }

  async verifySearchOtp(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async verifyAbhaOtp(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateAbhaSearchOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async generateAbhaLoginSearchOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyAbhaLoginSearchOtp(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateOtpForSearch(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyOtpForSearch(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateAbhaMobileOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyAbhaMobileOtp(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateMobileSearchOtp(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyMobileSearchOtp(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateOtpForSelectedAbha(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyOtpForSelectedAbha(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateOtpForAbhaSearch(index: number | string, txnId: string) {
    return this.generateAbhaLoginOtp(index, txnId);
  }

  async verifyOtpForAbhaSearch(otpTxnId: string, otp: string) {
    return this.verifyAbhaLoginOtp(otpTxnId, otp);
  }

  async generateAadhaarOtp(aadhaar: string) {

    try {

      const token = await getAbhaToken();
      const publicKey = await getPublicKey();
      const encryptedAadhaar = encryptData(aadhaar, publicKey);
      console.log("Encrypted Aadhaar:", encryptedAadhaar);

      const body = {
        txnId: "",
        scope: ["abha-enrol"],
        loginHint: "aadhaar",
        loginId: encryptedAadhaar,
        otpSystem: "aadhaar"
      };

      const headers = getAbhaHeaders(token);

      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/request/otp`,
        body,
        { headers }
      );

      console.log("ABHA SUCCESS RESPONSE:", response.data);

      return response.data;

    } catch (error) {
  this.handleAxiosError(error);
}
  }

  async verifyAadhaarOtp(txnId: string, otp: string, mobile: string) {

    try {

      const token = await getAbhaToken();
      const publicKey = await getPublicKey();

      // encrypt OTP
      const encryptedOtp = encryptData(otp, publicKey);

      const body = {
        authData: {
          authMethods: ["otp"],
          otp: {
            txnId: txnId,
            otpValue: encryptedOtp,
            mobile: mobile
          }
        },
        consent: {
          code: "abha-enrollment",
          version: "1.4"
        }
      };

      const headers = getAbhaHeaders(token);

      console.log("===== VERIFY OTP DEBUG =====");
      console.log("BODY:", body);

      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/byAadhaar`,
        body,
        { headers }
      );

      console.log("VERIFY OTP RESPONSE:", response.data);

      return response.data;

    } catch (error) {
  this.handleAxiosError(error);
}
  }

  // ─────────────────────────────────────────
  // ENROL BY AADHAAR (Demo Auth)
  // ─────────────────────────────────────────
  async enrolByAadhaar(request: AadhaarEnrollmentRequest): Promise<any> {
    try {
      console.log("[ABHA][AADHAAR-ENROLL] START");

      // Step 1 - Validate Aadhaar
      console.log("[ABHA][AADHAAR-ENROLL] Validating Aadhaar");
      if (!request.aadhaar || !/^\d{12}$/.test(request.aadhaar)) {
        throw {
          status: 400,
          data: {
            message: "Aadhaar must be exactly 12 digits",
            code: "INVALID_AADHAAR"
          }
        };
      }
      console.log("[ABHA][AADHAAR-ENROLL] Aadhaar validation successful");

      // Step 2 - Validate required demographic fields
      console.log("[ABHA][AADHAAR-ENROLL] Validating demographic fields");
      if (!request.districtCode || request.districtCode.toString().trim() === "") {
        throw {
          status: 400,
          data: {
            message: "District code is required",
            code: "MISSING_DISTRICT_CODE"
          }
        };
      }
      if (!request.stateCode || request.stateCode.toString().trim() === "") {
        throw {
          status: 400,
          data: {
            message: "State code is required",
            code: "MISSING_STATE_CODE"
          }
        };
      }
      if (!request.dateOfBirth || !/^\d{2}-\d{2}-\d{4}$/.test(request.dateOfBirth)) {
        throw {
          status: 400,
          data: {
            message: "Date of birth must be in DD-MM-YYYY format",
            code: "INVALID_DATE_OF_BIRTH"
          }
        };
      }
      if (!request.gender || !["M", "F", "O"].includes(request.gender.toUpperCase())) {
        throw {
          status: 400,
          data: {
            message: "Gender must be M, F, or O",
            code: "INVALID_GENDER"
          }
        };
      }
      if (!request.name || request.name.trim() === "") {
        throw {
          status: 400,
          data: {
            message: "Name is required",
            code: "MISSING_NAME"
          }
        };
      }
      if (request.mobile && !/^\d{10}$/.test(request.mobile.toString())) {
        throw {
          status: 400,
          data: {
            message: "Mobile must be a valid 10-digit number",
            code: "INVALID_MOBILE"
          }
        };
      }
      if (request.pinCode && !/^\d{6}$/.test(request.pinCode.toString())) {
        throw {
          status: 400,
          data: {
            message: "Pin code must be a valid 6-digit number",
            code: "INVALID_PIN_CODE"
          }
        };
      }
      console.log("[ABHA][AADHAAR-ENROLL] Demographic validation successful");

      // Step 3 - Get ABDM Access Token
      const token = await getAbhaToken();
      console.log("[ABHA][AADHAAR-ENROLL] Access token obtained");

      // Step 4 - Get Public Key
      const publicKey = await getPublicKey();
      console.log("[ABHA][AADHAAR-ENROLL] Public certificate obtained");

      // Step 5 - Encrypt Aadhaar using EXISTING encryption
      console.log("[ABHA][AADHAAR-ENROLL] Encrypting Aadhaar using existing encryption service");
      const encryptedAadhaar = encryptData(request.aadhaar, publicKey);
      console.log("[ABHA][AADHAAR-ENROLL] Aadhaar encrypted successfully");

      // Step 6 - Build demo_auth object dynamically
      const demoAuth: Record<string, any> = {
        aadhaarNumber: encryptedAadhaar,
        districtCode: request.districtCode.toString(),
        stateCode: request.stateCode.toString(),
        dateOfBirth: request.dateOfBirth,
        gender: request.gender.toUpperCase(),
        name: request.name
      };

      // Only include optional fields if provided
      if (request.mobile && request.mobile.trim() !== "") {
        demoAuth.mobile = request.mobile;
      }
      if (request.pinCode && request.pinCode.toString().trim() !== "") {
        demoAuth.pinCode = request.pinCode.toString();
      }

      console.log("[ABHA][AADHAAR-ENROLL] Demo_auth object built with demographic fields");

      // Step 7 - Build request body for demo_auth enrollment
      const body = {
        authData: {
          authMethods: ["demo_auth"],
          demo_auth: demoAuth
        },
        consent: {
          code: "abha-enrollment",
          version: "1.4"
        }
      };

      console.log("[ABHA][AADHAAR-ENROLL] BENEFIT-NAME: TNCMCHIS");

      // Step 8 - Get headers with new REQUEST-ID and TIMESTAMP
      const headers = getAbhaHeaders(token);
      headers["BENEFIT-NAME"] = "TNCMCHIS";

      console.log("[ABHA][AADHAAR-ENROLL] REQUEST-ID generated:", headers["REQUEST-ID"]);
      console.log("[ABHA][AADHAAR-ENROLL] TIMESTAMP generated:", headers["TIMESTAMP"]);
      console.log("[ABHA][AADHAAR-ENROLL] Calling ABDM enrollment API");

      // Step 9 - Call ABDM Enrollment API
      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/byAadhaar`,
        body,
        { headers }
      );

      console.log("[ABHA][AADHAAR-ENROLL] ABDM response received");
      console.log("[ABHA][AADHAAR-ENROLL] SUCCESS");

      return response.data;

    } catch (error) {
      this.handleAxiosError(error);
    }
  }

//-----------------------------------
async sendMobileOtpNEW(profileId: number, mobile: string) {
  console.log("SEND MOBILE OTP START");

  try {
    // Step 1 — Get ABDM Gateway Token
    const gatewayToken = await getAbhaToken();
    console.log("Gateway Token fetched");

    // Step 2 — Get Public Key
    const publicKey = await getPublicKey();
    console.log("Public Key fetched");

    // Step 3 — Encrypt Mobile Number
    const encryptedMobile = encryptData(mobile, publicKey);
    console.log("Mobile encrypted");

    // Step 4 — Get valid X-Token using profileId
    const xToken = await AbhaProfileService.getXToken(profileId);
    console.log("XToken fetched");

    // Step 5 — Common Headers
    const headers = getAbhaHeaders(
      gatewayToken,
      xToken
    );

    console.log("HEADERS:", {
      ...headers,
      Authorization: headers.Authorization ? "Bearer ****" : undefined,
      "X-Token": headers["X-Token"] ? "Bearer ****" : undefined
    });

    // Step 6 — Request Body
    const body = {
      scope: [
        "abha-profile",
        "mobile-verify"
      ],
      loginHint: "mobile",
      loginId: encryptedMobile,
      otpSystem: "abdm"
    };

    console.log("REQUEST BODY:", {
      scope: body.scope,
      loginHint: body.loginHint,
      loginId: "ENCRYPTED",
      otpSystem: body.otpSystem
    });

    try {

      // Step 7 — Call ABHA Mobile OTP API
      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/request/otp`,
        body,
        { headers }
      );

      console.log(
        "SEND MOBILE OTP SUCCESS:",
        response.data
      );

      return response.data;

    } catch (error: any) {

      // Step 8 — If X-Token expired, refresh and retry
      if (error.response?.status === 401) {

        console.log(
          "Got 401 — forcing XToken refresh and retrying..."
        );

        const refreshedXToken =
          await AbhaProfileService.getRefreshToken(profileId);

        console.log("Refreshed XToken fetched");

        const retryHeaders = getAbhaHeaders(
          gatewayToken,
          refreshedXToken
        );

        // Step 9 — Retry once
        const retryResponse = await axios.post(
          `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/request/otp`,
          body,
          {
            headers: retryHeaders
          }
        );

        console.log(
          "SEND MOBILE OTP RETRY SUCCESS:",
          retryResponse.data
        );

        return retryResponse.data;
      }

      throw error;
    }

  } catch (error) {
    this.handleAxiosError(error);
  }
}




//-------------------------------



  async downloadPhrCardFile(
    xToken: string
  ): Promise<{ data: Buffer; contentType: string }> {
    if (typeof xToken !== "string" || !xToken.replace(/^Bearer\s+/i, "").trim()) {
      throw {
        status: 401,
        data: { message: "X-token header is required." }
      };
    }

    let gatewayToken: string;
    try {
      gatewayToken = await getAbhaToken();
    } catch {
      throw {
        status: 502,
        data: { message: "Unable to authorize the request with ABDM." }
      };
    }

    const headers = getAbhaHeaders(gatewayToken, xToken);
    headers.Accept = "image/*, application/pdf;q=0.9, */*;q=0.1";

    try {
      const response = await axios.get<ArrayBuffer>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/profile/abha/phr-card`,
        { headers, responseType: "arraybuffer" }
      );

      const data = Buffer.from(response.data);
      const upstreamContentType = response.headers["content-type"]
        ?.split(";")[0]
        .trim()
        .toLowerCase();
      const detectedContentType = this.detectAbhaCardContentType(data);
      const contentType = detectedContentType || upstreamContentType;

      if (
        !contentType ||
        (!contentType.startsWith("image/") && contentType !== "application/pdf")
      ) {
        throw {
          status: 502,
          data: { message: "ABDM returned an unsupported PHR card format." }
        };
      }
      if (contentType === "image/jpeg" && detectedContentType !== "image/jpeg") {
        throw {
          status: 502,
          data: { message: "ABDM returned an invalid JPEG PHR card." }
        };
      }

      return { data, contentType };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const upstreamStatus = error.response?.status;
        if (upstreamStatus === 401) {
          throw {
            status: 401,
            data: { message: "ABHA session is invalid or expired. Please log in again." }
          };
        }
        if (upstreamStatus === 403) {
          throw {
            status: 403,
            data: { message: "ABDM denied access to the ABHA PHR card." }
          };
        }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "data" in error
      ) {
        throw error;
      }

      throw {
        status: 502,
        data: { message: "Unable to retrieve the ABHA PHR card from ABDM." }
      };
    }
  }

  async getPhrProfile(xToken: string): Promise<unknown> {
    if (typeof xToken !== "string" || !xToken.replace(/^Bearer\s+/i, "").trim()) {
      throw {
        status: 401,
        data: { message: "X-token header is required." }
      };
    }

    let gatewayToken: string;
    try {
      gatewayToken = await getAbhaToken();
    } catch {
      throw {
        status: 502,
        data: { message: "Unable to authorize the request with ABDM." }
      };
    }

    const headers = getAbhaHeaders(gatewayToken, xToken);

    try {
      const response = await axios.get<unknown>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/profile/abha-profile`,
        { headers, responseType: "json" }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const upstreamStatus = error.response?.status;
        if (upstreamStatus === 401) {
          throw {
            status: 401,
            data: { message: "ABHA session is invalid or expired. Please log in again." }
          };
        }
        if (upstreamStatus === 403) {
          throw {
            status: 403,
            data: { message: "ABDM denied access to the ABHA PHR profile." }
          };
        }
      }

      throw {
        status: 502,
        data: { message: "Unable to retrieve the ABHA PHR profile from ABDM." }
      };
    }
  }

  async getAbhaAccountDetails(xToken: string): Promise<unknown> {
    if (typeof xToken !== "string" || !xToken.replace(/^Bearer\s+/i, "").trim()) {
      throw {
        status: 401,
        data: { message: "X-token header is required." }
      };
    }

    let gatewayToken: string;
    try {
      gatewayToken = await getAbhaToken();
    } catch {
      throw {
        status: 502,
        data: { message: "Unable to authorize the request with ABDM." }
      };
    }

    const headers = getAbhaHeaders(gatewayToken, xToken);

    try {
      const response = await axios.get<unknown>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account`,
        { headers, responseType: "json" }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const upstreamStatus = error.response?.status;
        if (upstreamStatus === 401) {
          throw {
            status: 401,
            data: { message: "ABHA session is invalid or expired. Please log in again." }
          };
        }
        if (upstreamStatus === 403) {
          throw {
            status: 403,
            data: { message: "ABDM denied access to ABHA account details." }
          };
        }
      }

      throw {
        status: 502,
        data: { message: "Unable to retrieve ABHA account details from ABDM." }
      };
    }
  }

  async downloadAbhaCardFile(
    xToken: string
  ): Promise<{ data: Buffer; contentType: string }> {
    if (typeof xToken !== "string" || !xToken.replace(/^Bearer\s+/i, "").trim()) {
      throw {
        status: 401,
        data: { message: "X-token header is required." }
      };
    }

    let gatewayToken: string;
    try {
      gatewayToken = await getAbhaToken();
    } catch {
      throw {
        status: 502,
        data: { message: "Unable to authorize the request with ABDM." }
      };
    }

    const headers = getAbhaHeaders(gatewayToken, xToken);
    headers.Accept = "image/*, application/pdf;q=0.9, */*;q=0.1";

    try {
      const response = await axios.get<ArrayBuffer>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/abha-card`,
        { headers, responseType: "arraybuffer" }
      );

      const data = Buffer.from(response.data);
      const upstreamContentType = response.headers["content-type"]
        ?.split(";")[0]
        .trim()
        .toLowerCase();
      const detectedContentType = this.detectAbhaCardContentType(data);
      const contentType = detectedContentType || upstreamContentType;

      if (
        !contentType ||
        (!contentType.startsWith("image/") && contentType !== "application/pdf")
      ) {
        throw {
          status: 502,
          data: { message: "ABDM returned an unsupported ABHA card format." }
        };
      }
      if (contentType === "image/jpeg" && detectedContentType !== "image/jpeg") {
        throw {
          status: 502,
          data: { message: "ABDM returned an invalid JPEG ABHA card." }
        };
      }

      return { data, contentType };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const upstreamStatus = error.response?.status;
        if (upstreamStatus === 401) {
          throw {
            status: 401,
            data: {
              message: "ABHA session is invalid or expired. Please log in again."
            }
          };
        }
        if (upstreamStatus === 403) {
          throw {
            status: 403,
            data: { message: "ABDM denied access to the ABHA card." }
          };
        }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "data" in error
      ) {
        throw error;
      }

      throw {
        status: 502,
        data: { message: "Unable to retrieve the ABHA card from ABDM." }
      };
    }
  }

  private detectAbhaCardContentType(data: Buffer): string | undefined {
    if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      data.length >= 8 &&
      data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
      return "image/png";
    }
    if (data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString())) {
      return "image/gif";
    }
    if (
      data.length >= 12 &&
      data.subarray(0, 4).toString() === "RIFF" &&
      data.subarray(8, 12).toString() === "WEBP"
    ) {
      return "image/webp";
    }
    if (data.length >= 4 && data.subarray(0, 4).toString() === "%PDF") {
      return "application/pdf";
    }
    return undefined;
  }

  // Address-card download uses its own profile-token flow.

async downloadAbhaAddressCard(profileId: number): Promise<Buffer> {
  console.log("DOWNLOAD ABHA-ADDRESS CARD START");

  try {
    const gatewayToken = await getAbhaToken();
    const xToken = await AbhaProfileService.getXToken(profileId);
    const headers = getAbhaHeaders(gatewayToken, xToken);

    const response = await axios.get<ArrayBuffer>(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/profile/abha/phr-card`,
      { headers, responseType: "arraybuffer" }
    );
    return this.processAbhaCardResponse(response);

  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("X-token invalid/expired — ABHA-address session must be re-established via OTP login again (no refresh endpoint exists for this flow).");
      throw {
        status: 401,
        data: { message: "Session expired. Please log in again via ABHA-address OTP." }
      };
    }
    this.handleAxiosError(error);
  }
}

  // ─────────────────────────────────────────
  // HELPER — detect and log buffer format
  // ─────────────────────────────────────────
  private processAbhaCardResponse(response: any): Buffer {
    const buffer = Buffer.from(response.data);
    const header = buffer.slice(0, 8).toString();

    console.log("Received file header:", header);
    console.log("Content-Type from response:", response.headers["content-type"]);

    if (header.startsWith("%PDF")) console.log("Received PDF format");
    else if (header.startsWith("\x89PNG")) console.log("Received PNG format");
    else if (header.slice(0, 2).toString() === "\xff\xd8") console.log("Received JPEG format");
    else if (header.startsWith("GIF")) console.log("Received GIF format");
    else console.log("Unknown format received");

    console.log("ABHA CARD SUCCESS");
    return buffer;
  }

async getAbhaSuggestions(
  txnId: string,
  requestId?: string
) {
  const startTime = Date.now();

  console.log("----------------------------------------------------");
  console.log("[ABHA][SERVICE] getAbhaSuggestions - START");

  console.log(
    "[ABHA][SERVICE] Request ID:",
    requestId || "NOT_PROVIDED"
  );

  console.log(
    "[ABHA][SERVICE] Transaction_Id received:",
    !!txnId
  );

  console.log(
    "[ABHA][SERVICE] Transaction_Id length:",
    txnId?.length || 0
  );

  console.log(
    "[ABHA][SERVICE] Transaction_Id value:",
    txnId || "NOT_RECEIVED"
  );

  try {

    // ==================================================
    // STEP 1: Validate Transaction ID
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 1] Validating Transaction_Id"
    );

    if (!txnId) {
      console.error(
        "[ABHA][SERVICE][STEP 1] ERROR: Transaction_Id is missing"
      );

      throw new Error("Transaction_Id is required");
    }

    console.log(
      "[ABHA][SERVICE][STEP 1] Transaction_Id validation PASSED"
    );

    // ==================================================
    // STEP 2: Get ABHA Token
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 2] Calling getAbhaToken()"
    );

    const tokenStartTime = Date.now();

    const token = await getAbhaToken();

    console.log(
      "[ABHA][SERVICE][STEP 2] getAbhaToken() completed"
    );

    console.log(
      "[ABHA][SERVICE][STEP 2] Token received:",
      !!token
    );

    console.log(
      "[ABHA][SERVICE][STEP 2] Token length:",
      token?.length || 0
    );

    console.log(
      "[ABHA][SERVICE][STEP 2] Token duration:",
      `${Date.now() - tokenStartTime} ms`
    );

    // IMPORTANT:
    // DO NOT print the actual token

    if (!token) {
      console.error(
        "[ABHA][SERVICE][STEP 2] ERROR: Token is EMPTY"
      );

      throw new Error("ABHA token was not received");
    }

    console.log(
      "[ABHA][SERVICE][STEP 2] Token validation PASSED"
    );

    // ==================================================
    // STEP 3: Generate ABHA Headers
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 3] Calling getAbhaHeaders()"
    );

    const headers = getAbhaHeaders(token);

    console.log(
      "[ABHA][SERVICE][STEP 3] getAbhaHeaders() completed"
    );

    console.log(
      "[ABHA][SERVICE][STEP 3] Headers generated:",
      JSON.stringify(
        {
          ...headers,

          // Hide sensitive information
          Authorization: headers.Authorization
            ? "PRESENT"
            : "MISSING",

          authorization: headers.authorization
            ? "PRESENT"
            : "MISSING",
        },
        null,
        2
      )
    );

    // ==================================================
    // STEP 4: Add Transaction ID
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 4] Adding Transaction_Id to headers"
    );

    headers["Transaction_Id"] = txnId;

    console.log(
      "[ABHA][SERVICE][STEP 4] Transaction_Id added:",
      !!headers["Transaction_Id"]
    );

    console.log(
      "[ABHA][SERVICE][STEP 4] Transaction_Id length:",
      headers["Transaction_Id"]?.length || 0
    );

    // ==================================================
    // STEP 5: Build URL
    // ==================================================

    const url =
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/suggestion`;

    console.log(
      "[ABHA][SERVICE][STEP 5] ABHA request URL:",
      url
    );

    console.log(
      "[ABHA][SERVICE][STEP 5] ABHA baseUrl:",
      ABHA_CONFIG.ABHA.baseUrl
    );

    // ==================================================
    // STEP 6: Log final request information
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 6] Preparing Axios GET request"
    );

    console.log(
      "[ABHA][SERVICE][STEP 6] Method: GET"
    );

    console.log(
      "[ABHA][SERVICE][STEP 6] Final Headers:",
      JSON.stringify(
        {
          ...headers,

          Authorization: headers.Authorization
            ? "PRESENT"
            : "MISSING",

          authorization: headers.authorization
            ? "PRESENT"
            : "MISSING",

          Transaction_Id: headers.Transaction_Id
            ? "PRESENT"
            : "MISSING",
        },
        null,
        2
      )
    );

    // ==================================================
    // STEP 7: Call ABHA API
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 7] Calling ABHA API..."
    );

    const axiosStartTime = Date.now();

    const response = await axios.get(
      url,
      {
        headers,
        timeout: 30000,
      }
    );

    // ==================================================
    // STEP 8: ABHA API Response
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 8] ABHA API response received"
    );

    console.log(
      "[ABHA][SERVICE][STEP 8] HTTP Status:",
      response.status
    );

    console.log(
      "[ABHA][SERVICE][STEP 8] HTTP Status Text:",
      response.statusText
    );

    console.log(
      "[ABHA][SERVICE][STEP 8] Response Headers:",
      JSON.stringify(response.headers, null, 2)
    );

    console.log(
      "[ABHA][SERVICE][STEP 8] Response Data:",
      JSON.stringify(response.data, null, 2)
    );

    console.log(
      "[ABHA][SERVICE][STEP 8] Axios duration:",
      `${Date.now() - axiosStartTime} ms`
    );

    // ==================================================
    // STEP 9: Return response
    // ==================================================

    console.log(
      "[ABHA][SERVICE][STEP 9] Returning ABHA response to controller"
    );

    console.log(
      "[ABHA][SERVICE] Total Duration:",
      `${Date.now() - startTime} ms`
    );

    console.log(
      "[ABHA][SERVICE] getAbhaSuggestions - SUCCESS"
    );

    console.log("----------------------------------------------------");

    return response.data;

  } catch (error: any) {

    // ==================================================
    // SERVICE ERROR
    // ==================================================

    console.error("----------------------------------------------------");
    console.error("[ABHA][SERVICE] getAbhaSuggestions - ERROR");

    console.error(
      "[ABHA][SERVICE] Request ID:",
      requestId || "NOT_PROVIDED"
    );

    console.error(
      "[ABHA][SERVICE] Total Duration:",
      `${Date.now() - startTime} ms`
    );

    console.error(
      "[ABHA][SERVICE] Transaction_Id exists:",
      !!txnId
    );

    console.error(
      "[ABHA][SERVICE] Transaction_Id length:",
      txnId?.length || 0
    );

    console.error(
      "[ABHA][SERVICE] Error message:",
      error?.message
    );

    console.error(
      "[ABHA][SERVICE] Error name:",
      error?.name
    );

    console.error(
      "[ABHA][SERVICE] Error code:",
      error?.code
    );

    console.error(
      "[ABHA][SERVICE] Error status:",
      error?.status
    );

    console.error(
      "[ABHA][SERVICE] Axios status:",
      error?.response?.status
    );

    console.error(
      "[ABHA][SERVICE] Axios status text:",
      error?.response?.statusText
    );

    console.error(
      "[ABHA][SERVICE] Axios response data:",
      JSON.stringify(
        error?.response?.data,
        null,
        2
      )
    );

    console.error(
      "[ABHA][SERVICE] Axios response headers:",
      JSON.stringify(
        error?.response?.headers,
        null,
        2
      )
    );

    console.error(
      "[ABHA][SERVICE] Axios request URL:",
      error?.config?.url
    );

    console.error(
      "[ABHA][SERVICE] Axios request method:",
      error?.config?.method
    );

    console.error(
      "[ABHA][SERVICE] Axios timeout:",
      error?.config?.timeout
    );

    console.error(
      "[ABHA][SERVICE] Error stack:",
      error?.stack
    );

    console.error(
      "[ABHA][SERVICE] Full error:",
      error
    );

    console.error("----------------------------------------------------");

    return this.handleAxiosError(error);
  }
}

async createCustomAbhaAddress(
  txnId: string,
  abhaAddress: string,
  preferred: number
) {
  try {

    // Step 1 - Access Token
    const token = await getAbhaToken();

    // Step 2 - Headers
    const headers = getAbhaHeaders(token);

    // Step 3 - Request Body
    const body = {
      txnId,
      abhaAddress,
      preferred
    };

    // Step 4 - API Call
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/abha-address`,
      body,
      { headers }
    );

    console.log("CUSTOM ABHA ADDRESS:", response.data);

    return response.data;

  } catch (error) {
  this.handleAxiosError(error);
}
}

// ─────────────────────────────────────────
// CAPTURE FINGERPRINT PID
// ─────────────────────────────────────────
async captureFingerprintPid() {

  try {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // =========================
    // Generate WADH
    // =========================

    const ra = "F";
    const rc = "Y";
    const lr = "Y";
    const de = "N";
    const pfr = "N";

    const text = "2.5" + ra + rc + lr + de + pfr;

    const wadh = crypto
      .createHash("sha256")
      .update(text)
      .digest("base64");

    console.log("WADH:", wadh);

    // =========================
    // PID XML
    // =========================

    const pidOptions = `
      <PidOptions ver="1.0">
        <Opts
          env="P"
          fCount="1"
          fType="2"
          format="0"
          pidVer="2.0"
          timeout="10000"
          posh="UNKNOWN"
          wadh="${wadh}"
        />
      </PidOptions>
    `;

    // =========================
    // RD CAPTURE
    // =========================

    const captureResponse = await axios({
      method: "CAPTURE",
      url: "https://127.0.0.1:11100/rd/capture",
      data: pidOptions,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      headers: {
        "Content-Type": "application/xml"
      }
    });

    console.log("Fingerprint Captured");

    const pidXml = captureResponse.data;

    console.log("PID XML:");
    console.log(pidXml);

    // =========================
    // BASE64 ENCODE
    // =========================

    const fingerPrintAuthPid =
      Buffer.from(pidXml, "utf8").toString("base64");

    return {
      status: "success",
      pidXml,
      fingerPrintAuthPid
    };

  } catch (error) {
  this.handleAxiosError(error);
}
}
  //Biometric (FingerPrint ) For Creation of ABHA Profile

  async createAbhaUsingFingerprint(aadhaar: string, mobile: string, fingerPrintAuthPid: string) {
    try {
      const token = await getAbhaToken();
      const publicKey = await getPublicKey();
      const encryptedAadhaar = encryptData(aadhaar, publicKey);
      console.log("Encrypted Aadhaar:", encryptedAadhaar);
      const body = {
        authData: {
          authMethods: ["bio"],
          bio: {
            aadhaar: encryptedAadhaar,
            fingerPrintAuthPid: fingerPrintAuthPid,
            mobile: mobile
          }
        },
        consent: {
          code: "abha-enrollment",
          version: "1.4"
        }
      };

      const headers = getAbhaHeaders(token);
      const response = await axios.post(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/byAadhaar`,
        body,
        { headers }
      );
      return response.data;

    }

    catch (error) {
  this.handleAxiosError(error);
}
  }

// ─────────────────────────────────────────
  // STEP 1 - INIT FACE AUTH
  // ─────────────────────────────────────────
  async initFaceAuth(): Promise<FaceInitResponse> {

    try {

      const token = await getAbhaToken();

      const body = {
        scope: ["abha-enrol", "face-auth"]
      };

      const headers = getAbhaHeaders(token);

      const response = await axios.post<FaceInitResponse>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/auth/init`,
        body,
        { headers }
      );

      
      console.log("FACE INIT SUCCESS:", response.data);

      return response.data;

    } catch (error) {
  this.handleAxiosError(error);
}
  }

  // ─────────────────────────────────────────
  // STEP 2 - CAPTURE PID
  // ─────────────────────────────────────────
  async captureFacePid(
    txnId: string
  ): Promise<FacePidResponse & { faceAuthUrl: string }> {

    try {

      const token = await getAbhaToken();

      const body = {
        scope: ["abha-enrol", "face-verify"],
        txnId: txnId
      };

      const headers = getAbhaHeaders(token);

      const response = await axios.post<FacePidResponse>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/capturePID`,
        body,
        { headers }
      );

      console.log("FACE PID SUCCESS:", response.data);

      return {
        ...response.data,
        faceAuthUrl: `https://phrsbx.abdm.gov.in/face-auth?txnId=${txnId}`
      };

    } catch (error) {
  this.handleAxiosError(error);
}
  }

  // ─────────────────────────────────────────
  // STEP 3 - CREATE ABHA USING FACE
  // ─────────────────────────────────────────
  async createAbhaUsingFace(
    txnId: string,
    aadhaar: string,
    mobile: string
  ): Promise<FaceEnrollResponse> {

    try {

      const token = await getAbhaToken();
      const publicKey = await getPublicKey();

      const encryptedAadhaar = encryptData(aadhaar, publicKey);

      console.log("Encrypted Aadhaar:", encryptedAadhaar);

      const body = {
        authData: {
          authMethods: ["face_auth"],
          face: {
            txnId: txnId,
            aadhaar: encryptedAadhaar,
            mobile: mobile
          }
        },
        consent: {
          code: "abha-enrollment",
          version: "1.4"
        }
      };

      const headers = getAbhaHeaders(token);

      const response = await axios.post<FaceEnrollResponse>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/enrollment/enrol/byAadhaar`,
        body,
        { headers }
      );

      console.log("FACE ENROLL SUCCESS:", response.data);

      return response.data;

    } catch (error) {
  this.handleAxiosError(error);
}
  }

 async sendMobileOtp(
  profileId: number,
  mobile: string
) {
  try {

    // Step 1 - Get ABDM Access Token
    const token = await getAbhaToken();
     console.log("STEP 1 - Access token exists:", !!token);

    // Step 2 - Get Public Key
    const publicKey = await getPublicKey();
 console.log("STEP 2 - Public key exists:", !!publicKey);
    // Step 3 - Encrypt Mobile Number
    const encryptedMobile = encryptData(mobile, publicKey);
 console.log("STEP 3 - Mobile valid:", /^[6-9]\d{9}$/.test(mobile));
    console.log(
      "STEP 3 - Encrypted mobile exists:",
      !!encryptedMobile
    );
    console.log(
      "STEP 3 - Encrypted mobile length:",
      encryptedMobile?.length
    );
    // Step 4 - Get X-Token from DB
    const xToken = await AbhaProfileService.getXToken(profileId);

    // Step 5 - Common Headers
    const headers = getAbhaHeaders(token);
    headers["X-Token"] = `Bearer ${xToken}`;
    console.log("STEP 5 - Headers prepared");
    console.log("Authorization exists:", !!headers["Authorization"]);
    console.log("X-Token exists:", !!headers["X-Token"]);
    // Step 6 - Request Body
    const body = {
      scope: [
        "abha-profile",
        "mobile-verify"
      ],
      loginHint: "mobile",
      loginId: encryptedMobile,
      otpSystem: "abdm"
    };
console.log("===== TOKEN DEBUG =====");

console.log("profileId:", profileId);

console.log("xToken exists:", !!xToken);

console.log(
  "xToken length:",
  xToken?.length
);

console.log(
  "xToken has Bearer:",
  xToken?.startsWith("Bearer ")
);
    // Step 7 - API Call
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/request/otp`,
      body,
      { headers }
    );

    console.log("SEND MOBILE OTP SUCCESS:", response.data);

    return response.data;

  } catch (error: any) {

    console.log("===== ABHA ERROR =====");

    if (axios.isAxiosError(error)) {

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "DATA:",
        error.response?.data
      );

      console.log(
        "URL:",
        error.config?.url
      );

    } else {

      console.log("ERROR:", error);

    }

    throw error;
  }
}

async verifyMobileOtp(
  profileId: number,
  txnId: string,
  otp: string
) {
  try {

    // Step 1 - Get ABDM Access Token
    const token = await getAbhaToken();

    // Step 2 - Get Public Key
    const publicKey = await getPublicKey();

    // Step 3 - Encrypt OTP
    const encryptedOtp = encryptData(otp, publicKey);

    // Step 4 - Get X-Token
    const xToken = await AbhaProfileService.getXToken(profileId);

    // Step 5 - Common Headers
    const headers = getAbhaHeaders(token);
    headers["X-Token"] = `Bearer ${xToken}`;

    // Step 6 - Request Body
    const body = {
      scope: [
        "abha-profile",
        "mobile-verify"
      ],
      authData: {
        authMethods: ["otp"],
        otp: {
          txnId,
          otpValue: encryptedOtp
        }
      }
    };

    // Step 7 - API Call
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/account/verify`,
      body,
      { headers }
    );

    console.log("VERIFY MOBILE OTP SUCCESS:", response.data);

    return response.data;

  } catch (error) {
  this.handleAxiosError(error);
}
}

// ******************************************************* //
             // LOGIN ABHA 
// ******************************************************* //
  
async requestFaceAuth(loginId: string) {
  try {
    const token = await getAbhaToken();
    const publicKey = await getPublicKey();
    const encryptedLoginId = encryptData(loginId, publicKey);

    const body = {
      scope: [
        "abha-login",
        "aadhaar-face-verify"
      ],
      loginHint: "abha-number",
      loginId: encryptedLoginId,
      otpSystem: "aadhaar"
    };

    const headers = getAbhaHeaders(token);

    console.log("FACE AUTH REQUEST URL:", `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/request/otp`);
    console.log("FACE AUTH REQUEST SCOPE:", body.scope);
    console.log("FACE AUTH REQUEST LOGIN HINT:", body.loginHint);
    console.log("FACE AUTH REQUEST OTP SYSTEM:", body.otpSystem);

    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/request/otp`,
      body,
      { headers }
    );

    console.log("FACE AUTH REQUEST SUCCESS:", response.data);

    return response.data;

  } catch (error) {
    this.handleAxiosError(error);
  }
}

async verifyFaceAuth(txnId: string, faceAuthPid: string) {
  try {
    const token = await getAbhaToken();

    const body = {
      scope: [
        "abha-login",
        "aadhaar-face-verify"
      ],
      authData: {
        authMethods: ["face"],
        face: {
          txnId,
          faceAuthPid
        }
      }
    };

    const headers = getAbhaHeaders(token);

    console.log("FACE AUTH VERIFY URL:", `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`);
    console.log("FACE AUTH VERIFY TXN ID:", txnId);

    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`,
      body,
      { headers }
    );

    console.log("FACE AUTH VERIFY SUCCESS:", response.data);

    return response.data;

  } catch (error) {
    this.handleAxiosError(error);
  }
}

async sendLoginOtp(
  loginType: string,
  loginId: string
) {
  try {

    // Step 1 - Get ABDM Access Token
    const token = await getAbhaToken();

    // Step 2 - Get Public Key
    const publicKey = await getPublicKey();

    // Step 3 - Encrypt Login ID
    const encryptedLoginId = encryptData(loginId, publicKey);

    let scope: string[] = [];
    let loginHint = "";
    let otpSystem = "";

    // Step 4 - Determine Login Type
    switch (loginType) {

      case "abha-number-aadhaar-otp":
        scope = [
          "abha-login",
          "aadhaar-verify"
        ];
        loginHint = "abha-number";
        otpSystem = "aadhaar";
        break;

      case "aadhaar-aadhaar-otp":
        scope = [
          "abha-login",
          "aadhaar-verify"
        ];
        loginHint = "aadhaar";
        otpSystem = "aadhaar";
        break;

      case "mobile-mobile-otp":
        scope = [
          "abha-login",
          "mobile-verify"
        ];
        loginHint = "mobile";
        otpSystem = "abdm";
        break;

      case "abha-number-abha-otp":
        scope = [
          "abha-login",
          "mobile-verify"
        ];
        loginHint = "abha-number";
        otpSystem = "abdm";
        break;

      default:
        throw new Error("Invalid login type");
    }

    // Step 5 - Request Body
    const body = {
      scope,
      loginHint,
      loginId: encryptedLoginId,
      otpSystem
    };

    // Step 6 - Headers
    const headers = getAbhaHeaders(token);

    console.log("LOGIN TYPE:", loginType);
    console.log("REQUEST URL:", `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/request/otp`);
    console.log("REQUEST BODY:", body);

    // Step 7 - Call ABDM API
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/request/otp`,
      body,
      { headers }
    );

    console.log("LOGIN OTP SENT:", response.data);

    return response.data;

  } catch (error) {
  this.handleAxiosError(error);
}
}
async verifyLoginOtp(
  loginType: string,
  txnId: string,
  otp: string
) {
  try {

    // Step 1 - Get ABDM Access Token
    const token = await getAbhaToken();

    // Step 2 - Get Public Key
    const publicKey = await getPublicKey();

    // Step 3 - Encrypt OTP
    const encryptedOtp = encryptData(otp, publicKey);

    let scope: string[] = [];

    // Step 4 - Determine Scope
    switch (loginType) {

      case "abha-number-aadhaar-otp":
      case "aadhaar-aadhaar-otp":
        scope = [
          "abha-login",
          "aadhaar-verify"
        ];
        break;

      case "mobile-mobile-otp":
      case "abha-number-abha-otp":
        scope = [
          "abha-login",
          "mobile-verify"
        ];
        break;

      default:
        throw new Error("Invalid login type");
    }

    // Step 5 - Request Body
    const body = {
      scope,
      authData: {
        authMethods: ["otp"],
        otp: {
          txnId,
          otpValue: encryptedOtp
        }
      }
    };

    // Step 6 - Headers
    const headers = getAbhaHeaders(token);

    console.log("LOGIN TYPE:", loginType);
    console.log("REQUEST URL:", `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`);
    console.log("REQUEST BODY:", body);

    // Step 7 - Call ABDM API
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`,
      body,
      { headers }
    );

    console.log("LOGIN VERIFY SUCCESS:", response.data);


    // ✅ save/update profile(s), same pattern as enrollment flow
    const savedProfiles = await AbhaProfileService.createOrUpdateFromLogin(response.data);

    return {
      ...response.data,
      profiles: savedProfiles.map(p => ({ id: p.id, abha_number: p.abha_number })),
    };

  } catch (error) {
  this.handleAxiosError(error);
}
}

async verifyMobileLoginOtp(
  txnId: string,
  otp: string
) {
  try {

    const token = await getAbhaToken();
    const publicKey = await getPublicKey();

    const encryptedOtp = encryptData(otp, publicKey);

    const body = {
      scope: [
        "abha-login",
        "mobile-verify"
      ],
      authData: {
        authMethods: ["otp"],
        otp: {
          txnId,
          otpValue: encryptedOtp
        }
      }
    };

    const headers = getAbhaHeaders(token);

    console.log("REQUEST URL:",
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`
    );

    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/login/verify`,
      body,
      { headers }
    );

    console.log("MOBILE LOGIN VERIFY SUCCESS:", response.data);

    const savedProfiles =
      Array.isArray(response.data?.accounts) && response.data?.token
        ? await AbhaProfileService.createOrUpdateFromLogin(response.data)
        : [];

    return {
      ...response.data,
      profiles: savedProfiles.map(p => ({
        id: p.id,
        abha_number: p.abha_number
      }))
    };

  } catch (error) {
    this.handleAxiosError(error);
  }
}

async sendAbhaAddressOtp(
  loginType: string,
  loginId: string
) {
  try {

    // Step 1 - Get ABDM Access Token
    const token = await getAbhaToken();

    // Step 2 - Get Public Key
    const publicKey = await getPublicKey();

    // Step 3 - Encrypt ABHA Address
    const encryptedLoginId = encryptData(loginId, publicKey);

    let scope: string[] = [];
    let otpSystem = "";

    // Step 4 - Determine Login Type
    switch (loginType) {

      case "abha-address-mobile-otp":
        scope = [
          "abha-address-login",
          "mobile-verify"
        ];
        otpSystem = "abdm";
        break;

      case "abha-address-aadhaar-otp":
        scope = [
          "abha-address-login",
          "aadhaar-verify"
        ];
        otpSystem = "aadhaar";
        break;

      default:
        throw new Error("Invalid login type");
    }

    // Step 5 - Request Body
    const body = {
      scope,
      loginHint: "abha-address",
      loginId: encryptedLoginId,
      otpSystem
    };

    // Step 6 - Headers
    const headers = getAbhaHeaders(token);

    console.log("REQUEST URL:",
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/abha/request/otp`
    );
    console.log("REQUEST BODY:", body);

    // Step 7 - Call API
    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/abha/request/otp`,
      body,
      { headers }
    );

    console.log("SEND OTP SUCCESS:", response.data);

    return response.data;

  } catch (error: any) {

    console.log("SEND OTP ERROR");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log(error.message);
    }

    throw error;
  }
}
async verifyAbhaAddressOtp(
  loginType: string,
  txnId: string,
  otp: string
) {
  try {

    const token = await getAbhaToken();

    const publicKey = await getPublicKey();

    const encryptedOtp = encryptData(otp, publicKey);

    let scope: string[] = [];

    switch (loginType) {

      case "abha-address-mobile-otp":
        scope = [
          "abha-address-login",
          "mobile-verify"
        ];
        break;

      case "abha-address-aadhaar-otp":
        scope = [
          "abha-address-login",
          "aadhaar-verify"
        ];
        break;

      default:
        throw new Error("Invalid login type");
    }

    const body = {
      scope,
      authData: {
        authMethods: [
          "otp"
        ],
        otp: {
          txnId,
          otpValue: encryptedOtp
        }
      }
    };

    const headers = getAbhaHeaders(token);

    console.log("REQUEST URL:",
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/abha/verify`
    );
    console.log("REQUEST BODY:", body);

    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/phr/web/login/abha/verify`,
      body,
      { headers }
    );

    console.log("VERIFY SUCCESS:", response.data);
    console.log("[ABHA ADDRESS][VERIFY] ABDM verification successful");

    const savedProfiles = await AbhaProfileService.createOrUpdateFromAbhaAddressLogin(response.data);

    console.log(
      "[ABHA ADDRESS][VERIFY] Local profiles saved:",
      savedProfiles.map(p => ({
        id: p.id,
        abha_number: p.abha_number,
        abha_address: p.abha_address,
        name: p.name
      }))
    );

    console.log(
      "[ABHA ADDRESS][VERIFY] Returning profile IDs:",
      savedProfiles.map(p => p.id)
    );

    return {
      ...response.data,
      profiles: savedProfiles.map(p => ({
        id: p.id,
        abha_number: p.abha_number,
        abha_address: p.abha_address,
        name: p.name
      }))
    };

  } catch (error: any) {

    console.log("VERIFY OTP ERROR");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log(error.message);
    }

    throw error;
  }
}











 //-------------------------------------
 //        MielStone -2 
 //-------------------------------------

 async linkCareContext(
  body: any,
  hipId: string,
  linkToken: string
 ) 
 {
   try 
   {

    // Step 1 - Get ABDM Access Token
     const token = await getAbhaToken();

    // Step 2 - Create common headers with Authorization
    const headers = getAbhaHeaders(token);

    // Step 3 - Add HIP ID
    headers["X-HIP-ID"] = hipId;

    // Step 4 - Add Link Token
    headers["X-LINK-TOKEN"] = linkToken;

    console.log("HEADERS:", headers);

    const response = await axios.post(
      `${ABHA_CONFIG.ABHA.hiecmBaseUrl}/hip/v3/link/carecontext`,
      body,
      { headers }
    );

    console.log("CARE CONTEXT RESPONSE:", response.data);

    return response.data;

  } catch (error) {
  this.handleAxiosError(error);
}
 
} 

async getTriagePatientDetails(triageId: number) {
  const triage = await AbhaProfileRepository.getTriagePatientDetails(triageId);

  if (!triage) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return {
    abhaNumber: triage.abha_card,
    gender: triage.gender,
    name: triage.name_of_patient,
    yearOfBirth: currentYear - (triage.age_year ?? 0)
  };
}

private handleAxiosError(error: any): never {
  if (axios.isAxiosError(error) && error.response) {
    throw {
      status: error.response.status,
      data: error.response.data
    };
  }

  throw {
    status: 500,
    data: {
      message: error.message || "Internal Server Error"
    }
  };
}
}








// ─────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────

export interface AadhaarEnrollmentRequest {
  aadhaar: string;
  districtCode: string;
  stateCode: string;
  dateOfBirth: string;
  gender: string;
  name: string;
  mobile?: string;
  pinCode?: string;
}

export interface FaceInitResponse {
  txnId: string;
  message: string;
}

export interface FacePidResponse {
  status: string;
  message: string;
}

export interface FaceEnrollResponse {
  abhaNumber?: string;
  abhaAddress?: string;
  message?: string;
  txnId?: string;
  status?: string;
}



export default new AbhaService();