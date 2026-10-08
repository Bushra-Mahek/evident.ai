import { AppError } from "../middlewares/errorMiddleware.js";
import { userModel } from "../models/userModel.js";

export const userService = {

    async getAllUsers(user) {

        if (user.role !== "ADMIN") {
            throw new AppError(
                "Access denied",
                403
            );
        }

        return await userModel.getAllUsers();
    }

};