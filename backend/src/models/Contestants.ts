import { Schema, model } from "mongoose";
import { IContestant } from "../types/database/contestants";

const contestantSchema = new Schema<IContestant>({
  name: {
    type: String,
  },
  party: {
    type: String,
  },
  age: {
    type: String,
  },
  qualification: {
    type: String,
  },
  partyImage: {
    type: String,
  },
  candidateImage: {
    type: String,
  },
  walletAddress: {
    type: String,
  },
});

const Contestant = model("Contestant", contestantSchema);
export default Contestant;
