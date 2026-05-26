import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
title:{type:String, required:true},
subject:{type:String, required:true},
className:{type:String, required:true},
dueDate:{type:Date, required:true},
questionTypes: [
  {
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true }
  }
],
status:{type:String, required:true, default:"idle"},
instructions:{type:String, required:false},
fileUrl: { type: String, required: false },
fileName: { type: String, required: false },
},{ timestamps: true });

export default mongoose.model("Assignment", AssignmentSchema);