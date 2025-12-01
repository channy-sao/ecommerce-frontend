"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageDialogProps {
    imageUrl: string;
    alt: string;
    children: React.ReactNode;
}

export function ImagePreviewDialog({ imageUrl, alt, children }: ImageDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Trigger */}
            <div
                onClick={() => setOpen(true)}
                className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
                {children}
            </div>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className={cn(
                        "max-w-5xl w-full border-none shadow-2xl p-0",
                        "bg-transparent dark:bg-transparent",
                        "animate-in fade-in-0 zoom-in-95",
                        "backdrop-blur-sm",
                        "[&>button]:hidden"
                    )}
                >
                    <VisuallyHidden>
                        <DialogTitle>Image Preview: {alt}</DialogTitle>
                    </VisuallyHidden>

                    {/* Image Container */}
                    <div
                        className={cn(
                            "flex items-center justify-center",
                            "p-8 md:p-12",
                            "rounded-xl",
                            "bg-white/90 dark:bg-neutral-900/90",
                            "shadow-xl border border-black/10 dark:border-white/10",
                            "animate-in fade-in-0 zoom-in-95"
                        )}
                    >
                        <Image
                            src={imageUrl}
                            alt={alt}
                            width={1600}
                            height={1200}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
