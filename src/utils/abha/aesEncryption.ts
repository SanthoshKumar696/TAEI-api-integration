import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

// 🔑 get key from env (32 bytes)
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.ABHA_ENCRYPTION_KEY || "default_secret")
  .digest();

// 🧂 generate salt
function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

// 🔁 encrypt json function
export function encryptJSON(data: any) {

  const jsonString = JSON.stringify(data);

  const salt = generateSalt(); // ✅ salt
  const iv = crypto.randomBytes(16); // ✅ IV

  // combine data + salt
  const dataWithSalt = jsonString + "::" + salt;

  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(dataWithSalt, "utf8", "base64");
  encrypted += cipher.final("base64");

  return {
    encryptedData: encrypted,
    iv: iv.toString("base64"),
    salt: salt
  };
}

// 🔓 decrypt jsonfunction
export function decryptJSON(encryptedData: string, iv: string) {

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  // remove salt
  const originalData = decrypted.split("::")[0];

  return JSON.parse(originalData);
}


/// encrypt string 
export function encryptString(data: string, iv: string) {
  const salt = generateSalt(8);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );
  let encrypted = cipher.update(data + "::" + salt, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}

// decrypt string 
export function decryptString(encryptedData: string, iv: string) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted.split("::")[0];
}