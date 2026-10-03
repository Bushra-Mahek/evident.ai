import bcrypt from  "bcrypt"
import { userModel } from "../models/userModel.js"
import { generateToken } from "../utils/jwt.js"

export const authService = {
    async registerUser(fullName, email, password, role, companyId){
        const allowedRoles = [
        "COMPANY_USER",
        "AUDITOR",
        "REGULATOR"
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid registration role");
    }

    // companyId rules
    if (
        (role === "COMPANY_USER" || role === "AUDITOR") &&
        !companyId
    ) {
        throw new Error("Company ID is required for this role");
    }

    if (companyId) {
    const company = await companyModel.getById(companyId);

    if (!company) {
        throw new Error("Company not found");
    }
}

    if (role === "REGULATOR") {
        companyId = null;
    }

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
        throw new Error("user already existing");
    }

        const passwordHash= await bcrypt.hash(password,10);
        const response = await userModel.createUser(fullName,email,passwordHash,role,companyId || null);
        return response;
    },
    
    async loginUser(email, password) {
        const result = await userModel.findUserByEmail(email);

        if (!result) {
            throw new Error("User not found");
        }

        const valid = await bcrypt.compare(password, result.password_hash);

        if (!valid) {
            throw new Error("Invalid password");
        }

        const token = generateToken(result);

        return {
            user: result,
            token
        };
    }
    
}