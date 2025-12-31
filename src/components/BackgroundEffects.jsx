"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function BackgroundEffects() {
    const [stars, setStars] = useState([])
    const [shootingStars, setShootingStars] = useState([])

    useEffect(() => {
        // Twinkling stars
        const newStars = []
        for (let i = 0; i < 25; i++) {
            newStars.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 3,
                size: Math.random() * 2 + 1,
            })
        }
        setStars(newStars)

        const interval = setInterval(() => {
            setShootingStars((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    x: Math.random() * (-50), // start x
                    y: Math.random() * (-20), // start y
                },
            ])

            setTimeout(() => {
                setShootingStars((prev) =>
                    prev.filter((s) => Date.now() - s.id < 3000)
                )
            }, 5000)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Twinkling Stars */}
            {stars.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: 0.3,
                    }}
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Shooting Stars with Trail */}
            {shootingStars.map((star) => (
                <motion.div
                    key={`shooting-${star.id}`}
                    className="absolute"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{
                        x: 1100,
                        y: 1200,
                        opacity: 0,
                        scale: 0.8,
                    }}
                    transition={{ duration: 6, ease: "easeOut" }}
                >
                    {/* Head of shooting star */}
                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_1px_rgba(255,255,255,0.8)]" />

                    {/* Trail */}
                    <div
                        className="absolute -left-13 -top-5 w-16 h-[2px] bg-gradient-to-l from-white/70 to-transparent"
                        style={{ transform: "rotate(45deg)" }}
                    />
                </motion.div>
            ))}
        </div>
    )
}
