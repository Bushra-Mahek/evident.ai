import { db } from "../config/db.js";

export const auditLogModel = {

    async createLog(
        userId,
        action,
        entityType,
        entityId,
        ipAddress = null,
        client = db
    ) {

        const result = await client.query(
            `INSERT INTO audit_logs
                (
                    user_id,
                    action,
                    entity_type,
                    entity_id,
                    ip_address
                )
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                userId,
                action,
                entityType,
                entityId,
                ipAddress
            ]
        );

        return result.rows[0];
    },

    async getLogs() {
    const result = await db.query(
        `
        SELECT
            al.id,
            al.action,
            al.entity_type,
            al.entity_id,
            al.ip_address,
            al.created_at,
            u.full_name AS user_name,
            u.email AS user_email,
            u.role AS user_role
        FROM audit_logs al
        LEFT JOIN users u
            ON al.user_id = u.id
        ORDER BY al.created_at DESC
        `
    );

    return result.rows;
}
};

