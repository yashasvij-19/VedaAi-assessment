import { Router } from "express";
import assignmentQueue from "../lib/queue";
import Output from "../models/Output";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const { subject, className, school, timeAllowed, questionTypes, instructions, sessionId, prompt: promptInput } = req.body;

    const prompt = `You are an expert exam paper generator for Indian schools.

CRITICAL: Return ONLY a valid JSON object. No markdown. No code blocks. No explanation. No text before or after. Just the raw JSON.

Teacher's request: ${promptInput || "Generate a comprehensive question paper"}

Additional details:
- School: ${school || "Delhi Public School"}
- Subject: ${subject}
- Class: ${className}
- Time Allowed: ${timeAllowed || "45 minutes"}
- Question Types: ${JSON.stringify(questionTypes)}
- Extra Instructions: ${instructions || "None"}

Generate the JSON in EXACTLY this format:
{
  "school": "${school || "Delhi Public School"}",
  "subject": "${subject}",
  "className": "${className}",
  "timeAllowed": "${timeAllowed || "45 minutes"}",
  "maxMarks": <sum of all marks>,
  "generalInstruction": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "title": "Section A",
      "questionType": "<question type>",
      "instruction": "Attempt all questions. Each question carries <marks> marks.",
      "questions": [
        {
          "text": "<actual question>",
          "difficulty": "<Easy|Moderate|Challenging>",
          "marks": <number>
        }
      ]
    }
  ]
}

Rules:
- difficulty must be EXACTLY one of: Easy, Moderate, Challenging
- Create one section per question type provided
- Generate EXACTLY the number of questions specified
- Calculate maxMarks correctly as sum of all questions marks
- Questions must be real subject-specific questions not placeholders
- RETURN ONLY THE JSON, NOTHING ELSE`;

    const job = await assignmentQueue.add("generate", { prompt, sessionId });
    res.status(201).json({ jobId: job.id, message: "Generation started" });
  } catch (error) {
    console.error("Toolkit generate error:", error);
    res.status(500).json({ message: String(error) });
  }
});

router.get("/output/:id", async (req, res) => {
  try {
    const output = await Output.findById(req.params.id);
    if (!output) {
      res.status(404).json({ message: "Output not found" });
      return;
    }
    res.json(output);
  } catch (error) {
    res.status(500).json({ message: String(error) });
  }
});

export default router;