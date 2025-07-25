"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const feedbacks = [
  {
    quote: "“Feedback.ai streamlined our user research workflow. Love it!”",
    author: "– Priya D, Product Manager",
  },
  {
    quote: "“Collecting insights from beta users has never been easier.”",
    author: "– Mark L, Founder",
  },
  {
    quote: "“We made faster design decisions thanks to real-time feedback.”",
    author: "– Clara T, UX Lead",
  },
  {
    quote: "“A must-have for teams building customer-centric products.”",
    author: "– Diego M, Head of Growth",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  return (
    <div className="flex flex-col h-[100dvh] ">
      <Navbar />
      <AnimatePresence mode="popLayout">
      <motion.div className="h-full"
             initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.75 }}
      >

      <div className="  h-full  overflow-y-auto">
        <section className="w-full h-full  flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-24 bg-gradient-to-b from-white to-gray-50">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 space-y-6 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Turn Feedback into Action with{" "}
              <span className="text-indigo-600">Feedback.ai</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-md  ">
              Understand your users, iterate faster, and build better products.
              Feedback.ai gives you the tools to collect, analyze, and act on
              feedback — instantly.
            </p>
            <div className="">
              <Button className="mt-4">Start Collecting Feedback</Button>
            </div>
          </div>

          {/* Right Side - Carousel */}
          <div className="md:w-1/2 w-full max-w-lg mx-auto flex flex-col items-center">
            <Card className="shadow-xl border rounded-xl p-6 min-h-[180px] flex items-center justify-center text-center relative overflow-hidden">
              <CardContent className="w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-800 text-lg italic"
                  >
                    <p className="mb-2">{feedbacks[index].quote}</p>
                    <p className="text-sm text-gray-500">
                      {feedbacks[index].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="rounded-full px-4 py-1"
              >
                ← Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="rounded-full px-4 py-1"
              >
                Next →
              </Button>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {feedbacks.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === index ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
}
