"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { bibleBasicsCourse } from "@/data/courseData";

export default function CoursePage() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [view, setView] = useState<"reading" | "quiz" | "certificate">("reading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const lesson = bibleBasicsCourse[currentLessonIndex];
  const totalLessons = bibleBasicsCourse.length;
  const question = lesson?.questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setView("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      if (currentLessonIndex < totalLessons - 1) {
        setCurrentLessonIndex(i => i + 1);
        setView("reading");
      } else {
        setView("certificate");
      }
    }
  };

  if (view === "certificate") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white text-black max-w-4xl w-full p-12 rounded-lg relative overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.3)] text-center border-[12px] border-double border-gray-300"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 z-0"></div>
          <div className="relative z-10 space-y-8">
            <Award className="w-24 h-24 mx-auto text-btl-red" />
            <h1 className="text-5xl font-bold font-urdu text-btl-red mb-2">سرٹیفکیٹ آف تکمیل</h1>
            <h2 className="text-2xl font-urdu text-gray-700">بائبل سکول - BTL TV</h2>
            <p className="text-xl font-urdu text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
              یہ تصدیق کی جاتی ہے کہ آپ نے کامیابی کے ساتھ <strong>بنیادی تعلیمات کورس</strong> مکمل کر لیا ہے اور بائبل مقدس کی گہری سمجھ بوجھ حاصل کی ہے۔
            </p>
            <div className="mt-12 flex justify-center gap-16 border-t border-gray-300 pt-8">
              <div>
                <p className="font-bold border-b border-black w-48 mx-auto mb-2"></p>
                <p className="font-urdu text-gray-500">تاریخ</p>
              </div>
              <div>
                <p className="font-bold border-b border-black w-48 mx-auto mb-2 font-urdu text-btl-red italic text-xl">BTL TV Director</p>
                <p className="font-urdu text-gray-500">دستخط</p>
              </div>
            </div>
            <Link href="/bible-school" className="inline-block mt-8">
              <Button className="bg-btl-red hover:bg-btl-red-dark text-white font-urdu text-lg px-8">
                واپس جائیں
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="relative h-[30vh] flex items-end pb-8 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop"
            alt="Course Header"
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <Link href="/bible-school" className="absolute top-6 left-6 z-20">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
        </Link>

        <div className="relative z-10 px-4 md:px-12 max-w-4xl mx-auto w-full text-right">
          <span className="text-btl-red font-urdu font-bold text-lg mb-2 block tracking-wider">
            سبق {currentLessonIndex + 1} از {totalLessons}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-urdu text-white drop-shadow-lg">
            {lesson.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-12 mt-12">
        <AnimatePresence mode="wait">
          {view === "reading" ? (
            <motion.div
              key="reading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-btl-card p-8 md:p-12 rounded-2xl border border-btl-card-border"
            >
              <div className="flex items-center justify-end gap-3 mb-8 border-b border-white/10 pb-6">
                <h2 className="text-2xl font-bold font-urdu">مطالعہ</h2>
                <BookOpen className="h-6 w-6 text-btl-red" />
              </div>
              <p className="font-urdu text-xl text-gray-300 leading-[2.5] text-right mb-12">
                {lesson.content}
              </p>
              <Button 
                onClick={handleStartQuiz}
                className="w-full h-14 bg-btl-red hover:bg-btl-red-dark text-white font-urdu text-xl rounded-xl transition-all"
              >
                سوالات شروع کریں (Quiz)
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-btl-card p-8 md:p-12 rounded-2xl border border-btl-card-border"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <span className="text-gray-400 font-urdu text-lg">
                  سوال {currentQuestionIndex + 1} از {lesson.questions.length}
                </span>
                <h2 className="text-2xl font-bold font-urdu text-btl-red">کوئز</h2>
              </div>

              <h3 className="text-2xl font-bold font-urdu text-white text-right mb-8 leading-relaxed">
                {question.text}
              </h3>

              <div className="space-y-4">
                {question.options.map((opt, idx) => {
                  let buttonStyle = "bg-white/5 border-white/10 hover:bg-white/10";
                  let Icon = null;

                  if (showFeedback) {
                    if (idx === question.correctAnswerIndex) {
                      buttonStyle = "bg-green-500/20 border-green-500 text-green-400";
                      Icon = <CheckCircle className="h-5 w-5 text-green-400" />;
                    } else if (idx === selectedAnswer) {
                      buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                      Icon = <XCircle className="h-5 w-5 text-red-400" />;
                    } else {
                      buttonStyle = "bg-white/5 border-white/10 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showFeedback}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full text-right p-5 rounded-xl border-2 transition-all flex items-center justify-between font-urdu text-xl ${buttonStyle}`}
                    >
                      <div>{Icon}</div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 text-right"
                >
                  <p className="font-urdu text-lg text-gray-300 leading-relaxed mb-6">
                    <strong className="text-btl-red">وضاحت: </strong> 
                    {question.explanation}
                  </p>
                  <Button 
                    onClick={handleNextQuestion}
                    className="w-full h-12 bg-btl-red hover:bg-btl-red-dark text-white font-urdu text-lg"
                  >
                    اگلا قدم
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
