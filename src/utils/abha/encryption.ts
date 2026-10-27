import crypto from "crypto";

export function encryptData(data: string, publicKey: string): string {

    const buffer = Buffer.from(data);

    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha1"
        },
        buffer
    );

    return encrypted.toString("base64");
}