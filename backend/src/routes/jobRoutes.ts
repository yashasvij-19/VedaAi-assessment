import { Router } from "express";
import assignmentQueue from "../lib/queue";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const job =
      await assignmentQueue.getJob(
        req.params.id
      );

    if (!job) {
      return res
        .status(404)
        .json({
          message:
            "Job not found",
        });
    }

    const state =
      await job.getState();

    const result =
      job.returnvalue;

    res.json({
      status: state,
      outputId:
        result?.outputId ||
        null,
    });
  } catch (error) {
    res.status(500).json({
      message: String(error),
    });
  }
});

export default router;