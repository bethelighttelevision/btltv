"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Award, Loader2, BarChart3, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { signOut, useSession } from "next-auth/react";

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  resumeLessonTitle?: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    image: string | null;
    _count: { lessons: number };
  };
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ courses: 0, completed: 0, lessons: 0 });

  useEffect(() => {
    fetch("/api/my-courses")
      .then((r) => r.json())
      .then((data) => {
        setEnrollments(data.enrollments || []);
        const completedCourses = (data.enrollments || []).filter((e: Enrollment) => e.completed).length;
        const totalLessons = (data.lessonProgress || []).filter((p: any) => p.completed).length;
        setStats({
          courses: data.enrollments?.length || 0,
          completed: completedCourses,
          lessons: totalLessons,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {session?.user?.name || "Student"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your learning dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/bible-school">
              <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white h-10">
                <BookOpen className="h-4 w-4 mr-2" /> Browse Courses
              </Button>
            </Link>
            <Link href="/profile" className="text-gray-500 hover:text-white p-2 transition-colors" title="Profile">
              <User className="h-5 w-5" />
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-white p-2 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center">
            <BookOpen className="h-6 w-6 text-btl-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.courses}</div>
            <div className="text-xs text-gray-500 mt-1">Enrolled Courses</div>
          </div>
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center">
            <Award className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </div>
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center">
            <BarChart3 className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.lessons}</div>
            <div className="text-xs text-gray-500 mt-1">Lessons Done</div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <h2 className="text-lg font-bold mb-4">My Courses</h2>

        {enrollments.length === 0 ? (
          <div className="bg-btl-card border border-btl-card-border rounded-xl p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/bible-school">
              <Button className="bg-btl-red hover:bg-btl-red/90 text-white">
                Browse Available Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-btl-card border border-btl-card-border rounded-xl p-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-lg bg-btl-dark flex items-center justify-center shrink-0 overflow-hidden">
                  {enrollment.course.image ? (
                    <img src={enrollment.course.image} alt={enrollment.course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{enrollment.course.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {enrollment.completed
                      ? "Completed!"
                      : enrollment.resumeLessonTitle
                        ? `Resume: ${enrollment.resumeLessonTitle}`
                        : `${enrollment.course._count.lessons} lessons`}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className={`h-full rounded-full transition-all ${enrollment.completed ? "bg-green-500" : "bg-btl-red"}`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{enrollment.progress}%</span>
                  </div>
                </div>
                <Link href={`/bible-school/course/${enrollment.course.id}`}>
                  <Button className={`${enrollment.completed ? "bg-green-600 hover:bg-green-700" : "bg-btl-red hover:bg-btl-red/90"} text-white h-10 text-sm`}>
                    {enrollment.completed ? "View Certificate" : "Continue"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
