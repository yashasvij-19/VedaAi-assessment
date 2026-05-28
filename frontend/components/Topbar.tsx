"use client";

import { useRouter } from "next/navigation";

interface TopbarProps {
  title: string;
  showBack?: boolean;
}

export default function Topbar({
  title,
  showBack,
}: TopbarProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            >
              ←
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                V
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm tracking-tight">
                  VedaAI
                </p>

                <p className="text-[10px] text-slate-400">
                  Smart Assessment
                </p>
              </div>
            </div>
          )}

          {showBack && (
            <span className="font-medium text-slate-800 text-sm">
              {title}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600">
            🔔
          </button>

          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-semibold">
            D
          </div>
        </div>
      </div>
    </>
  );
}
