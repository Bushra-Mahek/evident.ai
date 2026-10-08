import { db } from "../config/db.js"

export const userModel = {
    async createUser(fullName,email,passwordHash,role,companyId){
        const result = await db.query(`insert into users(full_name,email,password_hash,role,company_id) values($1,$2,$3,$4,$5) returning *`,[fullName,email,passwordHash,role,companyId]);
        return result.rows[0];
    },

    async findUserByEmail(email) {
        const result = await db.query(
            `
            SELECT *
            FROM users
            WHERE email = $1;
            `,
            [email]
        );

        return result.rows[0];
    },

    async findUserById(id) {
        const result = await db.query(
            `
            SELECT *
            FROM users
            WHERE id = $1;
            `,
            [id]
        );

        return result.rows[0];
    },
    async getAllUsers() {
    const result = await db.query(
        `
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role,
            u.company_id,
            c.company_name
        FROM users u
        LEFT JOIN companies c
            ON u.company_id = c.id
        ORDER BY u.full_name ASC
        `
    );

    return result.rows;
}

}



