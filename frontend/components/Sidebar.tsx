"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "My Groups", href: "/groups" },
    { label: "Assignments", href: "/dashboard" },
    { label: "AI Teacher's Toolkit", href: "/toolkit" },
    { label: "My Library", href: "/library" },
  ];

  return (
    <div className="w-56 h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-4 fixed left-0 top-0">
      
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-sm">V</div>
          <span className="font-semibold text-gray-800">VedaAI</span>
        </div>

        {/* Create Button */}
        <button
          onClick={() => window.location.href = "/create"}
          className="w-full bg-gray-900 text-white rounded-full py-2 text-sm font-medium mb-6 hover:bg-gray-700 transition"
        >
          + Create Assignment
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                pathname === item.href
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Profile */}
      <div className="flex items-center gap-2 p-2 border-t border-gray-100 pt-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <div className="w-full h-full bg-orange-200 flex items-center justify-center text-xs font-medium">D</div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-800">Delhi Public School</p>
          <p className="text-xs text-gray-500">Bokaro Steel City</p>
        </div>
      </div>

    </div>
  );
}