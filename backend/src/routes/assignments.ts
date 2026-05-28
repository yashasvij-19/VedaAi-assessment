import { Router } from "express";
import multer from "multer";
import path from "path";
import Assignment from "../models/Assignment";
import {io} from "../index";

const router = Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage});

router.get("/", async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({createdAt:-1});
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
})


router.post("/", upload.single("file"), async (req, res) => {
    try {
        const assignment = new Assignment({
            ...req.body,
        questionTypes: typeof req.body.questionTypes === "string" 
  ? JSON.parse(req.body.questionTypes) 
  : req.body.questionTypes,
        fileUrl: req.file ? req.file.path : null,
        fileName: req.file ? req.file.originalname : null,
        });
        await assignment.save();
        io.emit("assignment created",assignment);
        res.status(201).json(assignment);
    } catch (error) {
    console.error("Assignment creation error:", error);
    res.status(500).json({ message: String(error) });
    }
})

router.get("/:id", async(req,res) => {
try{
    const assignment = await Assignment.findById(req.params.id);
    if(!assignment){
        res.status(404).json({message:"Assignment not found"});
        return;
    }
    res.json(assignment);    
}catch(error){
    res.status(500).json({message:"something went wrong"})
}
});

export default router;

