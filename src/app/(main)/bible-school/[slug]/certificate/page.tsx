"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Loader2, Award, Printer } from "lucide-react";

export default function CertificatePage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const enrollmentId = searchParams.get("enrollmentId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enrollmentId) { setLoading(false); return; }
    fetch(`/api/bible-school/certificate/${enrollmentId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [enrollmentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Certificate not available.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white">Your Certificate</h1>
        <p className="text-sm text-gray-500">Certificate ID: {data.certId}</p>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-btl-red hover:bg-btl-red/90 text-white text-sm font-semibold rounded-lg transition-colors">
          <Printer className="h-4 w-4" /> Download / Print Certificate
        </button>
      </div>

      {/* Certificate Template Overlay */}
      <div ref={certRef} className="relative w-full max-w-[1000px] mx-auto print:max-w-none print:shadow-none" style={{ aspectRatio: "2000 / 1414" }}>
        <img src="/certificate-template.png" alt="Certificate" className="w-full h-full object-contain print:object-fill" />
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12" style={{ fontFamily: "'Georgia', serif" }}>
          <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: "#1a1a2e", marginTop: "-8%" }}>
            {data.studentName}
          </h2>
          <p className="text-sm md:text-base mb-2" style={{ color: "#555" }}>
            for completing the course
          </p>
          <p className="text-lg md:text-2xl font-semibold mb-6" style={{ color: "#1a1a2e" }}>
            {data.courseTitle}
          </p>
          <p className="text-xs md:text-sm" style={{ color: "#777" }}>
            Date: {new Date(data.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-[10px] md:text-xs mt-2" style={{ color: "#999" }}>
            Certificate ID: {data.certId}
          </p>
        </div>
      </div>

      <div className="text-center mt-6 mb-10">
        <p className="text-xs text-gray-500">This certificate is verifiable at btl-tv.com/certificate/{data.certId}</p>
        <button onClick={() => router.push(`/bible-school/${slug}`)} className="text-xs text-btl-red hover:underline mt-2">Back to Course</button>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          nav, header, footer, .no-print { display: none !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:object-fill { object-fit: fill !important; }
        }
      `}</style>
    </div>
  );
}
