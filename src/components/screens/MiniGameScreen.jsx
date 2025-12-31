"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ScreenContainer from "../ScreenContainer"
import confetti from "canvas-confetti"
import { NAME } from "@/data"

export default function MiniGameScreen({ onComplete }) {
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(15)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [hearts, setHearts] = useState([])
    const gameAreaRef = useRef(null)
    const heartIdRef = useRef(0)

    const targetScore = 8

    useEffect(() => {
        if (!gameStarted || gameWon) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setGameStarted(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameStarted, gameWon])

    useEffect(() => {
        if (!gameStarted || gameWon) return

        const spawnHeart = () => {
            if (!gameAreaRef.current) return

            const gameArea = gameAreaRef.current.getBoundingClientRect()
            const heartSize = 60
            const padding = 20
            const maxX = gameArea.width - heartSize - padding
            const maxY = gameArea.height - heartSize - padding

            const newHeart = {
                id: heartIdRef.current++,
                x: padding + Math.random() * maxX,
                y: padding + Math.random() * maxY,
                scale: 1,
            }

            setHearts((prev) => [...prev, newHeart])

            setTimeout(() => {
                setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
            }, 4000)
        }

        const spawnInterval = setInterval(spawnHeart, 1200)
        return () => clearInterval(spawnInterval)
    }, [gameStarted, gameWon])

    useEffect(() => {
        if (score >= targetScore) {
            const colors = ["#ff4d6d", "#ff80b5", "#c77dff", "#9d4edd", "#6a00f4"];
            
            const count = 200;
            const defaults = { origin: { y: 0.8 }, colors };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio),
                });
            }

            fire(0.25, { spread: 26, startVelocity: 60, scalar: 1.1 });
            fire(0.2, { spread: 60, scalar: 0.9 });
            fire(0.35, { spread: 100, decay: 0.92, scalar: 1 });
            fire(0.1, { spread: 120, startVelocity: 30, decay: 0.93, scalar: 1.3 });
            fire(0.1, { spread: 140, startVelocity: 50, scalar: 1.2 });

            setGameWon(true)
            setGameStarted(false)

        }
    }, [score])

    const handleHeartClick = (heartId) => {
        setHearts((prev) => prev.filter((heart) => heart.id !== heartId))
        setScore((prev) => prev + 1)
    }

    const startGame = () => {
        setGameStarted(true)
        setScore(0)
        setTimeLeft(15)
        setGameWon(false)
        setHearts([])
    }

    const resetGame = () => {
        setGameStarted(false)
        setScore(0)
        setTimeLeft(15)
        setGameWon(false)
        setHearts([])
    }

    return (
        <ScreenContainer>
            <div className="text-center max-w-xl mx-auto w-full">
                <motion.div layout>
                    <motion.h1

                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Catch the Hearts
                    </motion.h1>

                    <motion.p

                        className="text-lg text-pink-200/90 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Tap {targetScore} little hearts to unlock our next memory ❤️
                    </motion.p>
                </motion.div>

                {!gameStarted && !gameWon && (
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Start Game
                        </button>
                    </motion.div>
                )}

                {gameStarted && (
                    <motion.div className="mb-4 flex justify-center gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-pink-300">
                            Hearts:{" "}
                            <span className="text-pink-400 font-bold text-xl">
                                {score}/{targetScore}
                            </span>
                        </div>
                        <div className="text-purple-300">
                            Time: <span className="text-purple-400 font-bold text-xl">{timeLeft}s</span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    layout
                    ref={gameAreaRef}
                    className="relative w-full h-80 md:h-96 bg-gradient-to-br from-black/30 to-indigo-900/20 backdrop-blur-2xl rounded-2xl border-2 border-pink-400/30 overflow-hidden mb-6 touch-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    {gameStarted && (
                        <>
                            {hearts.map((heart) => (
                                <motion.button
                                    key={heart.id}
                                    className="absolute text-pink-400 hover:text-pink-300 transition-colors duration-200 cursor-pointer select-none touch-manipulation"
                                    style={{
                                        left: heart.x,
                                        top: heart.y,
                                        fontSize: "3rem",
                                        width: "60px",
                                        height: "60px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => handleHeartClick(heart.id)}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    ♥
                                </motion.button>
                            ))}
                        </>
                    )}

                    {!gameStarted && !gameWon && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-pink-300/60 text-lg">Ready to catch some hearts?</p>
                        </div>
                    )}

                    {timeLeft === 0 && score < targetScore && (
                        <motion.div
                            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-pink-400 text-2xl font-bold mb-4">Time's Up!</p>
                            <p className="text-pink-200 mb-4">You caught {score} hearts</p>
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-200"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {gameWon && (
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <motion.h2
                            className="text-3xl font-bold text-pink-400 mb-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: 3 }}
                        >
                            Perfect!
                        </motion.h2>
                        <p className="text-pink-200 mb-6">Yayyy! You caught them all, {NAME} ❤️</p>
                        <button
                            onClick={onComplete}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Continue to Gallery 📸
                        </button>
                    </motion.div>
                )}
            </div>
        </ScreenContainer>
    )
}
