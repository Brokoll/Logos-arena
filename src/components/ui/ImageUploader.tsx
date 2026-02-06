"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
    onImagesSelected: (urls: string[]) => void;
    className?: string;
    maxFiles?: number;
    images?: string[];
}

export function ImageUploader({ onImagesSelected, className = "", maxFiles = 5, images }: ImageUploaderProps) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Reset internal state when parent clears images (e.g. after submission)
    useEffect(() => {
        if (images && images.length === 0 && (previewUrls.length > 0 || uploadedUrls.length > 0)) {
            setPreviewUrls([]);
            setUploadedUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [images, previewUrls.length, uploadedUrls.length]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList) => {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length === 0) return;
        if (uploadedUrls.length + validFiles.length > maxFiles) {
            alert(`최대 ${maxFiles}장까지만 업로드할 수 있습니다.`);
            return;
        }

        setIsUploading(true);

        // Optimistic previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);

        const supabase = createClient();
        const newUploadedUrls: string[] = [];

        try {
            for (const file of validFiles) {
                const filename = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
                const { error } = await supabase.storage
                    .from("debate-images")
                    .upload(filename, file);

                if (error) throw error;

                const { data } = supabase.storage
                    .from("debate-images")
                    .getPublicUrl(filename);

                newUploadedUrls.push(data.publicUrl);
            }

            const updatedList = [...uploadedUrls, ...newUploadedUrls];
            setUploadedUrls(updatedList);
            onImagesSelected(updatedList);
        } catch (error) {
            console.error("Upload error:", error);
            alert("이미지 업로드에 실패했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    const removeImage = (index: number) => {
        const newPreviews = [...previewUrls];
        const newUploaded = [...uploadedUrls];

        // If we represent optimistic and uploaded in sync 1-1, we assume index matches.
        // However, uploads take time. For simplicity in this logical block, 
        // we will match index of preview.
        // Note: Real-world robustness would require ID mapping. 
        // For now, assuming standard flow.

        if (index < newUploaded.length) {
            newUploaded.splice(index, 1);
            setUploadedUrls(newUploaded);
            onImagesSelected(newUploaded);
        }

        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files.length) {
                handleUpload(e.clipboardData.files);
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [uploadedUrls]);

    return (
        <div className={`relative ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={onFileChange}
            />

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || uploadedUrls.length >= maxFiles}
                    className="flex items-center gap-1 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest disabled:opacity-20 border border-foreground/10 px-2 py-1 rounded-sm"
                >
                    <span>📷 {isUploading ? 'Uploading...' : 'Add Image'}</span>
                </button>

                {previewUrls.map((url, index) => (
                    <div key={index} className="relative inline-block w-12 h-12">
                        <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-full rounded-md border border-foreground/10 object-cover shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-foreground text-background rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold hover:opacity-80 border border-background z-10"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
