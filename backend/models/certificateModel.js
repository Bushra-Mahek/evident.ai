import { db } from "../config/db.js";

export const certificateModel = {

    async createCertificate(
        disclosureId,
        certificateNumber,
        certificateUrl,
        certificateHash,
        client = db
    ) {
        const result = await client.query(
            `
            INSERT INTO certificates (
                disclosure_id,
                certificate_number,
                certificate_url,
                certificate_hash,
                generated_at
            )
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
            `,
            [
                disclosureId,
                certificateNumber,
                certificateUrl,
                certificateHash
            ]
        );

        return result.rows[0];
    },


    async getById(id) {
        const result = await db.query(
            `
            SELECT *
            FROM certificates
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] || null;
    },


    async getByDisclosureId(disclosureId) {
        const result = await db.query(
            `
            SELECT *
            FROM certificates
            WHERE disclosure_id = $1
            `,
            [disclosureId]
        );

        return result.rows[0] || null;
    },


    async getByCertificateNumber(certificateNumber) {
        const result = await db.query(
            `
            SELECT *
            FROM certificates
            WHERE certificate_number = $1
            `,
            [certificateNumber]
        );

        return result.rows[0] || null;
    },


    async getCertificatesByCompany(companyId) {
    const result = await db.query(
        `
        SELECT
            c.*,
            d.reporting_year
        FROM certificates c
        JOIN disclosures d
            ON c.disclosure_id = d.id
        WHERE d.company_id = $1
        ORDER BY c.generated_at DESC
        `,
        [companyId]
    );

    return result.rows;
},

 async getAllCertificates() {
        const result = await db.query(
            `
            SELECT
                c.*,
                d.reporting_year,
                d.company_id,
                co.company_name
            FROM certificates c
            JOIN disclosures d
                ON c.disclosure_id = d.id
            JOIN companies co
                ON d.company_id = co.id
            ORDER BY c.generated_at DESC
            `
        );

        return result.rows;
    },
};