"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Award, ChevronRight, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";
import Certificate from "@/components/Certificate";

interface Question {
  id: string;
  question: string;
  options: string;
  correctAnswer: number;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  questions: Question[];
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function CoursePage() {
  return (
    <AuthGuard>
      <CourseContent />
    </AuthGuard>
  );
}

function CourseContent() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [view, setView] = useState<"reading" | "quiz" | "certificate">("reading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/courses/${courseId}`).then((r) => r.json()),
      fetch(`/api/enrollments/${courseId}`).then((r) => r.json()),
    ]).then(([courseData, enrollmentData]) => {
      setCourse(courseData);
      const allLessons = courseData.lessons || [];
      const fetched: Lesson[] = allLessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        content: l.content || "",
        order: l.order,
        questions: (l.questions || []).map((q: any) => ({
          ...q,
          options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        })),
      }));
      setLessons(fetched);
      setEnrollment(enrollmentData.enrollment);
      setLessonProgress(enrollmentData.lessonProgress || []);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load course");
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0 && lessonProgress.length > 0) {
      const incompleteIndex = lessons.findIndex((l) => !lessonProgress.some((p: any) => p.lessonId === l.id && p.completed));
      if (incompleteIndex > 0) setCurrentLessonIndex(incompleteIndex);
    }
  }, [lessons, lessonProgress]);

  const lesson = lessons[currentLessonIndex];
  const totalLessons = lessons.length;
  const question = lesson?.questions?.[currentQuestionIndex];

  const completedLessonIds = lessonProgress.filter((p: any) => p.completed).map((p: any) => p.lessonId);
  const completedLessonsCount = completedLessonIds.length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const allDone = completedLessonsCount >= totalLessons && totalLessons > 0;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    if (answerIndex === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setSaving(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            score,
            totalQuestions: lesson.questions.length,
          }),
        });
        toast.success("Progress saved!");
      } catch {
        toast.error("Failed to save progress");
      }
      setSaving(false);

      if (currentLessonIndex < totalLessons - 1) {
        setCurrentLessonIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setView("reading");
        window.scrollTo(0, 0);
      } else {
        setView("certificate");
      }
    }
  };

  const goToLesson = (index: number) => {
    if (index >= 0 && index < totalLessons) {
      setCurrentLessonIndex(index);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setView("reading");
      window.scrollTo(0, 0);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
    </div>
  );

  if (!course || lessons.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center text-gray-500">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg">Course not found</p>
        <Button onClick={() => router.push("/bible-school")} className="mt-4 bg-btl-red text-white">Back to courses</Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.push("/bible-school")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <div className="flex-1" />
          {/* Progress */}
          {!allDone && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-btl-red rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <span>{completedLessonsCount}/{totalLessons}</span>
            </div>
          )}
        </div>

        {/* Course title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-urdu text-right">{course.title}</h1>

        {view === "certificate" ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Certificate courseName={course.title} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - lesson list */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-btl-card border border-btl-card-border rounded-xl p-4 sticky top-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 font-urdu text-right">اسباق</h3>
                <div className="space-y-1">
                  {lessons.map((l, i) => {
                    const isDone = completedLessonIds.includes(l.id);
                    const isActive = i === currentLessonIndex;
                    return (
                      <button
                        key={l.id}
                        onClick={() => goToLesson(i)}
                        className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                          isActive ? "bg-btl-red/10 text-btl-red" : isDone ? "text-green-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{isDone ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-xs text-gray-600">{i + 1}</span>}</span>
                        <span className="flex-1 text-right">{l.title}</span>
                      </button>
                    );
                  })}
                </div>
                {allDone && (
                  <Button onClick={() => setView("certificate")} className="w-full mt-4 bg-btl-red hover:bg-btl-red/90 text-white text-sm">
                    <Award className="h-4 w-4 mr-1" /> View Certificate
                  </Button>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                {view === "reading" && lesson && (
                  <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-btl-card border border-btl-card-border rounded-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs text-gray-500">Lesson {currentLessonIndex + 1} of {totalLessons}</span>
                      <h2 className="text-xl font-bold text-white font-urdu">{lesson.title}</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line text-right font-urdu text-lg">{lesson.content}</p>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <Button onClick={() => setView("quiz")} className="bg-btl-red hover:bg-btl-red/90 text-white px-8 h-12 rounded-xl font-urdu text-lg">
                        کوئز شروع کریں <ChevronRight className="mr-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {view === "quiz" && question && (
                  <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-btl-card border border-btl-card-border rounded-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {lesson.questions.length}</span>
                      <span className="text-sm text-btl-red">Score: {score}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white mb-6 text-right font-urdu leading-relaxed">{question.question}</h3>

                    <div className="space-y-3">
                      {(typeof question.options === "string" ? JSON.parse(question.options) : question.options).map((opt: string, i: number) => {
                        let bg = "bg-white/5 hover:bg-white/10 border-white/10";
                        if (showFeedback) {
                          if (i === question.correctAnswer) bg = "bg-green-500/20 border-green-500/50";
                          else if (i === selectedAnswer && i !== question.correctAnswer) bg = "bg-red-500/20 border-red-500/50";
                          else bg = "bg-white/5 border-white/5 opacity-50";
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={showFeedback}
                            className={`w-full text-right p-4 rounded-xl border ${bg} transition-all duration-300 flex items-center justify-between gap-3`}
                          >
                            <span>{showFeedback && i === question.correctAnswer && <CheckCircle className="h-5 w-5 text-green-400" />}
                              {showFeedback && i === selectedAnswer && i !== question.correctAnswer && <XCircle className="h-5 w-5 text-red-400" />}</span>
                            <span className="flex-1 text-right text-white font-urdu text-lg">{opt}</span>
                            <span className="text-sm text-gray-500 w-6 text-center">{String.fromCharCode(65 + i)}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showFeedback && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                        <Button onClick={handleNext} disabled={saving} className="w-full h-12 bg-btl-red hover:bg-btl-red/90 text-white font-urdu text-lg rounded-xl">
                          {saving ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...</> : currentQuestionIndex < lesson.questions.length - 1 ? "اگلا سوال" : currentLessonIndex < totalLessons - 1 ? "اگلا سبق" : "مکمل کریں"}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
