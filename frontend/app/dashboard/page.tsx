"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAssignments } from "../../store/assignmentSlice";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { assignments, status } = useAppSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Assignments</h1>
          <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
        </div>

        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">No assignments yet</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Create your first assignment to start collecting and grading student submissions.</p>
            <Link href="/create" className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition">
              + Create Your First Assignment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {assignments.map((assignment: any) => (
              <div key={assignment._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800">{assignment.title || "Untitled Assignment"}</h3>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Assigned on: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}