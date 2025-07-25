import { Request, Response } from "express";
import { IContestant } from "../types/database/contestants";
import contestantsService from "../services/contenstants";
import { uploadToCloudinary } from "../utils/cloudinary/cloudinary";

class ContestantsController {
  public async create(req: Request, res: Response) {
    try {
      const { name, party, age, qualification, walletAddress } = req.body;

      if (
        !req.files ||
        !("partyImage" in req.files) ||
        !("candidateImage" in req.files)
      ) {
        res.status(400).json({ message: "Both images are required" });
      }

      const partyImageFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["partyImage"][0];
      const candidateImageFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["candidateImage"][0];

      const partyImage = await uploadToCloudinary(
        partyImageFile.buffer,
        partyImageFile.originalname,
        "image"
      );
      const candidateImage = await uploadToCloudinary(
        candidateImageFile.buffer,
        candidateImageFile.originalname,
        "image"
      );
      const contestantData = {
        name,
        party,
        age,
        qualification,
        walletAddress,
        partyImage,
        candidateImage,
      };

      console.log("Saved contestant data:", contestantData);
      const newContestant = await contestantsService.create(contestantData);

      res.status(201).json({
        success: true,
        message: "Contestant registered successfully",
        contestant: newContestant,
      });
    } catch (error) {
      console.error("Error in registerContestant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteContestant(req: Request, res: Response) {
    try {
      const isDeleted = await contestantsService.deleteContestant();
      if (!isDeleted) {
        res.status(404).json({
          success: false,
          message: "Failed to delete Contestant",
        });
      }
      res.status(200).json({
        success: true,
        message: "contestants has been deleted.",
      });
    } catch (error) {
      console.error("Error in deleteContestant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getContestantByWalletAddress(req: Request, res: Response) {
    try {
      const { walletAddress } = req.query;
      console.log(walletAddress);
      const contestant = await contestantsService.getContestantByWalletAddress(
        walletAddress as string
      );
      res.status(200).json({
        success: true,
        message: "Contestant has been found",
        data: contestant,
      });
    } catch (error) {
      console.error("Error in getting contestant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getContestant(req: Request, res: Response) {
    try {
    } catch (error) {
      console.error("Error in getting contestant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new ContestantsController();
