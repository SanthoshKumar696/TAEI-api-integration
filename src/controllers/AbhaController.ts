import { Router, Request, Response, NextFunction } from "express";
import abhaService from "../services/abha/AbhaService";
import { getAbhaToken } from "../services/abha/AbhaTokenService";
import AbhaProfileService from "../services/abha/AbhaProfileService";
import { ABHA_CONFIG } from "../config/abha.config";
import { getAbhaHeaders } from "../utils/abha/abhaHeaders";
import axios from "axios";
const router = Router();

/**
 * @swagger
 * /api/abha/verify-user:
 *   post:
 *     summary: Verify an ABHA user
 *     description: Sends the JWT supplied as tToken in the T-token header to ABDM.
 *     tags: [ABHA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ABHANumber
 *               - txnId
 *               - tToken
 *             properties:
 *               ABHANumber:
 *                 type: string
 *                 example: "91-7281-1583-6245"
 *               txnId:
 *                 type: string
 *                 description: Transaction ID from the OTP flow
 *                 example: "otp-txn-456"
 *               tToken:
 *                 type: string
 *                 description: JWT returned by the existing OTP verification API; sent upstream only as the T-token header
 *                 example: "eyJhbGciOi..."
 *     responses:
 *       200:
 *         description: User verification response returned by ABDM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: ABHANumber, txnId, or tToken is missing
 *       401:
 *         description: ABDM rejected the supplied JWT
 *       403:
 *         description: ABDM denied user verification
 *       502:
 *         description: Unable to verify the user with ABDM
 */
router.post("/verify-user", async (req: Request, res: Response) => {
  try {
    const { ABHANumber, txnId, tToken } = req.body ?? {};
    const result = await abhaService.verifyAbhaUser(ABHANumber, txnId, tToken);
    return res.status(200).json(result);
  } catch (error) {
    const failure = error as { status?: number; data?: { message?: string } };
    const status = failure.status && failure.status >= 400 && failure.status <= 599
      ? failure.status
      : 502;
    return res.status(status).json({
      message: failure.data?.message || "Unable to verify the ABHA user."
    });
  }
});

/**
 * @swagger
 * /api/abha/download-phr-card:
 *   get:
 *     summary: Download an ABHA PHR card
 *     description: Downloads the PHR card using the ABHA user's X-token.
 *     tags: [ABHA]
 *     parameters:
 *       - in: header
 *         name: X-token
 *         required: true
 *         description: ABHA user token. Include the Bearer prefix.
 *         schema:
 *           type: string
 *         example: Bearer ABHA_USER_TOKEN
 *     responses:
 *       200:
 *         description: ABHA PHR card file
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="abha-phr-card.jpg"
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: X-token is missing, invalid, or expired
 *       403:
 *         description: ABDM denied access to the PHR card
 *       502:
 *         description: Unable to retrieve the PHR card from ABDM
 */
router.get("/download-phr-card", async (req: Request, res: Response) => {
  const xToken = req.header("X-token");
  if (!xToken?.replace(/^Bearer\s+/i, "").trim()) {
    return res.status(401).json({ message: "X-token header is required." });
  }

  try {
    const card = await abhaService.downloadPhrCardFile(xToken);
    const extensionByContentType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "application/pdf": "pdf"
    };
    const extension = extensionByContentType[card.contentType] || "bin";

    res.setHeader("Content-Type", card.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="abha-phr-card.${extension}"`
    );
    return res.status(200).send(card.data);
  } catch (error) {
    const failure = error as { status?: number; data?: { message?: string } };
    const status = failure.status && failure.status >= 400 && failure.status <= 599
      ? failure.status
      : 502;
    return res.status(status).json({
      message: failure.data?.message || "Unable to download the ABHA PHR card."
    });
  }
});

/**
 * @swagger
 * /api/abha/phr-profile:
 *   get:
 *     summary: Get ABHA PHR profile details
 *     description: Retrieves the PHR profile using the ABHA user's X-token.
 *     tags: [ABHA]
 *     parameters:
 *       - in: header
 *         name: X-token
 *         required: true
 *         description: ABHA user token. Include the Bearer prefix.
 *         schema:
 *           type: string
 *         example: Bearer ABHA_USER_TOKEN
 *     responses:
 *       200:
 *         description: PHR profile returned by ABDM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: X-token is missing, invalid, or expired
 *       403:
 *         description: ABDM denied access to the PHR profile
 *       502:
 *         description: Unable to retrieve the PHR profile from ABDM
 */
router.get("/phr-profile", async (req: Request, res: Response) => {
  const xToken = req.header("X-token");
  if (!xToken?.replace(/^Bearer\s+/i, "").trim()) {
    return res.status(401).json({ message: "X-token header is required." });
  }

  try {
    const profile = await abhaService.getPhrProfile(xToken);
    return res.status(200).json(profile);
  } catch (error) {
    const failure = error as { status?: number; data?: { message?: string } };
    const status = failure.status && failure.status >= 400 && failure.status <= 599
      ? failure.status
      : 502;
    return res.status(status).json({
      message: failure.data?.message || "Unable to retrieve the ABHA PHR profile."
    });
  }
});

/**
 * @swagger
 * /api/abha/account-details:
 *   get:
 *     summary: Get ABHA account details
 *     description: Retrieves account details using the ABHA user's X-token supplied in the request header.
 *     tags: [ABHA]
 *     parameters:
 *       - in: header
 *         name: X-token
 *         required: true
 *         description: ABHA user token. Include the Bearer prefix.
 *         schema:
 *           type: string
 *         example: Bearer ABHA_USER_TOKEN
 *     responses:
 *       200:
 *         description: Account details returned by ABDM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *               properties:
 *                 ABHANumber:
 *                   type: string
 *                 preferredAbhaAddress:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 mobileVerified:
 *                   type: boolean
 *                 firstName:
 *                   type: string
 *                 middleName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 name:
 *                   type: string
 *                 yearOfBirth:
 *                   type: integer
 *                 dayOfBirth:
 *                   type: integer
 *                 monthOfBirth:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 profilePhoto:
 *                   type: string
 *       401:
 *         description: X-token is missing, invalid, or expired
 *       403:
 *         description: ABDM denied access to account details
 *       502:
 *         description: Unable to retrieve account details from ABDM
 */
router.get("/account-details", async (req: Request, res: Response) => {
  const xToken = req.header("X-token");
  if (!xToken?.replace(/^Bearer\s+/i, "").trim()) {
    return res.status(401).json({ message: "X-token header is required." });
  }

  try {
    const accountDetails = await abhaService.getAbhaAccountDetails(xToken);
    return res.status(200).json(accountDetails);
  } catch (error) {
    const failure = error as { status?: number; data?: { message?: string } };
    const status = failure.status && failure.status >= 400 && failure.status <= 599
      ? failure.status
      : 502;
    return res.status(status).json({
      message: failure.data?.message || "Unable to retrieve ABHA account details."
    });
  }
});

/**
 * @swagger
 * /api/abha/download-card:
 *   get:
 *     summary: Download an ABHA card
 *     description: Uses the ABHA user's X-token supplied in the request header.
 *     tags: [ABHA]
 *     parameters:
 *       - in: header
 *         name: X-token
 *         required: true
 *         description: ABHA user token. Include the Bearer prefix.
 *         schema:
 *           type: string
 *         example: Bearer ABHA_USER_TOKEN
 *     responses:
 *       200:
 *         description: ABHA card file
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="abha-card.jpg"
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: X-token is missing, invalid, or expired
 *       403:
 *         description: ABDM denied access to the ABHA card
 *       502:
 *         description: ABDM returned an error or unsupported card format
 */
router.get("/download-card", async (req: Request, res: Response) => {
  const xToken = req.header("X-token");
  if (!xToken?.replace(/^Bearer\s+/i, "").trim()) {
    return res.status(401).json({ message: "X-token header is required." });
  }

  try {
    const card = await abhaService.downloadAbhaCardFile(xToken);
    const extensionByContentType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "application/pdf": "pdf"
    };
    const extension = extensionByContentType[card.contentType] || "bin";

    res.setHeader("Content-Type", card.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="abha-card.${extension}"`
    );
    return res.status(200).send(card.data);
  } catch (error) {
    const failure = error as { status?: number; data?: { message?: string } };
    const status = failure.status && failure.status >= 400 && failure.status <= 599
      ? failure.status
      : 502;
    return res.status(status).json({
      message: failure.data?.message || "Unable to download the ABHA card."
    });
  }
});


/**
 * @swagger
 * /api/abha/token:
 *   get:
 *     summary: Get ABHA Gateway Access Token
 *     description: Generates and returns a new ABHA Gateway access token.
 *     tags:
 *       - ABHA
 *     responses:
 *       200:
 *         description: Access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *       500:
 *         description: Failed to generate access token
 */
router.get(
  "/token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("===== ABHA TOKEN START =====");

      const token = await getAbhaToken();

      return res.status(200).json({
        success: true,
        accessToken: token
      });

    } catch (error: any) {

  console.log("===== ABHA TOKEN ERROR =====");

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);

    return res.status(error.response.status).json(error.response.data);
  }

  console.log(error.message);

  return res.status(500).json({
    message: error.message
  });
}
  }
);

import { getPublicKey } from "../services/abha/AbhaCertificateService";

/**
 * @swagger
 * /api/abha/certificate:
 *   get:
 *     summary: Get ABHA Public Certificate
 *     tags:
 *       - ABHA
 *     responses:
 *       200:
 *         description: Public certificate retrieved successfully
 */
router.get("/certificate", async (req: Request, res: Response) => {
  try {

    const token = await getAbhaToken();

    const response = await axios.get(
      `${ABHA_CONFIG.ABHA.baseUrl}/v3/profile/public/certificate`,
      {
        headers: getAbhaHeaders(token)
      }
    );

    return res.status(200).json(response.data);

  } catch (error: any) {

    return res.status(error.response?.status || 500).json({
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

  }
});
/**
     * @swagger
     * /api/abha/aadhaar/generate-otp:
     *   post:
     *     summary: Generate Aadhaar OTP for ABHA creation
     *     description: Encrypts Aadhaar using ABHA public certificate and sends OTP.
     *     tags:
     *       - ABHA
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - aadhaar
     *             properties:
     *               aadhaar:
     *                 type: string
     *                 example: "123412341234"
     *     responses:
     *       200:
     *         description: OTP generated successfully
     *       400:
     *         description: Invalid request
     *       500:
     *         description: Server error
     */
router.post("/aadhaar/generate-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { aadhaar } = req.body;

    const result = await abhaService.generateAadhaarOtp(aadhaar);

    res.json(result);

  } catch (error: any) {
  console.log("===== ABHA Create Error =====");
  console.log(error);

  return res.status(error.status || 500).json(error.data);
}
});


/**
 * @swagger
 * /api/abha/aadhaar/verify-otp:
 *   post:
 *     summary: Verify Aadhaar OTP and enroll ABHA
 *     tags: [ABHA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: d1616dcd-e5cb-4f0e-ba34-83c74a22bc10
 *               otp:
 *                 type: string
 *                 example: 123456
 *               mobile:
 *                 type: string
 *                 example: 9999999999
 *     responses:
 *       200:
 *         description: ABHA Created Successfully
 */
router.post("/aadhaar/verify-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { txnId, otp, mobile } = req.body;

    console.log("==== CONTROLLER START ====");
    console.log("Request Body:", req.body);

    const result = await abhaService.verifyAadhaarOtp(txnId, otp, mobile);

    // ✅ ALWAYS SAVE (NO triageId needed)
    const profile = await AbhaProfileService.createProfile(result);

    console.log("ABHA SAVED, PROFILE ID:", profile.id);

    res.json({
      result,
      profileId: profile.id   // 👈 VERY IMPORTANT
    });

  } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
});

/**
 * @swagger
 * /api/abha/aadhaar/enrol-by-aadhaar:
 *   post:
 *     summary: Enroll ABHA using Aadhaar demo authentication
 *     description: Creates ABHA profile using Aadhaar-based demo authentication with demographic fields. Aadhaar is encrypted before being sent to ABDM.
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aadhaar
 *               - districtCode
 *               - stateCode
 *               - dateOfBirth
 *               - gender
 *               - name
 *             properties:
 *               aadhaar:
 *                 type: string
 *                 description: Aadhaar number (12 digits)
 *                 example: "123412341234"
 *               districtCode:
 *                 type: string
 *                 description: ABDM district code
 *                 example: "589"
 *               stateCode:
 *                 type: string
 *                 description: ABDM state code
 *                 example: "33"
 *               dateOfBirth:
 *                 type: string
 *                 description: Date of birth in DD-MM-YYYY format
 *                 example: "29-09-2002"
 *               gender:
 *                 type: string
 *                 description: Gender (M, F, or O)
 *                 enum: ["M", "F", "O"]
 *                 example: "M"
 *               name:
 *                 type: string
 *                 description: Full name
 *                 example: "John Doe"
 *               mobile:
 *                 type: string
 *                 description: Mobile number (10 digits, optional)
 *                 example: "9999999999"
 *               pinCode:
 *                 type: string
 *                 description: Pin code (6 digits, optional)
 *                 example: "632302"
 *     responses:
 *       200:
 *         description: ABHA enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   description: ABHA enrollment response from ABDM
 *                 profileId:
 *                   type: integer
 *                   description: Saved ABHA profile ID
 *                   example: 1
 *       400:
 *         description: Invalid request or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aadhaar must be exactly 12 digits"
 *                 code:
 *                   type: string
 *                   example: "INVALID_AADHAAR"
 *       500:
 *         description: Server error or ABDM API failure
 */
router.post("/aadhaar/enrol-by-aadhaar", async (req: Request, res: Response, next: NextFunction) => {
  try {

    const {
      aadhaar,
      districtCode,
      stateCode,
      dateOfBirth,
      gender,
      name,
      mobile,
      pinCode
    } = req.body;

    console.log("===== AADHAAR ENROL START =====");
    console.log("Request:", {
      aadhaar: aadhaar ? "****" : undefined,
      districtCode: districtCode ? "present" : undefined,
      stateCode: stateCode ? "present" : undefined,
      dateOfBirth: dateOfBirth ? "present" : undefined,
      gender: gender ? "present" : undefined,
      name: name ? "present" : undefined,
      mobile: mobile ? "present" : undefined,
      pinCode: pinCode ? "present" : undefined
    });

    // Call service method with all fields
    const result = await abhaService.enrolByAadhaar({
      aadhaar,
      districtCode,
      stateCode,
      dateOfBirth,
      gender,
      name,
      mobile,
      pinCode
    });

    // Save ABHA profile in database
    const profile = await AbhaProfileService.createProfile(result);

    console.log("AADHAAR ENROL SAVED, PROFILE ID:", profile.id);

    res.json({
      result,
      profileId: profile.id
    });

  } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
});


/**
 * @swagger
 * /api/abha/profile/{id}:
 *   get:
 *     summary: Get decrypted ABHA profile
 *     description: Fetch encrypted ABHA profile from DB and return decrypted JSON
 *     tags: [ABHA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ABHA Profile ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Decrypted ABHA profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 abha_number:
 *                   type: string
 *                   example: "91-2476-0041-3519"
 *                 profile:
 *                   type: object
 *                   example:
 *                     firstName: "Lavanya"
 *                     lastName: ""
 *                     gender: "M"
 *                     dob: "15-08-2002"
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get("/profile/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {

    const id = Number(req.params.id);

    const data = await AbhaProfileService.getDecryptedProfile(id);

    res.json(data);

  } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
});


/**
 * @swagger
/**
 * @swagger
 * /api/abha/abha-address/card/{id}:
 *   get:
 *     summary: Download ABHA Card
 *     description: Fetch ABHA card as PNG image or PDF
 *     tags: [ABHA]
 *     produces:
 *       - image/png
 *       - application/pdf
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ABHA card file (PNG image or PDF)
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: inline; filename=abha-card.png
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get("/abha/abha-address/card/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cardData = await abhaService.downloadAbhaAddressCard(id);
    
    // Check file header to determine format using buffer comparison
    const isPNG = cardData[0] === 0x89 && 
                  cardData[1] === 0x50 && 
                  cardData[2] === 0x4E && 
                  cardData[3] === 0x47;
    
    const isPDF = cardData[0] === 0x25 &&  // %
                   cardData[1] === 0x50 &&  // P
                   cardData[2] === 0x44 &&  // D
                   cardData[3] === 0x46;    // F
    
    // For debugging - log the actual bytes
    console.log("First 4 bytes (hex):", 
      cardData.slice(0, 4).toString('hex'));
    console.log("Is PNG:", isPNG);
    console.log("Is PDF:", isPDF);
    
    if (isPNG) {
      // Return as PNG image
      res.contentType("image/png");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=abha-card.png"
      );
      return res.send(cardData);
    } else if (isPDF) {
      // Return as PDF
      res.contentType("application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=abha-card.pdf"
      );
      return res.send(cardData);
    } else {
      // Unknown format - log more details
      console.error("Unknown format. First 20 bytes:", 
        cardData.slice(0, 20).toString('hex'));
      console.error("First 20 bytes as string:", 
        cardData.slice(0, 20).toString());
      
      return res.status(500).json({ 
        error: "Invalid file format received",
        details: `Expected PNG or PDF but got header: ${cardData.slice(0, 4).toString('hex')}`,
        hint: "The service returned a file with unknown format"
      });
    }
    
  } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
});



/**
 * @swagger
 * /api/abha/address/suggestions:
 *   get:
 *     summary: Get ABHA Address Suggestions
 *     tags: [ABHA Enrollment]
 *     parameters:
 *       - in: header
 *         name: Transaction_Id
 *         required: true
 *         schema:
 *           type: string
 *         example: b625586a-2fae-4c01-96b9-b534906691f6
 *     responses:
 *       200:
 *         description: ABHA Suggestions Retrieved Successfully
 */
router.get(
  "/address/suggestions",
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId =
      req.header("X-Request-Id") ||
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const startTime = Date.now();

    console.log("====================================================");
    console.log("[ABHA][CONTROLLER] ADDRESS SUGGESTIONS - START");
    console.log("[ABHA][CONTROLLER] Request ID:", requestId);
    console.log("[ABHA][CONTROLLER] Time:", new Date().toISOString());
    console.log("[ABHA][CONTROLLER] Method:", req.method);
    console.log("[ABHA][CONTROLLER] URL:", req.originalUrl);
    console.log("[ABHA][CONTROLLER] IP:", req.ip);

    try {
      // --------------------------------------------------
      // STEP 1: Log request headers
      // --------------------------------------------------

      console.log("[ABHA][CONTROLLER][STEP 1] Request received");

      console.log(
        "[ABHA][CONTROLLER][STEP 1] All Headers:",
        JSON.stringify(req.headers, null, 2)
      );

      // --------------------------------------------------
      // STEP 2: Read Transaction_Id
      // --------------------------------------------------

      console.log(
        "[ABHA][CONTROLLER][STEP 2] Reading Transaction_Id header"
      );

      const txnId =
        req.header("Transaction_Id") ||
        req.header("transaction_id") ||
        req.header("transaction-id");

      console.log(
        "[ABHA][CONTROLLER][STEP 2] Transaction_Id exists:",
        !!txnId
      );

      console.log(
        "[ABHA][CONTROLLER][STEP 2] Transaction_Id length:",
        txnId?.length || 0
      );

      console.log(
        "[ABHA][CONTROLLER][STEP 2] Transaction_Id value:",
        txnId || "NOT_RECEIVED"
      );

      // --------------------------------------------------
      // STEP 3: Log other request information
      // --------------------------------------------------

      console.log("[ABHA][CONTROLLER][STEP 3] Request body:", req.body);
      console.log("[ABHA][CONTROLLER][STEP 3] Query:", req.query);
      console.log("[ABHA][CONTROLLER][STEP 3] Params:", req.params);

      // --------------------------------------------------
      // STEP 4: Validate Transaction ID
      // --------------------------------------------------

      if (!txnId) {
        console.error(
          "[ABHA][CONTROLLER][STEP 4] ERROR: Transaction_Id NOT RECEIVED"
        );

        return res.status(400).json({
          success: false,
          message: "Transaction_Id header is required",
          requestId,
        });
      }

      console.log(
        "[ABHA][CONTROLLER][STEP 4] Transaction_Id validation PASSED"
      );

      // --------------------------------------------------
      // STEP 5: Call service
      // --------------------------------------------------

      console.log(
        "[ABHA][CONTROLLER][STEP 5] Calling abhaService.getAbhaSuggestions()"
      );

      console.log(
        "[ABHA][CONTROLLER][STEP 5] Sending Transaction_Id to service:",
        txnId
      );

      const result = await abhaService.getAbhaSuggestions(
        txnId
      );

      // --------------------------------------------------
      // STEP 6: Service completed
      // --------------------------------------------------

      console.log(
        "[ABHA][CONTROLLER][STEP 6] Service completed successfully"
      );

      console.log(
        "[ABHA][CONTROLLER][STEP 6] Result exists:",
        !!result
      );

      console.log(
        "[ABHA][CONTROLLER][STEP 6] Result type:",
        typeof result
      );

      // --------------------------------------------------
      // STEP 7: Send response
      // --------------------------------------------------

      console.log(
        "[ABHA][CONTROLLER][STEP 7] Sending response to client"
      );

      res.json(result);

      console.log(
        "[ABHA][CONTROLLER][STEP 7] Response sent successfully"
      );

      console.log(
        "[ABHA][CONTROLLER] Total Duration:",
        `${Date.now() - startTime} ms`
      );

      console.log("[ABHA][CONTROLLER] ADDRESS SUGGESTIONS - END");
      console.log("====================================================");

    } catch (error: any) {
      // --------------------------------------------------
      // ERROR LOGGING
      // --------------------------------------------------

      console.error("====================================================");
      console.error("[ABHA][CONTROLLER] ADDRESS SUGGESTIONS - ERROR");

      console.error("[ABHA][CONTROLLER] Request ID:", requestId);

      console.error(
        "[ABHA][CONTROLLER] Duration:",
        `${Date.now() - startTime} ms`
      );

      console.error("[ABHA][CONTROLLER] Error message:", error?.message);

      console.error("[ABHA][CONTROLLER] Error status:", error?.status);

      console.error("[ABHA][CONTROLLER] Error response status:",
        error?.response?.status
      );

      console.error("[ABHA][CONTROLLER] Error response data:",
        error?.response?.data
      );

      console.error("[ABHA][CONTROLLER] Error stack:",
        error?.stack
      );

      console.error("[ABHA][CONTROLLER] Request headers:",
        JSON.stringify(req.headers, null, 2)
      );

      console.error(
        "[ABHA][CONTROLLER] Transaction_Id:",
        req.header("Transaction_Id") || "NOT_RECEIVED"
      );

      console.error("[ABHA][CONTROLLER] Body:", req.body);
      console.error("[ABHA][CONTROLLER] Query:", req.query);

      console.error("====================================================");

      return res
        .status(error?.status || error?.response?.status || 500)
        .json(error?.data || error?.response?.data || {
          success: false,
          message: error?.message || "Internal server error",
          requestId,
        });
    }
  }
);

/**
 * @swagger
 * /api/abha/address/create:
 *   post:
 *     summary: Create Custom ABHA Address
 *     tags: [ABHA Enrollment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - abhaAddress
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: "45a86e71-99e6-4085-94f6-62bd58869a12"
 *               abhaAddress:
 *                 type: string
 *                 example: "lavanya_abha1507"
 *               preferred:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: ABHA Address Created Successfully
 */
router.post(
  "/address/create",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const result = await abhaService.createCustomAbhaAddress(
        req.body.txnId,
        req.body.abhaAddress,
        req.body.preferred
      );

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}

  }
);

/**
 * @swagger
 * /api/abha/fingerprint/capture:
 *   post:
 *     summary: Capture Fingerprint PID
 *     description: Captures fingerprint from RD service and returns Base64 PID
 *     tags:
 *       - ABHA
 *     responses:
 *       200:
 *         description: Fingerprint captured successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/fingerprint/capture",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      console.log("===== FINGERPRINT CAPTURE START =====");

      const result = await abhaService.captureFingerprintPid();

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);

/**
 * @swagger
 * /api/abha/aadhaar/biometric-fingerprint-enroll:
 *   post:
 *     summary: Create ABHA using Biometric Fingerprint
 *     description: Creates ABHA profile using Aadhaar biometric authentication (fingerprint PID).
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aadhaar
 *               - mobile
 *               - fingerPrintAuthPid
 *             properties:
 *               aadhaar:
 *                 type: string
 *                 example: "123412341234"
 *               mobile:
 *                 type: string
 *                 example: "xxxxxxxx98"
 *               fingerPrintAuthPid:
 *                 type: string
 *                 example: "<PID>BASE64_FINGERPRINT_DATA</PID>"
 *     responses:
 *       200:
 *         description: ABHA created successfully using biometric
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                 profileId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post(
  "/aadhaar/biometric-fingerprint-enroll",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { aadhaar, mobile, fingerPrintAuthPid } = req.body;

      console.log("===== BIOMETRIC CONTROLLER START =====");
      console.log("Request:", req.body);

      if (!aadhaar || !mobile || !fingerPrintAuthPid) {
        return res.status(400).json({
          message: "aadhaar, mobile and fingerPrintAuthPid are required"
        });
      }

      // Step 1 - Create ABHA
      const result = await abhaService.createAbhaUsingFingerprint(
        aadhaar,
        mobile,
        fingerPrintAuthPid
      );

      // Step 2 - Save Profile in DB
      const profile = await AbhaProfileService.createProfile(result);

      console.log("BIOMETRIC ABHA SAVED:", profile.id);

      res.json({
        result,
        profileId: profile.id
      });

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);


/**
 * @swagger
 * /api/abha/face/init:
 *   post:
 *     summary: Initialize ABHA Face Authentication
 *     description: Creates transaction ID for Face Authentication
 *     tags:
 *       - ABHA
 *     responses:
 *       200:
 *         description: Face transaction created successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/face/init",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("===== FACE INIT START =====");

      const result = await abhaService.initFaceAuth();

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);

/**
 * @swagger
 * /api/abha/face/capture:
 *   post:
 *     summary: Capture Face PID
 *     description: Generates face authentication URL using txnId
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: 6a1f2dde-8b3f-435a-8be4-1649fb90e945
 *     responses:
 *       200:
 *         description: Face URL generated successfully
 *       400:
 *         description: txnId required
 *       500:
 *         description: Server error
 */
router.post(
  "/face/capture",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("===== FACE CAPTURE START =====");

      const { txnId } = req.body;

      if (!txnId) {
        return res.status(400).json({
          message: "txnId is required"
        });
      }

      const result = await abhaService.captureFacePid(txnId);

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);

/**
 * @swagger
 * /api/abha/face/enroll:
 *   post:
 *     summary: Create ABHA using Face Authentication
 *     description: Creates ABHA using Aadhaar and Face authentication
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - aadhaar
 *               - mobile
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: 6a1f2dde-8b3f-435a-8be4-1649fb90e945
 *               aadhaar:
 *                 type: string
 *                 example: "123412341234"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: ABHA created successfully using Face
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                 profileId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post(
  "/face/enroll",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("===== FACE ENROLL START =====");

      const { txnId, aadhaar, mobile } = req.body;

      if (!txnId || !aadhaar || !mobile) {
        return res.status(400).json({
          message: "txnId, aadhaar and mobile are required"
        });
      }

      // Step 1 - Create ABHA
      const result = await abhaService.createAbhaUsingFace(
        txnId,
        aadhaar,
        mobile
      );

      // Step 2 - Save Profile
      const profile = await AbhaProfileService.createProfile(result);

      console.log("FACE ABHA SAVED:", profile.id);

      res.json({
        result,
        profileId: profile.id
      });

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);
/**
 * @swagger
 * /api/abha/updatemobile/send-otp:
 *   post:
 *     summary: Send OTP to update ABHA mobile number
 *     tags: [ABHA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *               - mobile
 *             properties:
 *               profileId:
 *                 type: integer
 *                 example: 1
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP Sent Successfully
 */
router.post(
  "/updatemobile/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { profileId, mobile } = req.body;

      const result = await abhaService.sendMobileOtpNEW(
        profileId,
        mobile
      );

      res.json(result);

    } catch (error: any) {

      console.log("===== ABHA ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data);
    }

  }
);

/**
 * @swagger
 * /api/abha/updatemobile/verify-otp:
 *   post:
 *     summary: Verify OTP and update ABHA mobile number
 *     tags: [ABHA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *               - txnId
 *               - otp
 *             properties:
 *               profileId:
 *                 type: integer
 *                 example: 1
 *               txnId:
 *                 type: string
 *                 example: "968d7b8f-2a0f-44eb-be21-dc1fc70e327c"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Mobile Number Verified Successfully
 */
router.post(
  "/updatemobile/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { profileId, txnId, otp } = req.body;

      const result = await abhaService.verifyMobileOtp(
        profileId,
        txnId,
        otp
      );

      res.json(result);

    } catch (error: any) {

      console.log("===== ABHA ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data);
    }

  }
);

/**
 * @swagger
 * /api/abha/login/send-otp:
 *   post:
 *     summary: Send OTP for ABHA Login
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginType
 *               - loginId
 *             properties:
 *               loginType:
 *                 type: string
 *                 description: Login method
 *                 enum:
 *                   - abha-number-aadhaar-otp
 *                   - aadhaar-aadhaar-otp
 *                   - mobile-mobile-otp
 *                   - abha-number-abha-otp
 *               loginId:
 *                 type: string
 *                 description: ABHA Number, Aadhaar Number or Mobile Number
 *           examples:
 *             ABHA Number + Aadhaar OTP:
 *               summary: ABHA Number + Aadhaar OTP
 *               value:
 *                 loginType: abha-number-aadhaar-otp
 *                 loginId: "91-4118-5268-3332"
 *             Aadhaar + Aadhaar OTP:
 *               summary: Aadhaar + Aadhaar OTP
 *               value:
 *                 loginType: aadhaar-aadhaar-otp
 *                 loginId: "999988887777"
 *             Mobile + Mobile OTP:
 *               summary: Mobile + Mobile OTP
 *               value:
 *                 loginType: mobile-mobile-otp
 *                 loginId: "9384243598"
 *             ABHA Number + ABHA OTP:
 *               summary: ABHA Number + ABHA OTP
 *               value:
 *                 loginType: abha-number-abha-otp
 *                 loginId: "91-4118-5268-3332"
 *     responses:
 *       200:
 *         description: OTP Sent Successfully
 *         content:
 *           application/json:
 *             example:
 *               txnId: "968d7b8f-2a0f-44eb-be21-dc1fc70e327c"
 *               message: "OTP sent successfully."
 */
/**
 * @swagger
 * /api/abha/login/face/request:
 *   post:
 *     summary: ABHA FaceAuth Request - Generate TxnId
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *             properties:
 *               loginId:
 *                 type: string
 *                 description: ABHA number to be encrypted and submitted to ABDM.
 *                 example: "91-4118-5268-3332"
 *     responses:
 *       200:
 *         description: Face authentication request sent successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               txnId: "a9709833-a471-425c-ac4d-a145ce6499e0"
 *               message: "FACE authentication request successfully sent."
 *       400:
 *         description: loginId is required
 */
router.post(
  "/login/face/request",
  async (req: Request, res: Response) => {
    try {
      const { loginId } = req.body;

      if (!loginId || String(loginId).trim() === "") {
        return res.status(400).json({ message: "loginId is required" });
      }

      const result = await abhaService.requestFaceAuth(loginId);
      return res.json(result);

    } catch (error: any) {
      console.log("===== ABHA ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data || { message: error.message || "Internal Server Error" });
    }
  }
);

/**
 * @swagger
 * /api/abha/login/face/verify:
 *   post:
 *     summary: ABHA FaceAuth Verify
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - faceAuthPid
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: "a9709833-a471-425c-ac4d-a145ce6499e0"
 *               faceAuthPid:
 *                 type: string
 *                 description: Base64-encoded Face Authentication PID returned by Aadhaar Face RD.
 *                 example: "<Base64 FaceAuth PID>"
 *     responses:
 *       200:
 *         description: Face authentication verification response from ABDM
 *       400:
 *         description: txnId and faceAuthPid are required
 */
router.post(
  "/login/face/verify",
  async (req: Request, res: Response) => {
    try {
      const { txnId, faceAuthPid } = req.body;

      if (!txnId || String(txnId).trim() === "") {
        return res.status(400).json({ message: "txnId is required" });
      }

      if (!faceAuthPid || String(faceAuthPid).trim() === "") {
        return res.status(400).json({ message: "faceAuthPid is required" });
      }

      const result = await abhaService.verifyFaceAuth(txnId, faceAuthPid);
      return res.json(result);

    } catch (error: any) {
      console.log("===== ABHA ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data || { message: error.message || "Internal Server Error" });
    }
  }
);

router.post(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    const { mobile } = req.body;
    const result = await abhaService.searchAbhaByMobile(mobile);
    return res.status(200).json(result);
  }
);

/**
 * @swagger
 * /api/abha/search/mobile:
 *   post:
 *     summary: Search ABHA profile by mobile number
 *     description: Accepts a mobile number, encrypts it using the existing ABHA public RSA certificate, and queries the ABDM ABHA search API.
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: ABHA search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 txnId: "abc123-search-txn"
 *                 records:
 *                   - index: 0
 *                     ABHANumber: "91-1234-5678-9012"
 *                     name: "Test User"
 *       400:
 *         description: Invalid mobile number or request payload
 *       500:
 *         description: Server or ABDM request error
 */
router.post(
  "/search/mobile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mobile } = req.body;
      const result = await abhaService.searchAbhaByMobile(mobile);
      return res.status(200).json(result);
    } catch (error: any) {
      console.log("===== ABHA SEARCH ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data || { message: error.message || "Internal Server Error" });
    }
  }
);

router.post(
  "/mobile/search",
  async (req: Request, res: Response, next: NextFunction) => {
    const { mobile } = req.body;
    const result = await abhaService.searchAbhaByMobile(mobile);
    return res.status(200).json(result);
  }
);

/**
 * @swagger
 * /api/abha/search/otp:
 *   post:
 *     summary: Generate ABHA login OTP for selected record
 *     description: Validates the search transaction, encrypts the selected record index using the ABHA RSA public key, and requests an OTP from ABDM.
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - index
 *             properties:
 *               txnId:
 *                 type: string
 *                 example: "abc123-search-txn"
 *               index:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: OTP request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 txnId: "otp-txn-456"
 *                 message: "OTP sent successfully."
 *       400:
 *         description: Invalid transaction id or selected index
 *       500:
 *         description: Server or ABDM request error
 */
router.post(
  "/search/otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { index, txnId } = req.body;
      const result = await abhaService.generateAbhaLoginOtp(index, txnId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.log("===== ABHA SEARCH OTP ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data || { message: error.message || "Internal Server Error" });
    }
  }
);

router.post(
  "/search/generate-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index, txnId } = req.body;
    const result = await abhaService.generateAbhaLoginOtp(index, txnId);
    return res.status(200).json(result);
  }
);

router.post(
  "/generate-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index, txnId } = req.body;
    const result = await abhaService.generateAbhaLoginOtp(index, txnId);
    return res.status(200).json(result);
  }
);

/**
 * @swagger
 * /api/abha/search/verify-otp:
 *   post:
 *     summary: Verify ABHA login OTP
 *     description: Verifies the OTP against the ABDM transaction by encrypting the OTP and sending the OTP transaction identifier.
 *     tags:
 *       - ABHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otpTxnId
 *               - otp
 *             properties:
 *               otpTxnId:
 *                 type: string
 *                 example: "otp-txn-456"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 message: "OTP verified successfully"
 *                 profiles:
 *                   - abha_number: "91-1234-5678-9012"
 *       400:
 *         description: Invalid OTP or transaction payload
 *       500:
 *         description: Server or ABDM verification error
 */
router.post(
  "/search/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otpTxnId, otp } = req.body;
      const result = await abhaService.verifyAbhaLoginOtp(otpTxnId, otp);
      return res.status(200).json(result);
    } catch (error: any) {
      console.log("===== ABHA SEARCH VERIFY OTP ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data || { message: error.message || "Internal Server Error" });
    }
  }
);

router.post(
  "/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    const { otpTxnId, otp } = req.body;
    const result = await abhaService.verifyAbhaLoginOtp(otpTxnId, otp);
    return res.status(200).json(result);
  }
);

router.post(
  "/login/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { loginType, loginId } = req.body;

      const result = await abhaService.sendLoginOtp(
        loginType,
        loginId
      );

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}

  }
);

/**
 * @swagger
 * /api/abha/login/verify-otp:
 *   post:
 *     summary: Verify OTP for ABHA Login
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginType
 *               - txnId
 *               - otp
 *             properties:
 *               loginType:
 *                 type: string
 *                 enum:
 *                   - abha-number-aadhaar-otp
 *                   - aadhaar-aadhaar-otp
 *                   - mobile-mobile-otp
 *                   - abha-number-abha-otp
 *               txnId:
 *                 type: string
 *               otp:
 *                 type: string
 *           examples:
 *             Aadhaar-based Verify (abha-number/aadhaar):
 *               summary: Aadhaar OTP verify (aadhaar-verify scope)
 *               value:
 *                 loginType: aadhaar-aadhaar-otp
 *                 txnId: "2e3abc76-fd9f-45e2-9e38-d3e019603e96"
 *                 otp: "123456"
 *             Mobile-based Verify (abha-number/mobile):
 *               summary: Mobile OTP verify (mobile-verify scope)
 *               value:
 *                 loginType: mobile-mobile-otp
 *                 txnId: "2e3abc76-fd9f-45e2-9e38-d3e019603e96"
 *                 otp: "123456"
 *     responses:
 *       200:
 *         description: Login verified; includes the saved database profileId for a single profile and profileId on each profiles entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileId:
 *                   type: integer
 *                   description: Saved profile ID when exactly one profile is returned.
 *                 profiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       profileId:
 *                         type: integer
 *                       id:
 *                         type: integer
 *                       abha_number:
 *                         type: string
 */
router.post(
  "/login/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loginType, txnId, otp } = req.body;
      const result = await abhaService.verifyLoginOtp(
        loginType,
        txnId,
        otp
      );
      res.json(result);
    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);

/**
 * @swagger
 * /api/abha/login/mobile/verify-otp:
 *   post:
 *     summary: Verify Mobile OTP Login
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - otp
 *             properties:
 *               txnId:
 *                 type: string
 *               otp:
 *                 type: string
 *           example:
 *             txnId: "2e3abc76-fd9f-45e2-9e38-d3e019603e96"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: Mobile Login Verified Successfully
 */
router.post(
  "/login/mobile/verify-otp",
  async (req: Request, res: Response) => {
    try {

      const { txnId, otp } = req.body;

      const result = await abhaService.verifyMobileLoginOtp(
        txnId,
        otp
      );

      res.json(result);

    } catch (error: any) {
      console.log("===== ABHA ERROR =====");
      console.log(error);

      return res
        .status(error.status || 500)
        .json(error.data);
    }
  }
);


/**
 * @swagger
 * /api/abha/abha-address/send-otp:
 *   post:
 *     summary: Send OTP for ABHA Address Login
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginType
 *               - loginId
 *             properties:
 *               loginType:
 *                 type: string
 *                 enum:
 *                   - abha-address-mobile-otp
 *                   - abha-address-aadhaar-otp
 *               loginId:
 *                 type: string
 *           examples:
 *             MobileOTP:
 *               summary: Mobile OTP
 *               value:
 *                 loginType: abha-address-mobile-otp
 *                 loginId: lavanya@abdm
 *             AadhaarOTP:
 *               summary: Aadhaar OTP
 *               value:
 *                 loginType: abha-address-aadhaar-otp
 *                 loginId: lavanya@abdm
 *     responses:
 *       200:
 *         description: OTP Sent Successfully
 */
router.post(
  "/abha-address/send-otp",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {
        loginType,
        loginId
      } = req.body;

      const result = await abhaService.sendAbhaAddressOtp(
        loginType,
        loginId
      );

      res.json(result);

    } catch (error) {
      next(error);
    }

  }
);



/**
 * @swagger
 * /api/abha/abha-address/verify-otp:
 *   post:
 *     summary: Verify OTP for ABHA Address Login
 *     tags: [ABHA Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginType
 *               - txnId
 *               - otp
 *             properties:
 *               loginType:
 *                 type: string
 *                 enum:
 *                   - abha-address-mobile-otp
 *                   - abha-address-aadhaar-otp
 *               txnId:
 *                 type: string
 *               otp:
 *                 type: string
 *           examples:
 *             MobileOTP:
 *               summary: Mobile OTP Verify
 *               value:
 *                 loginType: abha-address-mobile-otp
 *                 txnId: 2e3abc76-fd9f-45e2-9e38-d3e019603e96
 *                 otp: "123456"
 *             AadhaarOTP:
 *               summary: Aadhaar OTP Verify
 *               value:
 *                 loginType: abha-address-aadhaar-otp
 *                 txnId: 2e3abc76-fd9f-45e2-9e38-d3e019603e96
 *                 otp: "123456"
 *     responses:
 *       200:
 *         description: ABHA Address login verified; includes the saved database profileId for a single profile and profileId on each profiles entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileId:
 *                   type: integer
 *                   description: Saved profile ID when exactly one profile is returned.
 *                 profiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       profileId:
 *                         type: integer
 *                       id:
 *                         type: integer
 *                       abha_number:
 *                         type: string
 *                       abha_address:
 *                         type: string
 *                       name:
 *                         type: string
 */
router.post(
  "/abha-address/verify-otp",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {
        loginType,
        txnId,
        otp
      } = req.body;

      const result = await abhaService.verifyAbhaAddressOtp(
        loginType,
        txnId,
        otp
      );

      res.json(result);

    } catch (error) {
      next(error);
    }

  }
);


// Milestone - 2
/**
 * @swagger
 * /api/abha/carecontext/link:
 *   post:
 *     summary: Link Care Context
 *     tags: [ABHA]
 *     parameters:
 *       - in: header
 *         name: X-HIP-ID
 *         required: true
 *         schema:
 *           type: string
 *         example: IN0910001843
 *       - in: header
 *         name: X-LINK-TOKEN
 *         required: true
 *         schema:
 *           type: string
 *         example: eyJhbGciOiJIUzI1NiJ9.....
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Care Context Linked Successfully
 */
router.post(
  "/carecontext/link",
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const hipId = req.header("X-HIP-ID") as string;
      const linkToken = req.header("X-LINK-TOKEN") as string;

      const result = await abhaService.linkCareContext(
        req.body,
        hipId,
        linkToken
      );

      res.json(result);

    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}

  }
);


/**
 * @swagger
 * /api/abha/{id}/patient-details:
 *   get:
 *     summary: Get Triage Patient Details
 *     description: Returns the patient's ABHA number, name, gender, and year of birth from the triage table.
 *     tags:
 *       - ABHA
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Triage ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Patient details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     abhaNumber:
 *                       type: string
 *                       example: "91-2345-6789-1234"
 *                     name:
 *                       type: string
 *                       example: "Ramesh Kumar"
 *                     gender:
 *                       type: integer
 *                       example: 1
 *                     yearOfBirth:
 *                       type: integer
 *                       example: 1994
 *       404:
 *         description: Triage record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Triage not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/:id/patient-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const result = await abhaService.getTriagePatientDetails(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Triage not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {

  console.log("===== ABHA ERROR =====");
  console.log(error);

  return res
    .status(error.status || 500)
    .json(error.data);
}
  }
);

export default router;