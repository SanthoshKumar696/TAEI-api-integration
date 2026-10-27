import { v4 as uuidv4 } from "uuid";
import { ABHA_CONFIG } from "../../config/abha.config";

export function getAbhaHeaders(
    token?: string,
    xToken?: string,
    benefitName?: string,
    tToken?: string
) {

    const headers: any = {
        "Content-Type": "application/json",
        "REQUEST-ID": uuidv4(),
        "TIMESTAMP": new Date().toISOString(),
        "X-CM-ID": ABHA_CONFIG.ABHA.cmId
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

// Used for download ABHA
    if (xToken) {
        const tokenValue = xToken.replace(/^(?:Bearer\s+)+/i, "").trim();
        if (tokenValue) {
            headers["X-token"] = `Bearer ${tokenValue}`;
        }
    }

    if (tToken) {
        const tokenValue = tToken.replace(/^(?:Bearer\s+)+/i, "").trim();
        if (tokenValue) {
            headers["T-token"] = `Bearer ${tokenValue}`;
        }
    }


    if (benefitName) {
        headers["BENEFIT_NAME"] = benefitName;
    }

    return headers;
}