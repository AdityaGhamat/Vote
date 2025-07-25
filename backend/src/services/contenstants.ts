import Contestant from "../models/Contestants";
import { IContestant } from "../types/database/contestants";
import { AppError } from "../utils/response/appError";
import { HttpStatusCode } from "../utils/response/statusCodes";
class ContestantsService {
  public async create(data: Partial<IContestant>) {
    try {
      const newContestant = new Contestant(data);
      await newContestant.save();
      return newContestant;
    } catch (error) {
      console.error("Error uploading contestant images:", error);
      throw new Error("Failed to create contestant.");
    }
  }
  public async deleteContestant() {
    try {
      const response = await Contestant.deleteMany();
      return true;
    } catch (error) {
      console.error("Error deleting contestant:", error);
      throw new Error("Failed to delete contestant.");
    }
  }
  public async getContestantByWalletAddress(walletAddress: string) {
    try {
      const contestant = await Contestant.findOne({ walletAddress });
      if (!contestant) {
        throw new AppError("Contestant not found", HttpStatusCode.BAD_REQUEST);
      }
      return contestant;
    } catch (error) {
      console.error("Error getting contestant:", error);
      throw new Error("Failed to getting contestant.");
    }
  }
}

export default new ContestantsService();
