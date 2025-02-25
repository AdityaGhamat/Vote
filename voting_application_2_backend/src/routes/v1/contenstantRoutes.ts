import { Router } from "express";
import contenstants from "../../controllers/contenstants";
import upload from "../../middlewares/multer";
const app = Router();

app.post(
  "/",
  upload.fields([
    { name: "partyImage", maxCount: 1 },
    { name: "candidateImage", maxCount: 1 },
  ]),
  contenstants.create
);
app.delete("/", contenstants.deleteContestant);
app.get("/detail", contenstants.getContestantByWalletAddress);
export default app;
