"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, ExternalLink } from "lucide-react";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bible-school/enrollments")
      .then((r) => r.json())
      .then((data) => { setEnrollments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Enrollments</h1>
      <div className="space-y-2">
        {enrollments.map((e) => (
          <div key={e.id} className="bg-black/40 border border-white/[0.06] rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{e.studentName}</h3>
              <p className="text-xs text-gray-500">{e.course?.title} · Enrolled {new Date(e.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-btl-red rounded-full" style={{ width: `${e.progress}%` }} /></div>
                <span className="text-[10px] text-gray-500">{e.progress}%</span>
                {e.certificate && <span className="text-[10px] text-green-400 flex items-center gap-0.5"><Check className="h-3 w-3" /> Certified</span>}
                {e.completedAt && !e.certificate && <span className="text-[10px] text-yellow-400">Completed</span>}
              </div>
            </div>
            <div className="text-right text-[10px] text-gray-500">
              {e.email && <p>{e.email}</p>}
              {e.certificate && <a href={`/certificate/${e.certificate.certId}`} target="_blank" className="text-btl-red hover:underline flex items-center gap-0.5"><ExternalLink className="h-3 w-3" /> Cert</a>}
            </div>
          </div>
        ))}
        {enrollments.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No enrollments yet.</p>}
      </div>
    </div>
  );
}
