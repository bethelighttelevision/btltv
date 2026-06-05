"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function LessonViewerPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const eid = params.get("enrollmentId");
    if (!eid) { toast.error("No enrollment found"); setLoading(false); return; }

    Promise.all([
      fetch(`/api/bible-school/lessons/${lessonId}`).then((r) => r.json()),
      fetch(`/api/bible-school/enrollments/${eid}`).then((r) => r.json()),
    ]).then(([l, e]) => {
      setLesson(l);
      setEnrollment(e);
      setAnswers(new Array(l.questions?.length || 0).fill(-1));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lessonId]);

  const handleAnswer = (qIdx: number, optIdx: number) => {
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
  };

  const submitQuiz = async () => {
    if (answers.includes(-1)) { toast.error("Please answer all questions"); return; }
    const correct = lesson.questions.filter((q: any, i: number) => answers[i] === q.correctAnswer).length;
    const total = lesson.questions.length;
    const pct = Math.round((correct / total) * 100);
    setScore(pct);
    setSubmitted(true);
    setShowResults(true);

    const res = await fetch("/api/bible-school/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId: enrollment.id, lessonId: lesson.id, answers }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.passed) {
        setEnrollment({ ...enrollment, progress: data.progress, completed: data.completed });
        if (data.completed) {
          toast.success("All lessons complete! 🎉");
        }
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!lesson) return <div className="text-center py-20 text-gray-500">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.push(`/bible-school/${slug}`)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-6"><ChevronLeft className="h-3 w-3" /> Back to course</button>

      <h1 className="text-xl font-bold text-white mb-4">{lesson.title}</h1>

      {lesson.youtubeId && (
        <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${lesson.youtubeId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {lesson.description && <p className="text-sm text-gray-400 mb-6">{lesson.description}</p>}
      {lesson.content && <div className="text-sm text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{lesson.content}</div>}

      {lesson.questions && lesson.questions.length > 0 && (
        <div className="border-t border-white/[0.06] pt-6 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Lesson Quiz</h2>

          {!quizStarted && !submitted && (
            <button onClick={() => setQuizStarted(true)} className="px-6 py-3 bg-btl-red hover:bg-btl-red/90 text-white text-sm font-semibold rounded-lg">
              Start Quiz
            </button>
          )}

          {quizStarted && !submitted && (
            <div className="space-y-6">
              {lesson.questions.map((q: any, qi: number) => {
                const opts = JSON.parse(q.options);
                return (
                  <div key={q.id} className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {opts.map((o: string, oi: number) => (
                        <button key={oi} onClick={() => handleAnswer(qi, oi)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${answers[qi] === oi ? "bg-btl-red/20 border border-btl-red/40 text-white" : "bg-white/5 border border-white/[0.06] text-gray-400 hover:bg-white/10"}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              <button onClick={submitQuiz} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg">
                Submit Quiz
              </button>
            </div>
          )}

          {showResults && (
            <div className="text-center py-8">
              <div className="text-4xl font-bold mb-2">{score >= 70 ? <span className="text-green-400">{score}%</span> : <span className="text-yellow-400">{score}%</span>}</div>
              <p className="text-sm text-gray-400">{score >= 70 ? "Passed! Great job." : "Needs improvement. Try again."}</p>
              {score >= 70 && (
                <button onClick={() => router.push(`/bible-school/${slug}`)} className="mt-4 px-6 py-3 bg-btl-red hover:bg-btl-red/90 text-white text-sm font-semibold rounded-lg">
                  Back to Course
                </button>
              )}
              {score < 70 && (
                <button onClick={() => { setQuizStarted(false); setSubmitted(false); setShowResults(false); setAnswers(new Array(lesson.questions.length).fill(-1)); }} className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg">
                  Retry Quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {enrollment?.completed && (
        <div className="mt-6 text-center border-t border-white/[0.06] pt-6">
          <button onClick={() => router.push(`/bible-school/${slug}/certificate?enrollmentId=${enrollment.id}`)} className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition-colors">
            View Certificate
          </button>
        </div>
      )}
    </div>
  );
}
