"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
    "당신의 생각이 논리가 되는 곳입니다.",
    "세상을 설득하는 힘, 당신에게 있습니다.",
    "침묵 대신, 논리로 말합니다.",
    "당신의 통찰이 승패를 가릅니다.",
    "오직 논리로만 증명합니다.",
    "지성은 드러낼 때 더욱 빛납니다.",
    "이성적인 대화가 가장 날카로운 무기입니다.",
    "당신의 목소리에는 무게가 있습니다.",
    "진정한 논쟁은 소음이 아닌 울림을 남깁니다.",
    "생각의 깊이가 다르다는 것을 보여줍니다."
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
