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
     <Navbar/>
     <div className="  h-full  overflow-y-auto">


 
     <Footer/>
     </div>
    </div>
  );
}
