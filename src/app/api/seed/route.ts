import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";

const defaultCourses = [
  {
    title: "Chapman",
    description: "یہ 10 اسباق پر مشتمل ایک بہترین کورس ہے۔ ہر باب میں کچھ متن پڑھنے کو ہوتا ہے اور اس کے بارے میں کچھ سوالات ہوتے ہیں۔ آپ کو ایک ایسا سرپرست ملے گا جو آپ کی رہنمائی کرے گا۔",
    image: "/images/bible-school/Chapman%20Banner.png",
    category: "bible-study",
    lessons: [
      { title: "Coming Soon", content: "This course is under development. Lessons will be added soon." },
    ],
  },
  {
    title: "BiblBasics",
    description: "یہ 15 اسباق پر مشتمل ہے۔ یہ آپ کو بائبل کی جھلکیاں اور آپ کے لیے خدا کا پیغام دکھائے گا۔ ہر سبق کے بعد سوالات ہیں تاکہ آپ اپنی سمجھ کو جانچ سکیں۔",
    image: "/images/bible-school/Bible%20Basics%20Banner.png",
    category: "bible-study",
    lessons: [
      {
        title: "سبق 1: تخلیق اور پرانا عہد نامہ",
        content: "خدا نے کائنات کو چھ دن میں تخلیق کیا۔ اس نے انسان کو اپنی صورت پر پیدا کیا لیکن انسان نے گناہ کر کے خدا کی نافرمانی کی۔ پرانے عہد نامے میں ہم دیکھتے ہیں کہ خدا نے کیسے مختلف لوگوں مثلاً نوح، ابراہیم اور موسیٰ کو چنا تاکہ وہ اس کے عہد کو آگے بڑھائیں۔ اس سبق میں ہم کائنات کی ابتدا اور خدا کے چنے ہوئے لوگوں کے بارے میں پڑھیں گے۔",
        questions: [
          { question: "خدا نے کائنات کتنے دنوں میں بنائی؟", options: ["چھ دن میں", "پانچ دن میں", "سات دن میں", "آٹھ دن میں"], correctAnswer: 0 },
          { question: "طوفان کے دوران خدا نے کسے کشتی بنانے کا حکم دیا؟", options: ["موسیٰ", "ابراہیم", "نوح", "داؤد"], correctAnswer: 2 },
          { question: "خدا نے کسے 'ایمان والوں کا باپ' کہا؟", options: ["اسحاق", "یعقوب", "موسیٰ", "ابراہیم"], correctAnswer: 3 },
        ],
      },
      {
        title: "سبق 2: نیا عہد نامہ اور یسوع مسیح",
        content: "نیا عہد نامہ یسوع مسیح کی پیدائش، زندگی، موت اور قیامت کے بارے میں بتاتا ہے۔ یسوع مسیح نے بیماروں کو شفا دی، مردوں کو زندہ کیا اور گناہوں کی معافی کا راستہ دکھایا۔ انہوں نے اپنے شاگردوں کو حکم دیا کہ وہ پوری دنیا میں انجیل کی خوشخبری پھیلائیں۔ اس سبق میں ہم جانیں گے کہ نیا عہد نامہ کیسے ہماری زندگیوں کو بدل سکتا ہے۔",
        questions: [
          { question: "یسوع مسیح کی پیدائش کس شہر میں ہوئی؟", options: ["یروشلم", "بیت لحم", "نارتھ", "گلیل"], correctAnswer: 1 },
          { question: "یسوع مسیح نے اپنے شاگردوں کو کیا حکم دیا؟", options: ["جنگ کرو", "پوری دنیا میں انجیل پھیلاؤ", "پیسے جمع کرو", "صرف یہودیوں میں رہو"], correctAnswer: 1 },
          { question: "یسوع مسیح نے موت پر کیسے فتح پائی؟", options: ["تیسرے دن جی اٹھنے سے", "صلیب پر جان دے کر", "معجزات دکھا کر", "فرشتوں کی مدد سے"], correctAnswer: 0 },
        ],
      },
    ],
  },
];

export async function POST() {
  const session = await checkAdmin();
  if (!session) return unauthorized();

  const existing = await prisma.course.count();
  if (existing > 0) {
    return NextResponse.json({ error: "Courses already exist. Delete them first if you want to re-seed." }, { status: 400 });
  }

  const adminId = (session.user as any).id;

  for (const courseData of defaultCourses) {
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        image: courseData.image,
        category: courseData.category,
        createdById: adminId,
      },
    });

    for (let li = 0; li < courseData.lessons.length; li++) {
      const lessonData = courseData.lessons[li];
      const lesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          order: li,
          courseId: course.id,
        },
      });

      const questions = (lessonData as any).questions || [];
      for (let qi = 0; qi < questions.length; qi++) {
        const q = questions[qi];
        await prisma.quizQuestion.create({
          data: {
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            order: qi,
            lessonId: lesson.id,
          },
        });
      }
    }
  }

  return NextResponse.json({ success: true, message: "Default courses seeded!" });
}
