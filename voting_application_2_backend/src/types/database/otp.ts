import { Document } from "mongoose";
export interface IOtp extends Document {
  walletAddress: string;
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}
