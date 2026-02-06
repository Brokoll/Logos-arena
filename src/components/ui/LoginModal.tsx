"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LoginModal({ isOpen, onClose, onConfirm }: LoginModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border-[3px] border-foreground p-8 max-w-sm w-full space-y-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-[900] uppercase tracking-tighter text-center">
                    🔒 Login Required
                </h3>
                <p className="text-center font-medium opacity-80 leading-relaxed">
                    로그인이 필요한 서비스입니다.<br />
                    로그인 페이지로 이동하시겠습니까?
                </p>
                <div className="flex gap-4 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-foreground text-background border-2 border-foreground hover:opacity-80 transition-opacity"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
