import { Router } from "express";
import Assignment from "../models/Assignment";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
})


router.post("/", async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }

})

export default router;

