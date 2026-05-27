"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, BookMarked, Award, LogIn, UserPlus, GraduationCap, Sparkles, Clock, Users, ChevronLeft, Loader2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  _count: { lessons: number; enrollments: number };
}

const statsDef = [
  { icon: BookOpen, value: "courses", label: "کورسز" },
  { icon: Users, value: "users", label: "طلباء" },
  { icon: Clock, value: "lessons", label: "اسباق" },
  { icon: Award, value: "مفت", label: "" },
];

export default function BibleSchool() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({ courses: 0, users: 0, lessons: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/stats/public").then((r) => r.json()),
    ]).then(([coursesData, statsData]) => {
      if (Array.isArray(coursesData)) setCourses(coursesData);
      setLiveStats({
        courses: statsData.courses || 0,
        users: statsData.users || 0,
        lessons: statsData.lessons || 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      {/* ─── Hero ─── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-visible py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0a0a0a]/80 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.15),transparent_70%)]" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-4 w-4 text-btl-red" />
              <span className="text-sm text-gray-400 font-urdu">مسیحی تعلیم کا آن لائن پلیٹ فارم</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">BTL</span>
              <br />
              <span className="font-urdu text-5xl md:text-6xl text-btl-red drop-shadow-[0_0_30px_rgba(229,9,20,0.3)]">بائبل سکول</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-urdu">
              خدا کے کلام کی گہرائی میں اتریں اور مفت آن لائن کورسز کے ذریعے اپنی روحانی زندگی کو مضبوط بنائیں۔
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button className="h-14 px-10 bg-btl-red hover:bg-btl-red/90 text-white font-urdu text-lg rounded-full shadow-[0_0_25px_rgba(229,9,20,0.4)] transition-all duration-300 hover:scale-105">
                    <LayoutDashboard className="ml-2 h-5 w-5" /> میرا ڈیش بورڈ
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button className="h-14 px-10 bg-btl-red hover:bg-btl-red/90 text-white font-urdu text-lg rounded-full shadow-[0_0_25px_rgba(229,9,20,0.4)] transition-all duration-300 hover:scale-105">
                      <LogIn className="ml-2 h-5 w-5" /> لاگ ان کریں
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="h-14 px-10 border-white/20 text-white hover:bg-white hover:text-black font-urdu text-lg rounded-full transition-all duration-300 hover:scale-105">
                      <UserPlus className="ml-2 h-5 w-5" /> رجسٹر کریں
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <Link href="/" className="absolute top-6 left-6 z-20">
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full px-4 h-10">
            <ChevronLeft className="ml-2 h-4 w-4" /> <span className="font-urdu text-sm">واپس</span>
          </Button>
        </Link>
      </div>

      {/* ─── Stats ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statsDef.map((stat, i) => {
            const val = stat.value === "courses" ? liveStats.courses : stat.value === "users" ? liveStats.users : stat.value === "lessons" ? liveStats.lessons : stat.value;
            return (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 text-center backdrop-blur-sm">
              <stat.icon className="h-6 w-6 text-btl-red mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{val}</div>
              {stat.label && <div className="text-sm text-gray-500 font-urdu mt-1">{stat.label}</div>}
            </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── Courses ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-8 w-1 bg-btl-red rounded-full" />
          <h2 className="text-3xl font-bold font-urdu">ہمارے کورسز</h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading courses...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(courses as any[]).map((course: any, i: number) => (
              <motion.div
                key={course.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-btl-red/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(229,9,20,0.1)]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.image || ""}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                </div>

                <div className="p-6 text-right">
                  <h3 className="text-2xl font-bold text-white group-hover:text-btl-red transition-colors font-urdu">{course.title}</h3>

                  <div className="flex items-center justify-end gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {course._count?.enrollments || 0} طالب
                    </span>
                    <span className="flex items-center gap-1">
                      <BookMarked className="h-3.5 w-3.5" /> {course._count?.lessons || 0} اسباق
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mt-3 leading-relaxed font-urdu">{course.description}</p>

                  <Link href={`/bible-school/course/${course.id}`} className="mt-5 block">
                    <Button className="w-full bg-white/5 border border-white/10 hover:bg-btl-red hover:border-btl-red text-white h-12 rounded-xl font-urdu text-base transition-all duration-300">
                      کورس شروع کریں
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Why Online Course ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-4 sm:px-6 mt-16"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111] to-[#0d0d0d] border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.08),transparent_60%)]" />
          <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-2xl font-bold text-white mb-4 font-urdu">کیوں آن لائن کورس؟</h3>
              <p className="text-gray-400 leading-relaxed font-urdu text-lg">
                یہ کورس ہر اس شخص کے لیے تیار کیا گیا ہے جو مسیحی ایمان کو بہتر طور پر سمجھنا چاہتا ہے۔
                ہر سبق کے بعد سوالات ہیں تاکہ آپ اپنی سمجھ کو جانچ سکیں۔
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-6">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Sparkles className="h-4 w-4 text-btl-red" />
                  <span className="text-sm text-gray-300 font-urdu">مکمل مفت</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Award className="h-4 w-4 text-btl-red" />
                  <span className="text-sm text-gray-300 font-urdu">سرٹیفکیٹ</span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-btl-red/10 border border-btl-red/30 flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-btl-red" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
