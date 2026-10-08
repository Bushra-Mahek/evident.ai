import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { getAuditLogs } from "../controllers/auditLogController.js";


const router = express.Router();
router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getAuditLogs
);

export default router;