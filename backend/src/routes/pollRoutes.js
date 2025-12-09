import express from "express";
import { getPoll, getPolls, createPoll, voteForPoll } from "../controllers/pollController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPolls);
router.get("/:id", getPoll);
router.post("/", auth, createPoll);
router.post("/:id/vote", voteForPoll);

export default router;