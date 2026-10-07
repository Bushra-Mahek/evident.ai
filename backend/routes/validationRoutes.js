import express from "express";

import {
    validateDisclosure,
    getValidationResults
} from "../controllers/validationController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/:disclosureId/validate",
    authenticate,
    validateDisclosure
);

router.get(
    "/:disclosureId",
    authenticate,
    getValidationResults
);

export default router;