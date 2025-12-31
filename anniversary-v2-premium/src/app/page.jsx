"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import AnniversaryScreen from "@/components/screens/AnniversaryScreen"
import MiniGameScreen from "@/components/screens/MiniGameScreen"
import PhotoGalleryScreen from "@/components/screens/PhotoGalleryScreen"
import MessageScreen from "@/components/screens/MessageScreen"
import BackgroundMusic from "@/components/BackgroundMusic"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function AnniversaryApp() {
  const [currentScreen, setCurrentScreen] = useState("loader")
  const [musicStarted, setMusicStarted] = useState(false)

  const goToIntro = () => setCurrentScreen("intro")
  const goToAnniversary = () => setCurrentScreen("anniversary")
  const goToGame = () => setCurrentScreen("game")
  const goToGallery = () => setCurrentScreen("gallery")
  const goToMessage = () => setCurrentScreen("message")

  const startMusic = () => {
    setMusicStarted(true)
    goToAnniversary()
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950 overflow-hidden">

      {/* Wave background */}
      <div className="fixed inset-0 bg-[repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.03)_0,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px)]" />

      <BackgroundEffects />

      <BackgroundMusic shouldPlay={musicStarted} />

      <AnimatePresence mode="wait">
        {currentScreen === "loader" && <LoaderScreen key="loader" onComplete={goToIntro} />}
        {currentScreen === "intro" && <IntroScreen key="intro" onStartMusic={startMusic} />}
        {currentScreen === "anniversary" && <AnniversaryScreen key={Date.now()} onNext={goToGame} />}
        {currentScreen === "game" && <MiniGameScreen key="game" onComplete={goToGallery} />}
        {currentScreen === "gallery" && <PhotoGalleryScreen key="gallery" onNext={goToMessage} />}
        {currentScreen === "message" && <MessageScreen key="message" />}
      </AnimatePresence>

      {/* Watermark */}
      {/* <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light">
        @It'z Sami
      </motion.div> */}
    </div>
  )
}
