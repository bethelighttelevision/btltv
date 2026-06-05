import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const prisma = new PrismaClient();

export default async function CertificateVerifyPage({ params }: { params: { certId: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { certId: params.certId },
    include: { enrollment: { include: { course: true } } },
  });

  if (!certificate) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-6"><ChevronLeft className="h-3 w-3" /> Back to Home</Link>
      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-green-400 mb-2">Valid Certificate</h1>
        <p className="text-gray-400">This certificate was issued to <strong className="text-white">{certificate.enrollment.studentName}</strong></p>
        <p className="text-gray-400 mt-1">for completing the course <strong className="text-white">{certificate.enrollment.course.title}</strong></p>
        <p className="text-gray-500 text-sm mt-4">Issued: {new Date(certificate.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p className="text-gray-500 text-xs mt-1">Certificate ID: {certificate.certId}</p>
      </div>
    </div>
  );
}
