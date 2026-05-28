import { Worker } from "bullmq";
import Groq from "groq-sdk";
import bullmqConnection from "../lib/bullMQConnection";
import Output from "../models/Output";
import { io } from "../index";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const worker = new Worker(
  "assignment-generation",
  async (job) => {
    const { prompt, sessionId } = job.data;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0]?.message?.content || "";

    // Clean the response
    let cleanResponse = rawResponse.trim();
    cleanResponse = cleanResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Extract JSON
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response");

    // Parse and validate
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(`JSON parse failed: ${e}`);
    }

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error("Invalid response: missing sections array");
    }

    // Sanitize sections and questions
    parsed.sections = parsed.sections.map((section: any) => ({
      title: section.title || "Section A",
      questionType: section.questionType || "Questions",
      instruction: section.instruction || "Attempt all questions.",
      questions: (section.questions || []).map((q: any) => ({
        text: q.text || q.question || "",
        difficulty: ["Easy", "Moderate", "Challenging"].includes(q.difficulty)
          ? q.difficulty
          : "Moderate",
        marks: Number(q.marks) || 1,
      })),
    }));

    // Calculate maxMarks if missing
    if (!parsed.maxMarks) {
      parsed.maxMarks = parsed.sections.reduce((total: number, section: any) => {
        return total + section.questions.reduce((sTotal: number, q: any) => sTotal + q.marks, 0);
      }, 0);
    }

    const output = new Output({
      promptInput: prompt,
      rawResponse,
      school: parsed.school || "School Name",
      subject: parsed.subject || "Subject",
      className: parsed.className || "Class",
      timeAllowed: parsed.timeAllowed || "45 minutes",
      maxMarks: parsed.maxMarks || 0,
      generalInstruction: parsed.generalInstruction || "All questions are compulsory unless stated otherwise.",
      sections: parsed.sections,
    });

    await output.save();
    io.emit("generation:complete", { outputId: output._id, sessionId });
    return { outputId: output._id };
  },
  { connection: bullmqConnection }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed!`));
worker.on("failed", (job, error) => console.error(`Job ${job?.id} failed:`, error));

export default worker;