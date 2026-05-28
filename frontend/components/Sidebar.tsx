"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: "🏠",
    },
    {
      label: "My Groups",
      href: "/groups",
      icon: "👥",
    },
    {
      label: "Assignments",
      href: "/dashboard",
      icon: "📋",
    },
    {
      label: "AI Toolkit",
      href: "/toolkit",
      icon: "🤖",
    },
    {
      label: "Library",
      href: "/library",
      icon: "📚",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200 flex-col justify-between px-4 py-6 fixed left-0 top-0 z-40">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm">
              V
            </div>

            <div>
              <h1 className="font-semibold text-slate-900 tracking-tight">
                VedaAI
              </h1>

              <p className="text-xs text-slate-500">
                AI Assessment Platform
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() =>
              (window.location.href = "/create")
            }
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 text-sm font-medium mb-8 transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            + Create Assignment
          </button>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-orange-50 text-orange-600 border border-orange-100 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* School Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-600">
              D
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Delhi Public School
              </p>

              <p className="text-xs text-slate-500">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-50">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`flex flex-col items-center px-3 py-1 transition ${
              pathname === "/"
                ? "text-orange-500"
                : "text-slate-400"
            }`}
          >
            <span className="text-xl">
              🏠
            </span>

            <span className="text-[11px] font-medium">
              Home
            </span>
          </Link>

          <Link
            href="/dashboard"
            className={`flex flex-col items-center px-3 py-1 transition ${
              pathname === "/dashboard"
                ? "text-orange-500"
                : "text-slate-400"
            }`}
          >
            <span className="text-xl">
              📋
            </span>

            <span className="text-[11px] font-medium">
              Tasks
            </span>
          </Link>

          {/* Floating Create Button */}
          <Link
            href="/create"
            className="relative -top-5"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg border-4 border-white active:scale-95 transition-all">
              +
            </div>
          </Link>

          <Link
            href="/toolkit"
            className={`flex flex-col items-center px-3 py-1 transition ${
              pathname === "/toolkit"
                ? "text-orange-500"
                : "text-slate-400"
            }`}
          >
            <span className="text-xl">
              🤖
            </span>

            <span className="text-[11px] font-medium">
              AI
            </span>
          </Link>

          <Link
            href="/library"
            className={`flex flex-col items-center px-3 py-1 transition ${
              pathname === "/library"
                ? "text-orange-500"
                : "text-slate-400"
            }`}
          >
            <span className="text-xl">
              📚
            </span>

            <span className="text-[11px] font-medium">
              Library
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
