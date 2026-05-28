import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty: { type: String, required: true },
  marks: { type: Number, required: true },
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questionType: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const OutputSchema = new mongoose.Schema({
  promptInput: { type: String, required: true },
  rawResponse: { type: String, required: false },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: false },
  school: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  sections: [SectionSchema],
  timeAllowed: { type: String },
  generalInstruction: { type: String },
}, { timestamps: true });

export default mongoose.model("Output", OutputSchema);