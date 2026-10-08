import express from "express";
import { certificateController } from "../controllers/certificateController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();


// Generate certificate
router.post(
    "/:disclosureId",
    authenticate,
    authorize("AUDITOR"),
    certificateController.createCertificate
);


// Get company certificates
router.get(
    "/",
    authenticate,
    authorize("COMPANY_USER","AUDITOR","ADMIN"),
    certificateController.getCompanyCertificates
);


// Get individual certificate + signed URL
router.get(
    "/:id",
    authenticate,
    authorize("COMPANY_USER", "AUDITOR","ADMIN"),
    certificateController.getCertificate
);


export default router;