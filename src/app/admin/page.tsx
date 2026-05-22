"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Users, HelpCircle, Loader2, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Stats {
  courses: number;
  lessons: number;
  questions: number;
  users: number;
  enrollments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadStats = () => {
    setLoading(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Seed failed");
      toast.success(data.message);
      loadStats();
    } catch {
      toast.error("Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { label: "Courses", value: stats?.courses ?? 0, icon: BookOpen, color: "text-btl-red", href: "/admin/courses" },
    { label: "Lessons", value: stats?.lessons ?? 0, icon: GraduationCap, color: "text-blue-400", href: "/admin/courses" },
    { label: "Questions", value: stats?.questions ?? 0, icon: HelpCircle, color: "text-green-400", href: "/admin/courses" },
    { label: "Users", value: stats?.users ?? 0, icon: Users, color: "text-purple-400", href: "#" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        {stats?.courses === 0 && (
          <Button onClick={seed} disabled={seeding} className="bg-btl-red hover:bg-btl-red/90 text-white">
            {seeding ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Seeding...</> : <><Database className="h-4 w-4 mr-1" /> Restore Default Courses</>}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} className="bg-[#111] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                <card.icon className={`h-8 w-8 ${card.color} mb-3`} />
                <div className="text-3xl font-bold text-white">{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.label}</div>
              </Link>
            ))}
          </div>

          {stats?.courses === 0 && (
            <div className="mt-8 text-center py-12 bg-[#111] border border-white/5 rounded-xl">
              <Database className="h-10 w-10 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400 mb-4">No courses in the database yet.</p>
              <Button onClick={seed} disabled={seeding} className="bg-btl-red hover:bg-btl-red/90 text-white">
                {seeding ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Seeding...</> : "Restore Default Courses"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
