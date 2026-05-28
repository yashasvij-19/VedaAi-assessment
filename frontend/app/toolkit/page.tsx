"use client";

import {
  useState,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["polling", "websocket"],
});

export default function Toolkit() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [sessionId] = useState(() =>
    Math.random()
      .toString(36)
      .slice(2)
  );

  const [form, setForm] =
    useState({
      subject: "",
      className: "",
      school:
        "Delhi Public School",
      timeAllowed:
        "45 minutes",
      instructions: "",
      prompt: "",
      questionTypes: [
        {
          type: "Short Questions",
          count: 5,
          marks: 2,
        },
      ],
    });

  useEffect(() => {
    const handleComplete = (
      data: any
    ) => {
      if (
        data.sessionId ===
        sessionId
      ) {
        setLoading(false);

        router.push(
          `/output/${data.outputId}`
        );
      }
    };

    socket.on(
      "generation:complete",
      handleComplete
    );

    return () => {
      socket.off(
        "generation:complete",
        handleComplete
      );
    };
  }, [sessionId, router]);

  const handleGenerate =
    async () => {
      if (
        !form.subject ||
        !form.className
      ) {
        alert(
          "Please fill subject and class!"
        );

        return;
      }

      try {
        setLoading(true);

        await axios.post(
  "http://127.0.0.1:5000/api/toolkit/generate",
          {
            ...form,
            sessionId,
          }
        );
      } catch (error) {
        console.error(error);

        setLoading(false);

        alert(
          "Failed to generate question paper."
        );
      }
    };

  const questionTypeOptions =
    [
      "Multiple Choice Questions",
      "Short Questions",
      "Long Answer Questions",
      "Diagram/Graph-Based Questions",
      "Numerical Problems",
    ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <Topbar
        title="AI Toolkit"
        showBack={false}
      />

      <div className="flex-1 md:ml-64 pt-16 md:pt-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Hero */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-4">
                ✨ AI Powered Assessment
                Engine
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                AI Teacher’s Toolkit
              </h1>

              <p className="text-slate-300 max-w-2xl leading-relaxed">
                Generate intelligent,
                structured and curriculum
                aligned question papers
                instantly using AI.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  "AI Generated",
                  "Curriculum Aware",
                  "Difficulty Balanced",
                  "Export Ready",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* School Details */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Assessment Details
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Configure your
                    AI-generated question
                    paper.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      label:
                        "School Name",
                      value:
                        form.school,
                      key: "school",
                    },
                    {
                      label:
                        "Subject",
                      value:
                        form.subject,
                      key: "subject",
                    },
                    {
                      label: "Class",
                      value:
                        form.className,
                      key: "className",
                    },
                    {
                      label:
                        "Time Allowed",
                      value:
                        form.timeAllowed,
                      key: "timeAllowed",
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                    >
                      <label className="text-sm font-medium text-slate-700 block mb-2">
                        {field.label}
                      </label>

                      <input
                        type="text"
                        value={
                          field.value
                        }
                        placeholder={
                          field.label
                        }
                        onChange={(
                          e
                        ) =>
                          setForm({
                            ...form,
                            [field.key]:
                              e
                                .target
                                .value,
                          })
                        }
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Question Structure
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Customize question
                      distribution and
                      marks.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        questionTypes:
                          [
                            ...form.questionTypes,
                            {
                              type:
                                "Short Questions",
                              count: 3,
                              marks: 2,
                            },
                          ],
                      })
                    }
                    className="h-11 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-all"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-4">
                  {form.questionTypes.map(
                    (
                      qt,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-2xl p-4"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <select
                            value={
                              qt.type
                            }
                            onChange={(
                              e
                            ) => {
                              const updated =
                                [
                                  ...form.questionTypes,
                                ];

                              updated[
                                index
                              ].type =
                                e
                                  .target
                                  .value;

                              setForm({
                                ...form,
                                questionTypes:
                                  updated,
                              });
                            }}
                            className="flex-1 h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none"
                          >
                            {questionTypeOptions.map(
                              (
                                opt
                              ) => (
                                <option
                                  key={
                                    opt
                                  }
                                >
                                  {opt}
                                </option>
                              )
                            )}
                          </select>

                          <div className="flex items-center gap-3">
                            {/* Count */}
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 h-12">
                              <button
                                onClick={() => {
                                  const updated =
                                    [
                                      ...form.questionTypes,
                                    ];

                                  updated[
                                    index
                                  ].count =
                                    Math.max(
                                      1,
                                      qt.count -
                                        1
                                    );

                                  setForm({
                                    ...form,
                                    questionTypes:
                                      updated,
                                  });
                                }}
                              >
                                −
                              </button>

                              <span className="text-sm font-medium w-6 text-center">
                                {
                                  qt.count
                                }
                              </span>

                              <button
                                onClick={() => {
                                  const updated =
                                    [
                                      ...form.questionTypes,
                                    ];

                                  updated[
                                    index
                                  ].count += 1;

                                  setForm({
                                    ...form,
                                    questionTypes:
                                      updated,
                                  });
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Marks */}
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-3 h-12">
                              <button
                                onClick={() => {
                                  const updated =
                                    [
                                      ...form.questionTypes,
                                    ];

                                  updated[
                                    index
                                  ].marks =
                                    Math.max(
                                      1,
                                      qt.marks -
                                        1
                                    );

                                  setForm({
                                    ...form,
                                    questionTypes:
                                      updated,
                                  });
                                }}
                              >
                                −
                              </button>

                              <span className="text-sm font-medium w-6 text-center text-orange-600">
                                {
                                  qt.marks
                                }
                              </span>

                              <button
                                onClick={() => {
                                  const updated =
                                    [
                                      ...form.questionTypes,
                                    ];

                                  updated[
                                    index
                                  ].marks += 1;

                                  setForm({
                                    ...form,
                                    questionTypes:
                                      updated,
                                  });
                                }}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                const updated =
                                  form.questionTypes.filter(
                                    (
                                      _,
                                      i
                                    ) =>
                                      i !==
                                      index
                                  );

                                setForm({
                                  ...form,
                                  questionTypes:
                                    updated,
                                });
                              }}
                              className="w-12 h-12 rounded-2xl border border-red-100 bg-red-50 text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Additional Instructions (optional)
                </h2>

                <textarea
                  value={
                    form.instructions
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      instructions:
                        e.target.value,
                    })
                  }
                  placeholder="Focus on NCERT chapters 1-5, include application-based questions, maintain balanced difficulty..."
                  className="w-full h-36 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-8">
                <div className="mb-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-medium mb-4">
                    Prompt Engineering
                  </div>

                  <h2 className="text-xl font-semibold text-slate-900">
                    AI Prompt
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Guide the AI to
                    generate optimized
                    assessments.
                  </p>
                </div>

                <textarea
                  value={form.prompt}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      prompt:
                        e.target.value,
                    })
                  }
                  placeholder="Generate a structured question paper for Class 5 Science with balanced difficulty distribution..."
                  className="w-full h-56 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-5"
                />

                <button
                  onClick={
                    handleGenerate
                  }
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 shadow-lg"
                >
                  {loading
                    ? "Generating..."
                    : "✨ Generate Question Paper"}
                </button>

                {loading && (
                  <div className="mt-5">
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full animate-pulse"></div>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 text-center">
                      Generating your
                      assessment...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}