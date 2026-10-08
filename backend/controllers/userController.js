import { userService } from "../services/userService.js";

export const userController = {

    async getAllUsers(req, res, next) {

        try {

            const users =
                await userService.getAllUsers(
                    req.user
                );

            return res.status(200).json({
                success: true,
                users
            });

        } catch (error) {
            next(error);
        }

    }

};