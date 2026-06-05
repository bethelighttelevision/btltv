import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function BibleSchoolPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Bible School</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">Deepen your faith with free video courses. Learn at your own pace, complete quizzes, and earn certificates.</p>
      </div>
      <div className="space-y-8">
        {["intro", "advanced"].map((level) => {
          const filtered = courses.filter((c) => c.level === level);
          if (filtered.length === 0) return null;
          return (
            <div key={level}>
              <h2 className="text-lg font-semibold text-white mb-3">{level === "intro" ? "Introductory Courses" : "Advanced Courses"}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((c) => (
                  <Link key={c.id} href={`/bible-school/${c.slug}`} className="bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors group">
                    {c.thumbnail && <div className="aspect-video bg-gray-800 overflow-hidden"><img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.level === "intro" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{c.level}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                      <p className="text-[10px] text-gray-600 mt-2">{c._count.lessons} lessons · {c._count.enrollments} enrolled</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {courses.length === 0 && (
        <p className="text-center text-gray-500 py-20">No courses available yet.</p>
      )}
    </div>
  );
}
