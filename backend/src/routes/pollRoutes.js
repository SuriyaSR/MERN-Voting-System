import express from "express";
import { getPoll, getPolls, createPoll, voteForPoll, getMyPolls, deletePoll, getPollResults } from "../controllers/pollController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/myPolls", auth, getMyPolls);
router.get("/:id/results", getPollResults);

router.get("/", getPolls);
router.get("/:id", getPoll);

router.post("/", auth, createPoll);
router.post("/:id/vote", auth, voteForPoll);

router.delete("/:id", auth, deletePoll)

export default router;