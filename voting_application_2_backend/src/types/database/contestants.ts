import { Document } from "mongoose";
export interface IContestant extends Document {
  name: string;
  party: string;
  age: string;
  qualification: string;
  partyImage: string;
  candidateImage: string;
  walletAddress: string;
}
