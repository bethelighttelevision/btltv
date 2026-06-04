"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-14 bg-[#0d0d0d] border-b border-white/[0.04] flex items-center justify-between px-6">
      <div className="text-xs text-gray-400">BTL TV Admin</div>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <div className="h-7 w-7 rounded-full bg-white/[0.06] flex items-center justify-center">
            <User className="h-3.5 w-3.5" />
          </div>
          <span>{session?.user?.name || "Admin"}</span>
        </button>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] border border-white/[0.06] rounded-lg shadow-xl z-20 py-1">
              <button
                onClick={() => { setShowDropdown(false); signOut({ callbackUrl: "/admin/login" }); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
