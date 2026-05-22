"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react";
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
      toast.success("Question updated");
    } else {
      const res = await fetch(`/api/lessons/${lessonId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return toast.error("Failed to create");
      toast.success("Question created");
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
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to lessons
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Questions: {lessonTitle}</h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-btl-red hover:bg-btl-red/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : editingId ? "Add New" : "Add Question"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-[#111] border border-white/5 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Question *</label>
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">Options *</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="correct" checked={form.correctAnswer === i} onChange={() => setForm({ ...form, correctAnswer: i })} className="accent-btl-red" />
                <span className="text-xs text-gray-500 w-5">{i + 1}.</span>
                <input value={opt} onChange={(e) => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }} className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-btl-red" placeholder={`Option ${i + 1}`} required />
                {form.correctAnswer === i && <span className="text-xs text-green-400">Correct</span>}
              </div>
            ))}
          </div>
          <Button type="submit" className="bg-btl-red hover:bg-btl-red/90 text-white">
            {editingId ? "Update Question" : "Add Question"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No questions yet. Click "Add Question" to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, i) => {
            const opts = JSON.parse(q.options);
            return (
              <div key={q.id} className="bg-[#111] border border-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      <span className="text-gray-500 mr-2">Q{i + 1}.</span> {q.question}
                    </p>
                    <div className="mt-2 space-y-1">
                      {opts.map((opt: string, oi: number) => (
                        <p key={oi} className={`text-xs ${q.correctAnswer === oi ? "text-green-400" : "text-gray-500"}`}>
                          {oi + 1}. {opt} {q.correctAnswer === oi && "✓"}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button onClick={() => edit(q)} className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(q.id)} className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
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
