import otpservice from "../services/otpservice";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response/apiResponse";
import { HttpStatusCode } from "../utils/response/statusCodes";
class OtpController {
  public async sendOtp(req: Request, res: Response) {
    const { phoneNumber, walletAddress } = req.body;
    if (!(phoneNumber && walletAddress)) {
      ApiResponse.error(
        res,
        "Please provide phonenumber and walletaddress",
        HttpStatusCode.BAD_REQUEST
      );
    }
    const response = await otpservice.sendOtp(phoneNumber, walletAddress);
    if (!response) {
      ApiResponse.error(res, "Failed to send otp", HttpStatusCode.BAD_REQUEST);
    }
    ApiResponse.success(res, true, "Otp has been sent");
  }
  public async verifyOtp(req: Request, res: Response) {
    const { phoneNumber, walletAddress, otp } = req.body;
    if (!(phoneNumber && walletAddress && otp)) {
      ApiResponse.error(
        res,
        "Please provide phonenumber , walletaddress and otp",
        HttpStatusCode.BAD_REQUEST
      );
    }
    const response = await otpservice.verifyOtp(
      phoneNumber,
      walletAddress,
      otp
    );
    if (!response) {
      ApiResponse.error(
        res,
        "Failed to verify otp",
        HttpStatusCode.BAD_REQUEST
      );
    }
    ApiResponse.success(res, true, "Otp has been verified");
  }
}
export default new OtpController();
