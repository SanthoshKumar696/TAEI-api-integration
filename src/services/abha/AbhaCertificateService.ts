import axios from "axios";
import { ABHA_CONFIG } from "../../config/abha.config";
import { getAbhaHeaders } from "../../utils/abha/abhaHeaders";
import { getAbhaToken } from "./AbhaTokenService";

let publicKeyCache: string | null = null;

interface PublicKeyResponse {
  publicKey: string;
}

export async function getPublicKey(): Promise<string> {

    if (publicKeyCache) {
        return publicKeyCache;
    }

    const token = await getAbhaToken();

    const response = await axios.get<PublicKeyResponse>(
        `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/public/certificate`,
        { headers: getAbhaHeaders(token) }
    );

    const rawKey = response.data.publicKey;

    // Convert Base64 key to PEM format
    const formattedKey =
`-----BEGIN PUBLIC KEY-----
${rawKey}
-----END PUBLIC KEY-----`;

    publicKeyCache = formattedKey;

    //console.log("Formatted Public Key:");
    //console.log(formattedKey);

    return formattedKey;
}