import { Schema, model } from "mongoose";
import { IOtp } from "../types/database/otp";

const otpSchema = new Schema<IOtp>({
  phoneNumber: {
    type: String,
  },
  otp: {
    type: String,
  },
  walletAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const Otp = model("Otp", otpSchema);
export default Otp;
