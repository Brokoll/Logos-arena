"use client";

import { useState } from "react";

interface ActionButtonsProps {
    isOwner: boolean;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => Promise<void>;
    isDeleting?: boolean;
}

export function ActionButtons({ isOwner, isAdmin, onEdit, onDelete, isDeleting = false }: ActionButtonsProps) {
    // Show buttons if user is owner OR admin (admins can moderate anything)
    if (!isOwner && !isAdmin) return null;

    return (
        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <button
                onClick={onEdit}
                disabled={isDeleting}
                className="text-[10px] font-bold uppercase tracking-widest hover:underline hover:text-blue-500"
            >
                Edit
            </button>
            <span className="text-[10px] opacity-30">|</span>
            <button
                onClick={async () => {
                    if (confirm("정말 삭제하시겠습니까? Delete cannot be undone.")) {
                        await onDelete();
                    }
                }}
                disabled={isDeleting}
                className="text-[10px] font-bold uppercase tracking-widest hover:underline hover:text-red-500"
            >
                {isDeleting ? "..." : "Delete"}
            </button>
        </div>
    );
}

// Edit/Save/Cancel controls for Editing Mode
interface EditControlsProps {
    onSave: () => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export function EditControls({ onSave, onCancel, isSaving }: EditControlsProps) {
    return (
        <div className="flex items-center gap-2 mt-2 justify-end">
            <button
                onClick={onCancel}
                disabled={isSaving}
                className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100"
            >
                Cancel
            </button>
            <button
                onClick={onSave}
                disabled={isSaving}
                className="px-3 py-1 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-80 disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
