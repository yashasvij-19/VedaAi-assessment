"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAssignments } from "../../store/assignmentSlice";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { assignments } = useAppSelector((state) => state.assignments);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const filtered = assignments.filter((a: any) =>
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Topbar title="Assignments" />

        <div className="pt-16 md:pt-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto px-4 md:px-8">

            {/* Header */}
            <div className="hidden md:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Assignments
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Generate, manage and optimize AI-powered assessments.
                </p>
              </div>

              <Link
                href="/create"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 h-12 rounded-2xl flex items-center text-sm font-medium"
              >
                + Create Assignment
              </Link>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="absolute left-4 top-3.5 text-slate-400">
                  🔍
                </span>
              </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">
                No assignments found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((assignment: any) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    router={router}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CARD ===================== */

function AssignmentCard({
  assignment,
  router,
  dispatch,
}: any) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/${assignment._id}`
      );

      // refresh list properly instead of reload
      dispatch(fetchAssignments());
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete assignment");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition relative">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {assignment.title || "Untitled Assignment"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Due:{" "}
            {assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString()
              : "No due date"}
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            ⋮
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

              <button
                onClick={() =>
                  router.push(`/output/${assignment._id}`)
                }
                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
              >
                View Details
              </button>

              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
              >
                Delete
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">

        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          Assignment
        </span>

        <button
          onClick={() => router.push(`/output/${assignment._id}`)}
          className="text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          View Details →
        </button>

      </div>
    </div>
  );
}