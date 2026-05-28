"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import axios from "axios";

import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";

export default function OutputPage() {
  const { id } = useParams();
  const router = useRouter();
  const [output, setOutput] = useState<any>(null);
  const cached = null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutput = async () => {
      try {
        const res = await axios.get(
          `process.env.NEXT_PUBLIC_API_URL/api/toolkit/output/${id}`,
        );

        setOutput(res.data);
      } catch (error) {
        console.error("Failed to fetch output:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOutput();
  }, [id]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("question-paper");

    if (!element) return;

    const html2canvas = (await import("html2canvas")).default;

    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${output.subject}-${output.className}-question-paper.pdf`);
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />

        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Loading...
            </h2>

            <p className="text-sm text-slate-500">
              Preparing your generated assessment...
            </p>
          </div>
        </div>
      </div>
    );

  if (!output)
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />

        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg font-medium">Output not found</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <Topbar title="Question Paper" showBack={true} />

      <div className="flex-1 md:ml-64 pt-16 md:pt-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                  Question Paper Ready
                </h1>

                <p className="text-slate-300 text-sm md:text-base">
                  Your AI-generated question paper is ready for review, export
                  and printing.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => router.back()}
                  className="h-12 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all"
                >
                  ← Back
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="h-12 px-5 rounded-2xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  ⬇ Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Main Paper */}
          <div
            id="question-paper"
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm"
          >
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-6 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {output.school}
              </h1>

              <p className="text-base font-medium text-slate-700 mt-2">
                Subject: {output.subject}
              </p>

              <p className="text-slate-500">Class: {output.className}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">Time Allowed</p>

                <p className="font-semibold text-slate-900">
                  {output.timeAllowed || "45 minutes"}
                </p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-orange-500 mb-1">Maximum Marks</p>

                <p className="font-semibold text-orange-700">
                  {output.maxMarks}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-slate-800">
                General Instructions
              </p>

              <p className="text-sm text-slate-600 mt-2">
                {output.generalInstruction ||
                  "All questions are compulsory unless stated otherwise."}
              </p>
            </div>

            {/* Student Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {["Student Name", "Roll Number", "Section"].map((field) => (
                <div
                  key={field}
                  className="border border-slate-200 rounded-2xl p-4"
                >
                  <p className="text-xs text-slate-500 mb-3">{field}</p>

                  <div className="border-b border-slate-300 h-5"></div>
                </div>
              ))}
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {output.sections.map((section: any, sIndex: number) => (
                <div
                  key={sIndex}
                  className="border border-slate-200 rounded-3xl p-5 md:p-6"
                >
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-medium mb-3">
                      Section {sIndex + 1}
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">
                      {section.title}
                    </h2>

                    <p className="text-sm font-medium text-slate-600 mt-1">
                      {section.questionType}
                    </p>

                    <p className="text-sm italic text-slate-500 mt-2">
                      {section.instruction}
                    </p>
                  </div>

                  <ol className="space-y-4">
                    {section.questions.map((q: any, qIndex: number) => (
                      <li
                        key={qIndex}
                        className="border border-slate-200 rounded-2xl p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex gap-3">
                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center mt-0.5">
                              {qIndex + 1}
                            </span>

                            <p className="text-sm text-slate-700 leading-relaxed">
                              {q.text}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 md:ml-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                q.difficulty === "Easy"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : q.difficulty === "Moderate"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              {q.difficulty}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                              {q.marks} Marks
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
