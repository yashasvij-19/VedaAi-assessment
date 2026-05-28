"use client";

import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks";
import {
  createAssignment,
  addQuestionType,
  removeQuestionType,
  updateQuestionType,
  setTitle,
  setDueDate,
  setInstructions,
  setFileName,
} from "../../store/assignmentSlice";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAssignment() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { formData, status } = useAppSelector(
    (state) => state.assignments
  );

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

    if (!formData.dueDate)
      newErrors.dueDate = "Due date is required";

    if (formData.questionTypes.length === 0)
      newErrors.questionTypes =
        "Add at least one question type";

    formData.questionTypes.forEach((qt, i) => {
      if (qt.count <= 0)
        newErrors[`count_${i}`] =
          "Count must be positive";

      if (qt.marks <= 0)
        newErrors[`marks_${i}`] =
          "Marks must be positive";
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const data = new FormData();

    if (file)
      data.append("file", file);

    data.append(
      "title",
      formData.title
    );

    data.append(
      "dueDate",
      formData.dueDate
    );

    data.append(
      "questionTypes",
      JSON.stringify(
        formData.questionTypes
      )
    );

    data.append(
      "instructions",
      formData.instructions
    );

    const result =
      await dispatch(
        createAssignment(data)
      );

    if (
      createAssignment.fulfilled.match(
        result
      )
    ) {
      router.push("/dashboard");
    } else {
      alert(
        "Failed to create assignment"
      );
    }
  } catch (error) {
    console.error(error);

    alert(
      "Something went wrong"
    );
  }
};

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <Topbar
        title="Create Assignment"
        showBack={true}
      />

      <div className="flex-1 md:ml-56 pt-16 md:pt-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create Assignment
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Generate structured AI-powered
              assessments for your students
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 md:p-8 transition-all duration-200 hover:shadow-md">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Assignment Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Configure assignment settings,
                question distribution and AI
                generation preferences
              </p>
            </div>

            {/* Upload */}
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all duration-200 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
                <span className="text-3xl">
                  ☁️
                </span>
              </div>

              <p className="text-sm md:text-base font-medium text-slate-700 text-center">
                Drag & drop syllabus or upload
                files
              </p>

              <p className="text-xs text-slate-400 mt-2 text-center">
                PDF, DOCX, PNG or JPG • Max
                file size 10MB
              </p>

              <label className="mt-5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 active:scale-[0.98]">
                Browse Files

                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.jpg,.png"
                  onChange={(e) => {
                    const f =
                      e.target.files?.[0] || null;

                    setFile(f);

                    if (f)
                      dispatch(
                        setFileName(f.name)
                      );
                  }}
                />
              </label>

              {formData.fileName && (
                <div className="mt-4 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  ✓ {formData.fileName}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Assignment Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Mid Term Quiz on Electricity"
                  onChange={(e) =>
                    dispatch(
                      setTitle(e.target.value)
                    )
                  }
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    dispatch(
                      setDueDate(e.target.value)
                    )
                  }
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                />

                {errors.dueDate && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Question Types */}
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-700">
                    Question Distribution
                  </span>

                  <div className="hidden md:flex gap-10 text-sm font-medium text-slate-500">
                    <span>Questions</span>
                    <span>Marks</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.questionTypes.map(
                    (qt, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-3 md:p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <select
                            value={qt.type}
                            onChange={(e) =>
                              dispatch(
                                updateQuestionType({
                                  index,
                                  field: "type",
                                  value:
                                    e.target
                                      .value,
                                })
                              )
                            }
                            className="flex-1 h-12 rounded-xl border border-slate-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                          >
                            {questionTypeOptions.map(
                              (opt) => (
                                <option
                                  key={opt}
                                >
                                  {opt}
                                </option>
                              )
                            )}
                          </select>

                          <div className="flex items-center justify-between md:justify-end gap-6">
                            {/* Questions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuestionType(
                                      {
                                        index,
                                        field:
                                          "count",
                                        value:
                                          Math.max(
                                            1,
                                            qt.count -
                                              1
                                          ),
                                      }
                                    )
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                              >
                                −
                              </button>

                              <span className="w-6 text-center text-sm font-medium">
                                {qt.count}
                              </span>

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuestionType(
                                      {
                                        index,
                                        field:
                                          "count",
                                        value:
                                          qt.count +
                                          1,
                                      }
                                    )
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                              >
                                +
                              </button>
                            </div>

                            {/* Marks */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuestionType(
                                      {
                                        index,
                                        field:
                                          "marks",
                                        value:
                                          Math.max(
                                            1,
                                            qt.marks -
                                              1
                                          ),
                                      }
                                    )
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                              >
                                −
                              </button>

                              <span className="w-6 text-center text-sm font-medium">
                                {qt.marks}
                              </span>

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuestionType(
                                      {
                                        index,
                                        field:
                                          "marks",
                                        value:
                                          qt.marks +
                                          1,
                                      }
                                    )
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                dispatch(
                                  removeQuestionType(
                                    index
                                  )
                                )
                              }
                              className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    dispatch(addQuestionType())
                  }
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition"
                >
                  <span className="text-lg">
                    +
                  </span>
                  Add Question Type
                </button>

                {errors.questionTypes && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.questionTypes}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Additional AI Instructions
                </label>

                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    dispatch(
                      setInstructions(
                        e.target.value
                      )
                    )
                  }
                  placeholder="e.g. Generate application-focused questions with moderate difficulty and real-world examples..."
                  className="w-full border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 h-32 resize-none transition-all"
                />

                <p className="text-xs text-slate-400 mt-2">
                  AI will use these instructions
                  to optimize question quality
                  and cognitive coverage.
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              {
                title: "Difficulty",
                value: "Moderate",
              },
              {
                title: "Question Mix",
                value: "Balanced",
              },
              {
                title: "AI Quality",
                value: "Optimized",
              },
              {
                title: "Est. Duration",
                value: "45 mins",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
              >
                <p className="text-xs text-slate-500">
                  {item.title}
                </p>

                <p className="text-sm md:text-base font-semibold text-slate-900 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-3 mt-8">
            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-full md:w-auto px-6 h-12 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              ← Previous
            </button>

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full md:w-auto px-6 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {status === "loading"
                ? "Generating Assignment..."
                : "Generate Assignment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
