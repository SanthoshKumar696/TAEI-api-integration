// config.ts

export const ABHA_CONFIG = {
    DB: {
        HOST: "103.172.105.237",
        PORT: 5432,
        USER: "postgres",
        PASSWORD: "Nexova@123",
        NAME: "TAEI"
    },

    ABHA: {
        baseUrl: "https://abhasbx.abdm.gov.in/abha/api",
        hiecmBaseUrl: "https://dev.abdm.gov.in/api/hiecm",
        tokenUrl: "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
        clientId: "SBX_004061",
        clientSecret: "f18a415d-9e74-428a-b33c-0e8651d8d56e",
        grantType: "client_credentials",
        cmId: "sbx",
        BENEFIT_NAME: process.env.BENEFIT_NAME || "TNCMCHIS"
    }
};