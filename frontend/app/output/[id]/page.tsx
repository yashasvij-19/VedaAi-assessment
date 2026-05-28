"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

export default function OutputPage() {
  const { id } = useParams();
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutput = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/toolkit/output/${id}`);
        setOutput(res.data);
      } catch (error) {
        console.error("Failed to fetch output:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOutput();
  }, [id]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading question paper...</p>
      </div>
    </div>
  );

  if (!output) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 flex items-center justify-center">
        <p className="text-red-500">Output not found!</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 p-8">
        
        {/* Dark header bar */}
        <div className="bg-gray-900 text-white rounded-xl p-4 mb-6 flex justify-between items-center">
          <p className="text-sm">Here is your generated question paper for {output.subject} - {output.className}</p>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            ⬇ Download as PDF
          </button>
        </div>

        {/* Question Paper */}
        <div id="question-paper" className="bg-white border border-gray-200 rounded-xl p-10 max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{output.school}</h1>
            <p className="text-base font-medium">Subject: {output.subject}</p>
            <p className="text-base">Class: {output.className}</p>
          </div>

          {/* Time and Marks */}
          <div className="flex justify-between text-sm mb-4">
            <span>Time Allowed: {output.timeAllowed}</span>
            <span>Maximum Marks: {output.maxMarks}</span>
          </div>

          {/* General Instruction */}
          <p className="text-sm mb-6">{output.generalInstruction}</p>

          {/* Student Info */}
          <div className="mb-6 text-sm">
            <p className="mb-2">Name: <span className="inline-block w-48 border-b border-gray-400"></span></p>
            <p className="mb-2">Roll Number: <span className="inline-block w-40 border-b border-gray-400"></span></p>
            <p className="mb-2">Class: <span className="inline-block w-20 border-b border-gray-400"></span> Section: <span className="inline-block w-20 border-b border-gray-400"></span></p>
          </div>

          {/* Sections */}
          {output.sections.map((section: any, sIndex: number) => (
            <div key={sIndex} className="mb-8">
              <h2 className="text-center font-bold text-base mb-2">{section.title}</h2>
              <p className="font-medium text-sm mb-1">{section.questionType}</p>
              <p className="text-sm italic text-gray-600 mb-3">{section.instruction}</p>
              
              <ol className="list-decimal list-inside space-y-3">
                {section.questions.map((q: any, qIndex: number) => (
                  <li key={qIndex} className="text-sm">
                    <span className="mr-2">{q.text}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                      q.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                      q.difficulty === "Moderate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-gray-500 text-xs">[{q.marks} Marks]</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}