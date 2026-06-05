"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Play, CheckCircle, Lock, Award, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEnroll, setShowEnroll] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lookupName, setLookupName] = useState("");
  const [showLookup, setShowLookup] = useState(false);

  useEffect(() => {
    fetch(`/api/bible-school/courses/${slug}`)
      .then((r) => r.json())
      .then((data) => { setCourse(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const enroll = async () => {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    setEnrolling(true);
    const res = await fetch("/api/bible-school/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: slug, studentName: name.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setEnrollment(data);
      toast.success("Enrolled! Start learning now.");
    } else {
      const err = await res.json();
      toast.error(err.error || "Enrollment failed");
    }
    setEnrolling(false);
  };

  const lookup = async () => {
    if (!lookupName.trim()) { toast.error("Enter your name"); return; }
    const res = await fetch("/api/bible-school/enrollments/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName: lookupName.trim(), courseId: course.id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        setEnrollment(data[0]);
        toast.success("Found your enrollment!");
      } else {
        toast.error("No enrollment found with that name");
      }
    } else {
      toast.error("No enrollment found with that name");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!course) return <div className="text-center py-20 text-gray-500">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => router.push("/bible-school")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-4"><ChevronLeft className="h-3 w-3" /> Back to Bible School</button>
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden">
        {course.thumbnail && <div className="aspect-video bg-gray-800"><img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" /></div>}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${course.level === "intro" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{course.level === "intro" ? "Introductory" : "Advanced"}</span>
            <span className="text-xs text-gray-500">{course.lessons?.length || 0} lessons</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">{course.description}</p>
          {course.creditText && (
            <p className="text-xs text-gray-500 mt-4 italic">{course.creditText}</p>
          )}

          {!enrollment ? (
            <div className="mt-6 space-y-3">
              <button onClick={() => setShowEnroll(!showEnroll)} className="px-6 py-3 bg-btl-red hover:bg-btl-red/90 text-white text-sm font-semibold rounded-lg transition-colors">
                Enroll Now — Free
              </button>
              <button onClick={() => setShowLookup(!showLookup)} className="block text-xs text-gray-500 hover:text-gray-300 mt-2">
                Already enrolled? Look up my enrollment
              </button>

              {showEnroll && (
                <div className="max-w-sm space-y-3 bg-black/40 border border-white/[0.06] rounded-lg p-4">
                  <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
                  <input placeholder="Email (optional, for certificate)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
                  <button onClick={enroll} disabled={enrolling} className="w-full px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg disabled:opacity-50">{enrolling ? "Enrolling..." : "Start Learning"}</button>
                </div>
              )}

              {showLookup && (
                <div className="max-w-sm space-y-3 bg-black/40 border border-white/[0.06] rounded-lg p-4">
                  <input placeholder="Enter your name" value={lookupName} onChange={(e) => setLookupName(e.target.value)} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
                  <button onClick={lookup} className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg">Find My Enrollment</button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle className="h-4 w-4" /> Enrolled as {enrollment.studentName}</div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-btl-red rounded-full" style={{ width: `${enrollment.progress}%` }} /></div>
                <span className="text-xs text-gray-500">{enrollment.progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {course.lessons && course.lessons.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Course Lessons</h2>
              <div className="grid gap-3">
            {course.lessons.map((lesson: any, i: number) => {
              const passedLessonIds = enrollment?.passedLessonIds ? enrollment.passedLessonIds.split(",") : [];
              const completed = passedLessonIds.includes(lesson.id);
              const locked = enrollment ? false : !enrollment;
              return (
                <div key={lesson.id} className={`bg-white/[0.04] border border-white/[0.06] rounded-lg overflow-hidden ${locked ? "opacity-50" : ""}`}>
                  <div className="flex flex-col sm:flex-row">
                    {lesson.youtubeId && (
                      <div className="w-full sm:w-48 shrink-0 aspect-video sm:aspect-auto bg-gray-800">
                        <img src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`} alt={lesson.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${completed ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400"}`}>
                        {completed ? <CheckCircle className="h-4 w-4" /> : locked ? <Lock className="h-4 w-4" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white">{lesson.title}</h3>
                        {lesson.description && <p className="text-xs text-gray-500 mt-0.5">{lesson.description}</p>}
                      </div>
                      {enrollment && (
                        <button
                          onClick={() => router.push(`/bible-school/${slug}/lesson/${lesson.id}?enrollmentId=${enrollment.id}`)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                        >
                          {completed ? "Review" : <><Play className="h-3.5 w-3.5" /> Start</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {enrollment?.completed && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push(`/bible-school/${slug}/certificate?enrollmentId=${enrollment.id}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition-colors"
              >
                <Award className="h-5 w-5" /> View Certificate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
