"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string;
  correctAnswer: number;
  order: number;
}

export default function AdminQuestions() {
  const { id: lessonId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0 });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/lessons/${lessonId}`).then((r) => r.json()),
      fetch(`/api/lessons/${lessonId}/questions`).then((r) => r.json()),
    ]).then(([lesson, questions]) => {
      setLessonTitle(lesson.title);
      setQuestions(questions);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [lessonId]);

  const resetForm = () => {
    setForm({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
    setShowForm(false);
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) return toast.error("Question is required");
    if (form.options.some((o) => !o.trim())) return toast.error("All options must be filled");

    const body = { question: form.question, options: form.options, correctAnswer: form.correctAnswer };

    if (editingId) {
      const res = await fetch(`/api/questions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return toast.error("Failed to update");
      toast.success("Question updated!");
    } else {
      const res = await fetch(`/api/lessons/${lessonId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return toast.error("Failed to create");
      toast.success("Question created!");
    }
    resetForm();
    load();
  };

  const edit = (q: Question) => {
    setForm({ question: q.question, options: JSON.parse(q.options), correctAnswer: q.correctAnswer });
    setEditingId(q.id);
    setShowForm(true);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete");
    toast.success("Question deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Lessons
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{lessonTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-btl-red hover:bg-btl-red/90 text-white shadow-lg shadow-btl-red/20">
          <Plus className="h-4 w-4 mr-1.5" /> {showForm ? "Cancel" : editingId ? "Add New" : "Add Question"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-gradient-to-b from-[#111] to-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit Question" : "New Question"}</h2>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Question *</label>
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-btl-red/50 transition-colors" placeholder="e.g. What is the first book of the Bible?" required />
          </div>
          <div className="space-y-2.5">
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Options *</label>
            {form.options.map((opt, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                form.correctAnswer === i ? "border-green-500/30 bg-green-500/5" : "border-white/[0.06] bg-black/30"
              }`}>
                <input
                  type="radio"
                  name="correct"
                  checked={form.correctAnswer === i}
                  onChange={() => setForm({ ...form, correctAnswer: i })}
                  className="accent-btl-red h-4 w-4 shrink-0"
                />
                <span className="text-xs text-gray-500 font-mono w-5 shrink-0">{i + 1}.</span>
                <input
                  value={opt}
                  onChange={(e) => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }}
                  className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-gray-600"
                  placeholder={`Option ${i + 1}`}
                  required
                />
                {form.correctAnswer === i && (
                  <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">Correct</span>
                )}
              </div>
            ))}
          </div>
          <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">
            <Save className="h-4 w-4 mr-1.5" /> {editingId ? "Update Question" : "Add Question"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-btl-red" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 bg-[#111] border border-white/[0.06] rounded-2xl">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <Edit className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No questions yet</p>
          <p className="text-sm text-gray-600 mt-1">Click "Add Question" to create your first question.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const opts = JSON.parse(q.options);
            return (
              <div key={q.id} className="bg-[#111] hover:bg-[#151515] border border-white/[0.06] rounded-xl p-4 transition-all">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xs text-gray-500 font-mono shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {opts.map((opt: string, oi: number) => (
                        <div key={oi} className={`flex items-center gap-2 text-xs ${q.correctAnswer === oi ? "text-green-400" : "text-gray-500"}`}>
                          {q.correctAnswer === oi && <Check className="h-3 w-3 shrink-0" />}
                          {q.correctAnswer !== oi && <span className="w-3 shrink-0" />}
                          <span>{oi + 1}. {opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => edit(q)} className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(q.id)} className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
