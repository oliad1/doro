'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Zap, Calendar, BarChart3, BookOpen } from 'lucide-react'

const quotes = [
  "This is, by far, the best grade tracker for Waterloo students I've ever used. - Oliad R",
  "Wait, when's that due?' to 'Done and dusted!' Doro.study keeps you ahead of the curve.",
  "If you deployed that right now I would use it ASAP - Matias",
  "Knowledge is power. Information is liberating. Education is the premise of progress. -O.Choy",
  "Assignment tracking has never been so easy! - UWaterloo student"
]

const carouselImages = [
  { src: "/homeImages/mika-baumeister-Wpnoqo2plFA-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/stephen-dawson-qwtCeJ5cLYs-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/isaac-smith-AT77Q0Njnt0-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/priscilla-du-preez-sUF720MPYZI-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/luke-chesser-JKUTrJ4vK00-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/Screenshot 2025-01-12 004447.png", width: 1920, height: 1080 }
]

export default function Page() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  }, [])

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)

    const imageTimer = setInterval(nextImage, 3000)

    return () => {
      clearInterval(quoteTimer)
      clearInterval(imageTimer)
    }
  }, [nextImage])

  return (
    <div className="flex flex-col md:flex-row grid-cols-2 md:grid-cols-1 h-screen bg-background text-foreground">
      {/* Left side with carousel */}
      <div className="w-full h-full col-span-1 relative overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={`Carousel image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight">
            Tracker For The Next Generation of Students
          </h1>
        </div>
      </div>

      {/* Right side with features, animated quote and button */}
      <div className="w-full h-full flex flex-col justify-between col-span-1 items-center p-8">
        {/* Features Section */}
        <h2 className="w-full text-3xl font-bold text-center mb-8 uppercase">DORO.STUDY</h2>
        <div className="w-full">
          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start">
              <Zap className="w-8 h-8 mr-4 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
                <p>Get started in minutes with our intuitive interface.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-8 h-8 mr-4 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
                <p>Never miss a deadline with our intelligent reminders.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BarChart3 className="w-8 h-8 mr-4 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p>Visualize your academic journey with detailed analytics.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BookOpen className="w-8 h-8 mr-4 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Course Management</h3>
                <p>Organize all your courses and assignments in one place.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[100px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              className="text-xl md:text-sm text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {quotes[currentQuote]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8">
              Start Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

