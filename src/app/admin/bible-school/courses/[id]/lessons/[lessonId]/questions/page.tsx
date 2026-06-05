"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function AdminQuestionsPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0, order: 0 });

  const fetchQuestions = async () => {
    const res = await fetch(`/api/admin/bible-school/courses/${id}/lessons/${lessonId}/questions`);
    if (res.ok) setQuestions(await res.json());
    setLoading(false);
  };
  useEffect(() => { fetchQuestions(); }, [id, lessonId]);

  const save = async () => {
    if (!form.question || form.options.some((o: string) => !o.trim())) { toast.error("All fields required"); return; }
    const url = editing ? `/api/admin/bible-school/questions/${editing.id}` : `/api/admin/bible-school/courses/${id}/lessons/${lessonId}/questions`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, options: form.options.filter((o: string) => o.trim()) }) });
    if (res.ok) { toast.success(editing ? "Updated" : "Created"); setShowForm(false); setEditing(null); setForm({ question: "", options: ["", "", "", ""], correctAnswer: 0, order: 0 }); fetchQuestions(); }
    else toast.error("Failed");
  };

  const del = async (qid: string) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/admin/bible-school/questions/${qid}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchQuestions(); } else toast.error("Failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/bible-school/courses/${id}/lessons`} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><ArrowLeft className="h-4 w-4 text-gray-400" /></Link>
        <h1 className="text-xl font-bold text-white">Quiz Questions</h1>
      </div>

      <button onClick={() => { setEditing(null); setForm({ question: "", options: ["", "", "", ""], correctAnswer: 0, order: questions.length }); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg transition-colors mb-4">
        <Plus className="h-3.5 w-3.5" /> Add Question
      </button>

      {showForm && (
        <div className="mb-6 bg-black/40 border border-white/[0.06] rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">{editing ? "Edit Question" : "New Question"}</h2>
          <textarea placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 h-20 focus:outline-none focus:border-btl-red/50" />
          {form.options.map((opt: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" checked={form.correctAnswer === i} onChange={() => setForm({ ...form, correctAnswer: i })} />
              <input placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => { const opts = [...form.options]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} className="flex-1 bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
            </div>
          ))}
          <p className="text-[10px] text-gray-500">Select the radio button for the correct answer</p>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-btl-red hover:bg-btl-red/90 text-white text-xs font-semibold rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {questions.map((q, i) => {
          const opts = JSON.parse(q.options);
          return (
            <div key={q.id} className="bg-black/40 border border-white/[0.06] rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">#{i + 1}. {q.question}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opts.map((o: string, j: number) => (
                      <span key={j} className={`text-xs px-2 py-1 rounded ${j === q.correctAnswer ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400"}`}>{o}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setForm({ question: q.question, options: opts, correctAnswer: q.correctAnswer, order: q.order }); setEditing(q); setShowForm(true); }} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"><Pencil className="h-4 w-4 text-gray-400" /></button>
                  <button onClick={() => del(q.id)} className="h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center"><Trash2 className="h-4 w-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {questions.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No questions yet.</p>}
      </div>
    </div>
  );
}
