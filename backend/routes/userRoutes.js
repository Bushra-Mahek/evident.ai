import express from "express";
import { userController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    userController.getAllUsers
);

export default router;