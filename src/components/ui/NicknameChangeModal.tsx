"use client";

import { useState } from "react";
import { updateUsername } from "@/app/actions";

interface NicknameChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
}

export function NicknameChangeModal({ isOpen, onClose, currentUsername }: NicknameChangeModalProps) {
    const [newUsername, setNewUsername] = useState(currentUsername || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim()) return;
        if (newUsername === currentUsername) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateUsername(newUsername);
            if (result.success) {
                alert("닉네임이 변경되었습니다.");
                window.location.reload(); // Refresh to show new name
            } else {
                alert(`변경 실패: ${result.error}`);
            }
        } catch (error: any) {
            alert(`오류 발생: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
            <div className="bg-background border-[3px] border-foreground p-6 w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase tracking-tighter">⚙️ Change Codename</h2>
                    <button onClick={onClose} className="text-2xl hover:opacity-50">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-60">New User ID</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full p-2 bg-transparent border-2 border-foreground text-lg font-bold focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            placeholder="Enter new nickname"
                            maxLength={15}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-black uppercase border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-black uppercase bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? "Updating..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
