import serverconfig from "../config/serverconfig";
import Otp from "../models/Otp";
import { generateOtp } from "../utils/extra/generateOtp";
import { client } from "../utils/extra/twilo";
import { AppError } from "../utils/response/appError";
import { HttpStatusCode } from "../utils/response/statusCodes";
class OtpSerivces {
  public async sendOtp(PhoneNumber: string, walletAddress: string) {
    const otp = generateOtp();

    //saving otp to the document.

    const savedOtp = new Otp({ phoneNumber: PhoneNumber, otp, walletAddress });
    await savedOtp.save();

    //sending message
    await client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: serverconfig.TWILO_PHONE_NUMBER as string, // Ensure this is a verified Twilio number
        to: `+91${PhoneNumber}`,
      })
      .then(() => console.log("Sent message to " + PhoneNumber))
      .catch((error) => {
        console.error("Error sending OTP:", error);
        throw new AppError(
          "Failed to send OTP",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      });
    return true;
  }
  public async verifyOtp(
    PhoneNumber: string,
    walletAddress: string,
    otp: string
  ) {
    const verificationDoc = await Otp.findOne({
      walletAddress,
      phoneNumber: PhoneNumber,
      otp,
    });
    if (!verificationDoc) {
      throw new AppError("Otp is not correct", HttpStatusCode.BAD_REQUEST);
    }
    await Otp.deleteOne({ _id: verificationDoc._id });

    return true;
  }
}
export default new OtpSerivces();
