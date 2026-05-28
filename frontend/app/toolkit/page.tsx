"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Toolkit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const [form, setForm] = useState({
    subject: "",
    className: "",
    school: "Delhi Public School",
    timeAllowed: "45 minutes",
    instructions: "",
    prompt: "",
    questionTypes: [{ type: "Short Questions", count: 5, marks: 2 }],
  });

  useEffect(() => {
    socket.on("generation:complete", (data) => {
      if (data.sessionId === sessionId) {
        setLoading(false);
        router.push(`/output/${data.outputId}`);
      }
    });
    return () => {
      socket.off("generation:complete");
    };
  }, [sessionId, router]);

  const handleGenerate = async () => {
    if (!form.subject || !form.className) {
      alert("Please fill subject and class!");
      return;
    }
    setLoading(true);
    await axios.post("http://localhost:5000/api/toolkit/generate", {
      ...form,
      sessionId,
    });
  };

  const questionTypeOptions = [
    "Multiple Choice Questions",
    "Short Questions",
    "Long Answer Questions",
    "Diagram/Graph-Based Questions",
    "Numerical Problems",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 p-8 max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">
          AI Teacher's Toolkit
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Generate a question paper using AI
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                School Name
              </label>
              <input
                type="text"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Science"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Class
              </label>
              <input
                type="text"
                placeholder="e.g. 5th"
                value={form.className}
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Time Allowed
              </label>
              <input
                type="text"
                value={form.timeAllowed}
                onChange={(e) =>
                  setForm({ ...form, timeAllowed: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
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
            {form.questionTypes.map((qt, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <select
                  value={qt.type}
                  onChange={(e) => {
                    const updated = [...form.questionTypes];
                    updated[index].type = e.target.value;
                    setForm({ ...form, questionTypes: updated });
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {questionTypeOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const updated = form.questionTypes.filter(
                      (_, i) => i !== index,
                    );
                    setForm({ ...form, questionTypes: updated });
                  }}
                  className="text-gray-400 hover:text-red-500 text-lg"
                >
                  ×
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const updated = [...form.questionTypes];
                      updated[index].count = Math.max(1, qt.count - 1);
                      setForm({ ...form, questionTypes: updated });
                    }}
                    className="w-6 h-6 border rounded text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{qt.count}</span>
                  <button
                    onClick={() => {
                      const updated = [...form.questionTypes];
                      updated[index].count = qt.count + 1;
                      setForm({ ...form, questionTypes: updated });
                    }}
                    className="w-6 h-6 border rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const updated = [...form.questionTypes];
                      updated[index].marks = Math.max(1, qt.marks - 1);
                      setForm({ ...form, questionTypes: updated });
                    }}
                    className="w-6 h-6 border rounded text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{qt.marks}</span>
                  <button
                    onClick={() => {
                      const updated = [...form.questionTypes];
                      updated[index].marks = qt.marks + 1;
                      setForm({ ...form, questionTypes: updated });
                    }}
                    className="w-6 h-6 border rounded text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setForm({
                  ...form,
                  questionTypes: [
                    ...form.questionTypes,
                    { type: "Short Questions", count: 3, marks: 2 },
                  ],
                })
              }
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mt-2"
            >
              <span className="text-lg">+</span> Add Question Type
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Additional Instructions
            </label>
            <textarea
              value={form.instructions}
              onChange={(e) =>
                setForm({ ...form, instructions: e.target.value })
              }
              placeholder="e.g. Focus on NCERT chapters 1-5, include diagrams..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-24 resize-none"
            />
          </div>
        </div>
        {/* Main Prompt */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Your Prompt
          </label>
          <textarea
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            placeholder="e.g. Generate a question paper for Class 5 Science based on NCERT Chapter 3 - Fibre to Fabric..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-28 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {loading ? "Generating... ⏳" : "Generate Question Paper →"}
          </button>
        </div>

        {loading && (
          <div className="mt-6 text-center text-sm text-gray-500">
            AI is generating your question paper. This may take 10-15 seconds...
          </div>
        )}
      </div>
    </div>
  );
}
