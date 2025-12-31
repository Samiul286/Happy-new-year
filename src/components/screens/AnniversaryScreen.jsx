"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ScreenContainer from "../ScreenContainer"
import { NAME, specialDate } from "@/data"

export default function AnniversaryScreen({ onNext }) {
    const [displayedDays, setDisplayedDays] = useState(0)
    const [actualDays, setActualDays] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const anniversaryDate = new Date(specialDate)
    useEffect(() => {
        // Calculate actual days since anniversary
        const today = new Date()
        const timeDiff = today.getTime() - anniversaryDate.getTime()
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
        setActualDays(daysDiff)

        setIsAnimating(true)

        const animationDuration = 3000
        const frameRate = 60
        const totalFrames = (animationDuration / 1000) * frameRate

        let currentFrame = 0

        const animate = () => {
            currentFrame++
            const progress = currentFrame / totalFrames
            const easeOutProgress = 1 - Math.pow(1 - progress, 3)
            const newValue = Math.floor(easeOutProgress * daysDiff)

            setDisplayedDays(newValue)

            if (currentFrame < totalFrames && newValue < daysDiff) {
                requestAnimationFrame(animate)
            } else {
                setDisplayedDays(daysDiff)
                setIsAnimating(false)
            }
        }

        const startTimer = setTimeout(() => {
            requestAnimationFrame(animate)
        }, 1000)

        return () => {
            clearTimeout(startTimer)
        }
    }, [])

    return (
        <ScreenContainer>
            <div className="text-center max-w-3xl mx-auto">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="w-36 h-36 md:w-40 md:h-40 mx-auto bg-pink-500/10 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-pink-400/30 overflow-hidden">
                        <img
                            src="/gifs/anniversary.gif"
                            alt="img"
                            className="w-28 md:w-32 object-cover rounded-full"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-pink-400 mb-8 text-balance leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Happy New Year{" "}
                    <motion.span
                        className="text-purple-400"
                        animate={{
                            textShadow: [
                                "0 0 10px rgba(168, 85, 247, 0.4)",
                                "0 0 20px rgba(168, 85, 247, 0.6)",
                                "0 0 10px rgba(168, 85, 247, 0.4)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                        {NAME}
                    </motion.span>
                </motion.h1>

                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className="text-xl md:text-2xl text-pink-200 mb-6 text-pretty">
                        We've been together for
                    </p>

                    <motion.div
                        className="relative inline-block"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    >
                        <motion.div
                            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
                            animate={{
                                scale: !isAnimating && displayedDays === actualDays ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: !isAnimating && displayedDays === actualDays ? Number.POSITIVE_INFINITY : 0,
                                repeatDelay: 2,
                            }}
                        >
                            {displayedDays}
                        </motion.div>

                        {!isAnimating && displayedDays === actualDays && (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute text-pink-400 text-xl"
                                        style={{
                                            left: `${40 + Math.cos((i * Math.PI) / 3) * 60}%`,
                                            top: `${30 + Math.sin((i * Math.PI) / 3) * 60}%`,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: i * 0.3,
                                        }}
                                    >
                                        ✨
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </motion.div>

                    <p className="text-xl md:text-2xl text-pink-200 mt-6 text-pretty">days and counting...</p>
                </motion.div>

                <motion.button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Continue Our Story 💫</span>
                </motion.button>
            </div>
        </ScreenContainer>
    )
}
