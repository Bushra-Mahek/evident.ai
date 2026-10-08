import { auditLogService } from "../services/auditLogService.js";

export const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await auditLogService.getLogs();

        return res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        next(error);
    }
};