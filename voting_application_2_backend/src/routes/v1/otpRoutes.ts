import { Router } from "express";
import otpcontroller from "../../controllers/otpcontroller";

const app = Router();

app.post("/send-otp", otpcontroller.sendOtp);
app.patch("/verify-otp", otpcontroller.verifyOtp);

export default app;
