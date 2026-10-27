import { decryptJSON, decryptString, encryptJSON, encryptString } from "../../utils/abha/aesEncryption";
import AbhaProfileRepository from "../../repositories/AbhaProfileRepository";

class AbhaProfileService {

  async createProfile(abhaResponse: any) {

    console.log("==== PROFILE SERVICE CREATE START ====");
    console.log("Full ABHA Response type check");

    // ─────────────────────────────────────────
    // NORMALIZE RESPONSE FORMAT
    // ─────────────────────────────────────────
    
    let abhaProfile: any;
    let tokens: any;
    let abhaNumber: string;

    // Check if this is wrapped format (existing OTP/biometric/face flows)
    if (abhaResponse?.ABHAProfile) {
      console.log("[ABHA PROFILE] Response structure: WRAPPED_ABHA_PROFILE");
      abhaProfile = abhaResponse.ABHAProfile;
      tokens = abhaResponse.tokens;
      abhaNumber = abhaProfile.ABHANumber;
    } 
    // Check if this is direct ABDM format (new demo_auth enrollment)
    else if (abhaResponse?.healthIdNumber || abhaResponse?.healthId) {
      console.log("[ABHA PROFILE] Response structure: DIRECT_ABDM_PROFILE");
      abhaProfile = abhaResponse;
      
      // Extract tokens from jwtResponse or direct token fields
      tokens = abhaResponse.jwtResponse ? {
        token: abhaResponse.jwtResponse.token,
        expiresIn: abhaResponse.jwtResponse.expiresIn,
        refreshToken: abhaResponse.jwtResponse.refreshToken,
        refreshExpiresIn: abhaResponse.jwtResponse.refreshExpiresIn
      } : {
        token: abhaResponse.token,
        expiresIn: abhaResponse.expiresIn || 1800,
        refreshToken: abhaResponse.refreshToken,
        refreshExpiresIn: abhaResponse.refreshExpiresIn || 1296000
      };
      
      // ABHA number can be in healthId or healthIdNumber
      abhaNumber = abhaResponse.healthId || abhaResponse.healthIdNumber;
      
      if (!abhaNumber) {
        throw new Error("Invalid ABHA response: missing healthId or healthIdNumber");
      }
      
      console.log("[ABHA PROFILE] Health ID extracted:", abhaNumber);
    } 
    else {
      console.log("[ABHA PROFILE] ERROR - Response structure not recognized");
      throw new Error("Invalid ABHA response: neither wrapped ABHAProfile nor direct ABDM format detected");
    }

    if (!abhaProfile) {
      throw new Error("Invalid ABHA response: profile data missing");
    }

    if (!tokens) {
      throw new Error("Invalid ABHA response: token data missing");
    }

    console.log("[ABHA PROFILE] Profile data validated");
    console.log("[ABHA PROFILE] Token data validated");

    // 🔐 ENCRYPT profile
    console.log("[ABHA PROFILE] Encrypting profile");
    const { encryptedData, iv, salt } = encryptJSON(abhaProfile);
    console.log("[ABHA PROFILE] Profile encrypted successfully");

    // ✅ Calculate expiry from ABHA response
    const now = new Date();
    const xTokenExpiry = this.toIST(new Date(now.getTime() + tokens.expiresIn * 1000));
    const refreshTokenExpiry = this.toIST(new Date(now.getTime() + tokens.refreshExpiresIn * 1000));

    console.log("[ABHA PROFILE] X-Token expiry calculated");
    console.log("[ABHA PROFILE] Refresh token expiry calculated");

    const data = {
      abha_number: abhaNumber,
      encrypted_profile: encryptedData,
      iv: iv,
      salt: salt,
      x_token_expiry: xTokenExpiry,
      refresh_token_expiry: refreshTokenExpiry,
      x_token: tokens.token,
      refresh_token: tokens.refreshToken,
      created_by: "system",
      updated_by: "system"
    };

    console.log("[ABHA PROFILE] Upserting profile to database");
    const result = await AbhaProfileRepository.upsertByAbhaNumber(abhaNumber, data);
    
    console.log("[ABHA PROFILE] Profile created/updated successfully, ID:", result.id);

    return result;
  }
async createOrUpdateFromLogin(loginResponse: any) {

    console.log("==== LOGIN SERVICE START ====");
  console.log("Login response received:", {
    accountCount: Array.isArray(loginResponse?.accounts) ? loginResponse.accounts.length : 0,
    tokenPresent: Boolean(loginResponse?.token)
  });

    const accounts = loginResponse?.accounts;

    if (!accounts?.length || !loginResponse?.token) {
      throw new Error("Invalid ABHA login response");
    }

    const now = new Date();
    const xTokenExpiry = this.toIST(new Date(now.getTime() + loginResponse.expiresIn * 1000));
    const refreshTokenExpiry = this.toIST(new Date(now.getTime() + loginResponse.refreshExpiresIn * 1000));

    const results = [];

    for (const account of accounts) {
      const abhaNumber = account.ABHANumber;

      const existing = await AbhaProfileRepository.findByAbhaNumber(abhaNumber);

      if (existing) {
        console.log(`ABHA ${abhaNumber} already exists → refreshing tokens only`);
        const refreshToken =
  loginResponse.refreshToken || existing.refresh_token;

const refreshTokenExpiry =
  loginResponse.refreshExpiresIn
    ? this.toIST(
        new Date(now.getTime() + loginResponse.refreshExpiresIn * 1000)
      )
    : (existing.refresh_token_expiry as Date);

await AbhaProfileRepository.updateTokens(
  existing.id,
  loginResponse.token,
  refreshToken,
  xTokenExpiry,
  refreshTokenExpiry
);
        results.push(existing);
        continue;
      }

      console.log(`New ABHA ${abhaNumber} (from login) → creating with partial data`);

      // 🔐 ENCRYPT whatever profile data login gave us
      const { encryptedData, iv, salt } = encryptJSON(account);

      const data = {
        abha_number: abhaNumber,
        encrypted_profile: encryptedData,
        iv,
        salt,
        x_token_expiry: xTokenExpiry,
        refresh_token_expiry: refreshTokenExpiry,
        x_token: loginResponse.token,
        refresh_token: loginResponse.refreshToken,
        created_by: "system",
        updated_by: "system",
      };

      const saved = await AbhaProfileRepository.upsertByAbhaNumber(abhaNumber, data);
      results.push(saved);
    }

    return results;
  }

  async createOrUpdateFromAbhaAddressLogin(loginResponse: any) {
    console.log("[ABHA ADDRESS][PROFILE] createOrUpdateFromAbhaAddressLogin start");

    if (loginResponse?.authResult !== "success") {
      throw new Error("ABHA Address login failed");
    }

    const users = loginResponse?.users;

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("ABHA Address login succeeded but no profile information was returned.");
    }

    console.log("[ABHA ADDRESS][PROFILE] Users received:", users.length);

    const tokenInfo = loginResponse?.tokens || {};
    const now = new Date();
    const xTokenExpiry = tokenInfo.expiresIn
      ? this.toIST(new Date(now.getTime() + Number(tokenInfo.expiresIn) * 1000))
      : null;
    const refreshTokenExpiry = tokenInfo.refreshExpiresIn
      ? this.toIST(new Date(now.getTime() + Number(tokenInfo.refreshExpiresIn) * 1000))
      : null;

    const results: Array<{ id: number; abha_number: string; abha_address: string | null; name: string | null }> = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const abhaNumber = user?.abhaNumber;

      if (!abhaNumber) {
        continue;
      }

      console.log("[ABHA ADDRESS][PROFILE] Processing user", i + 1);
      console.log("[ABHA ADDRESS][PROFILE] ABHA Number:", abhaNumber);
      console.log("[ABHA ADDRESS][PROFILE] ABHA Address:", user?.abhaAddress || "N/A");

      const profilePayload = {
        abhaAddress: user.abhaAddress,
        fullName: user.fullName,
        abhaNumber: user.abhaNumber,
        status: user.status,
        kycStatus: user.kycStatus,
        age: user.age
      };

      const { encryptedData, iv, salt } = encryptJSON(profilePayload);

      const data = {
        abha_number: abhaNumber,
        encrypted_profile: encryptedData,
        iv,
        salt,
        x_token_expiry: xTokenExpiry,
        refresh_token_expiry: refreshTokenExpiry,
        x_token: tokenInfo.token || null,
        refresh_token: tokenInfo.refreshToken || null,
        created_by: "system",
        updated_by: "system"
      };

      const saved = await AbhaProfileRepository.upsertByAbhaNumber(abhaNumber, data);
      const decryptedProfile = decryptJSON(saved.encrypted_profile, saved.iv) as any;

      results.push({
        id: saved.id,
        abha_number: saved.abha_number,
        abha_address: decryptedProfile?.abhaAddress || decryptedProfile?.abha_address || null,
        name: decryptedProfile?.fullName || decryptedProfile?.name || null
      });

      console.log("[ABHA ADDRESS][PROFILE] Saved profile ID:", saved.id);
    }

    if (!results.length) {
      throw new Error("ABHA Address login succeeded but no profile information was returned.");
    }

    console.log("[ABHA ADDRESS][PROFILE] Profiles saved:", results.length);
    return results;
  }

  async getDecryptedProfile(id: number) {

    const record = await AbhaProfileRepository.findById(id);

    if (!record) {
      throw new Error("ABHA Profile not found");
    }

    const decrypted = decryptJSON(record.encrypted_profile, record.iv);

    return {
      id: record.id,
      abha_number: record.abha_number,
      profile: decrypted,
    };
  }

  async getXToken(profileId: number) {
    const record = await AbhaProfileRepository.findById(profileId);
    if (!record) throw new Error("ABHA Profile not found");
    return record.x_token;
  }

  async getRefreshToken(profileId: number) {
    const record = await AbhaProfileRepository.findById(profileId);
    if (!record) throw new Error("ABHA Profile not found");
    return record.refresh_token;
  }

  async getCardAuth(profileId: number) {
    const record = await AbhaProfileRepository.findById(profileId);
    if (!record) throw new Error("ABHA Profile not found");

    return {
      xToken: record.x_token,
      refreshToken: record.refresh_token,
      refreshTokenExpiry: record.refresh_token_expiry,
      profile: decryptJSON(record.encrypted_profile, record.iv) as any
    };
  }

  private toIST(date: Date): Date {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() + IST_OFFSET);
  }
}

export default new AbhaProfileService();