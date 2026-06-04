"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Award, Loader2, BarChart3, LogOut, User,
  Download, ChevronRight, GraduationCap, Camera, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

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
  const { data: session, update } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ courses: 0, completed: 0, lessons: 0 });
  const [avatarUploading, setAvatarUploading] = useState(false);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      toast.error("Failed to upload avatar");
      setAvatarUploading(false);
      return;
    }
    toast.success("Avatar updated!");
    await update();
    setAvatarUploading(false);
  };

  const downloadCertificate = (courseId: string) => {
    window.open(`/api/certificate/${courseId}`, "_blank");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
      </div>
    );

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-14 w-14 rounded-full bg-btl-red/20 border-2 border-btl-red/30 flex items-center justify-center text-lg text-btl-red font-bold uppercase overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  (session?.user?.name || "S")[0]
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                />
              </label>
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome, {session?.user?.name || "Student"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Your learning dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/bible-school">
              <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white h-10">
                <BookOpen className="h-4 w-4 mr-2" /> Browse Courses
              </Button>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-white p-2 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-btl-red/10 border border-btl-red/20 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-5 w-5 text-btl-red" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.courses}</div>
            <div className="text-xs text-gray-500 mt-1">Enrolled Courses</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-btl-card border border-btl-card-border rounded-xl p-5 text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.lessons}</div>
            <div className="text-xs text-gray-500 mt-1">Lessons Done</div>
          </motion.div>
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
            {enrollments.map((enrollment, i) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-btl-card border border-btl-card-border rounded-xl p-5 flex items-center gap-4 hover:border-btl-red/20 transition-colors"
              >
                <div className="h-16 w-16 rounded-lg bg-btl-dark flex items-center justify-center shrink-0 overflow-hidden">
                  {enrollment.course.image ? (
                    <img
                      src={enrollment.course.image}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-7 w-7 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{enrollment.course.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {enrollment.completed
                      ? "Completed!"
                      : enrollment.resumeLessonTitle
                        ? `Resume: ${enrollment.resumeLessonTitle}`
                        : `${enrollment.course._count.lessons} lessons`}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[240px]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          enrollment.completed ? "bg-emerald-500" : "bg-btl-red"
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 font-mono">
                      {enrollment.progress}%
                    </span>
                  </div>
                </div>
                {enrollment.completed ? (
                  <button
                    onClick={() => downloadCertificate(enrollment.course.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Certificate
                  </button>
                ) : (
                  <Link href={`/bible-school/course/${enrollment.course.id}`}>
                    <Button className="bg-btl-red hover:bg-btl-red/90 text-white h-10 text-sm">
                      Continue <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
