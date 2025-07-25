import { Router } from "express";
import userRoutes from "./userRoutes";
import contenstantRoutes from "./contenstantRoutes";
import otpRoutes from "./otpRoutes";
const app = Router();
app.use("/user", userRoutes);
app.use("/contestant", contenstantRoutes);
app.use("/otp", otpRoutes);
export default app;
