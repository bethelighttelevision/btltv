import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ courseId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, description: true },
    });
    if (!course) return { title: "Course Not Found" };
    return {
      title: `${course.title} - BTL TV Bible School`,
      description: course.description.slice(0, 160),
      openGraph: {
        title: `${course.title} - BTL TV Bible School`,
        description: course.description.slice(0, 160),
      },
    };
  } catch {
    return { title: "Course - BTL TV Bible School" };
  }
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
