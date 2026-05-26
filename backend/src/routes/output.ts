import { Router } from "express";
import Output from "../models/Output";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;        
    const output = await Output.findById(id);
    
    if (!output) {                     
      res.status(404).json({ message: "Output not found" });
      return;                          
    }
    
    res.json(output);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

export default router;