import axios from "axios";
import { ABHA_CONFIG } from "../../config/abha.config";
import { getAbhaHeaders } from "../../utils/abha/abhaHeaders";


let accessToken: string | null = null;
let tokenExpiry: number | null = null;


// ✅ Add this interface
interface AbhaTokenResponse {
  accessToken: string;
  expiresIn: number;
}


export async function getAbhaToken(): Promise<string> {

       

    if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
        return accessToken;
    }

    const response = await axios.post<AbhaTokenResponse>(
        ABHA_CONFIG.ABHA.tokenUrl,
        {
            clientId: ABHA_CONFIG.ABHA.clientId,
            clientSecret: ABHA_CONFIG.ABHA.clientSecret,
            grantType: ABHA_CONFIG.ABHA.grantType
        },
        {
            headers: getAbhaHeaders()
        }
    );

    //console.log("ABHA Token Response:", response.data);
    accessToken = response.data.accessToken;

    tokenExpiry = Date.now() + (response.data.expiresIn * 1000);

    return accessToken!;
}