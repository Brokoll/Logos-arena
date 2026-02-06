"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
    "세상을 바꾸는 논쟁에 참여하세요. 당신의 논리가 유일한 무기입니다.",
    "당신의 근거는 객관적인가요? 👓",
    "당신의 주장을 논리적으로 설명할 수 있나요? 📏",
    "당신의 근거를 AI한테 찾게 하지 마세요!!! 다 보입니다 👁️",
];

export function RotatingText() {
    const [index, setIndex] = useState(0);
    const [animationStage, setAnimationStage] = useState<'idle' | 'exiting' | 'entering'>('idle');

    useEffect(() => {
        const interval = setInterval(() => {
            // Phase 1: Exit Up
            setAnimationStage('exiting');

            setTimeout(() => {
                // Phase 2: Teleport to Bottom & Change Text (Invisible)
                setIndex((prev) => (prev + 1) % MESSAGES.length);
                setAnimationStage('entering');

                // Phase 3: Enter Up (Visible)
                // Small delay to ensure DOM updated with 'entering' class first
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setAnimationStage('idle');
                    });
                });
            }, 600); // Match exit duration
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Animation Classes
    const getClasses = () => {
        const base = "text-xl md:text-2xl font-medium max-w-2xl mx-auto transition-all ease-in-out transform";
        switch (animationStage) {
            case 'idle':
                return `${base} opacity-50 translate-y-0 duration-700`; // Resting state
            case 'exiting':
                return `${base} opacity-0 -translate-y-8 duration-500`; // Slide Up & Fade Out
            case 'entering':
                return `${base} opacity-0 translate-y-8 duration-0`; // Teleport to Bottom (Instant)
        }
    };

    return (
        <div className="h-16 flex items-center justify-center overflow-hidden">
            <p className={getClasses()}>
                {MESSAGES[index]}
            </p>
        </div>
    );
}
