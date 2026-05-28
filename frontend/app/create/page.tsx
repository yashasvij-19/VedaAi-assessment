"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createAssignment, addQuestionType, removeQuestionType, updateQuestionType, setTitle,setDueDate, setInstructions, setFileName } from "../../store/assignmentSlice";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";

export default function CreateAssignment() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { formData, status } = useAppSelector((state) => state.assignments);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  const questionTypeOptions = [
    "Multiple Choice Questions",
    "Short Questions",
    "Diagram/Graph-Based Questions",
    "Numerical Problems",
    "Long Answer Questions",
  ];

  const validate = () => {
    const newErrors: any = {};
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (formData.questionTypes.length === 0) newErrors.questionTypes = "Add at least one question type";
    formData.questionTypes.forEach((qt, i) => {
      if (qt.count <= 0) newErrors[`count_${i}`] = "Count must be positive";
      if (qt.marks <= 0) newErrors[`marks_${i}`] = "Marks must be positive";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const data = new FormData();
    if (file) data.append("file", file);
    data.append("title", formData.title);
    data.append("dueDate", formData.dueDate);
    data.append("questionTypes", JSON.stringify(formData.questionTypes));
    data.append("instructions", formData.instructions);
    const result = await dispatch(createAssignment(data));
    if (createAssignment.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 p-8 max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Create Assignment</h1>
        <p className="text-sm text-gray-500 mb-6">Set up a new assignment for your students</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <h2 className="font-medium text-gray-800 mb-1">Assignment Details</h2>
          <p className="text-xs text-gray-500 mb-4">Basic information about your assignment</p>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center mb-4">
            <span className="text-3xl mb-2">☁️</span>
            <p className="text-sm text-gray-600 mb-1">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-400 mb-3">JPEG, PNG, upto 10MB</p>
            <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt,.jpg,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  if (f) dispatch(setFileName(f.name));
                }}
              />
            </label>
            {formData.fileName && <p className="text-xs text-green-600 mt-2">✓ {formData.fileName}</p>}
          </div>
{/* Title */}
<div className="mb-4">
  <label className="text-sm font-medium text-gray-700 block mb-1">Assignment Title</label>
  <input
    type="text"
    placeholder="e.g. Quiz on Electricity"
    onChange={(e) => dispatch(setTitle(e.target.value))}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
  />
</div>
          {/* Due Date */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => dispatch(setDueDate(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Question Types */}
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Question Type</span>
              <div className="flex gap-8">
                <span>No. of Questions</span>
                <span>Marks</span>
              </div>
            </div>

            {formData.questionTypes.map((qt, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <select
                  value={qt.type}
                  onChange={(e) => dispatch(updateQuestionType({ index, field: "type", value: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {questionTypeOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>

                <button onClick={() => dispatch(removeQuestionType(index))} className="text-gray-400 hover:text-red-500 text-lg">×</button>

                <div className="flex items-center gap-1">
                  <button onClick={() => dispatch(updateQuestionType({ index, field: "count", value: Math.max(1, qt.count - 1) }))} className="w-6 h-6 border rounded text-sm">−</button>
                  <span className="w-8 text-center text-sm">{qt.count}</span>
                  <button onClick={() => dispatch(updateQuestionType({ index, field: "count", value: qt.count + 1 }))} className="w-6 h-6 border rounded text-sm">+</button>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => dispatch(updateQuestionType({ index, field: "marks", value: Math.max(1, qt.marks - 1) }))} className="w-6 h-6 border rounded text-sm">−</button>
                  <span className="w-8 text-center text-sm">{qt.marks}</span>
                  <button onClick={() => dispatch(updateQuestionType({ index, field: "marks", value: qt.marks + 1 }))} className="w-6 h-6 border rounded text-sm">+</button>
                </div>

                {errors[`count_${index}`] && <p className="text-xs text-red-500">{errors[`count_${index}`]}</p>}
              </div>
            ))}

            <button onClick={() => dispatch(addQuestionType())} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mt-2">
              <span className="text-lg">+</span> Add Question Type
            </button>
            {errors.questionTypes && <p className="text-xs text-red-500 mt-1">{errors.questionTypes}</p>}
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Additional Information (For better output)</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => dispatch(setInstructions(e.target.value))}
              placeholder="e.g. Generate a question paper for 3 hours exam..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-24 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button onClick={() => router.push("/dashboard")} className="px-6 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {status === "loading" ? "Creating..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}