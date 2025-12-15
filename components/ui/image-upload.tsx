"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, FileImage } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  // value: undefined => keep existing, null => explicitly removed, File => new upload
  value?: File | null | undefined;
  onChange: (file: File | null | undefined) => void;
  existingImageUrl?: string | null;
  maxSize?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value = undefined,
  onChange,
  existingImageUrl = null,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>("");

  // When value changes to a File, create preview URL
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // Clear preview if not a File
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Derived flags
  const hasNewFile = value instanceof File;
  const hasRemovedFile = value === null;
  const hasNoChange = value === undefined && !!existingImageUrl; // leave existing
  const showExistingImage = hasNoChange && existingImageUrl;
  const showNewFile = hasNewFile && !!preview;
  // const showPlaceholder = hasRemovedFile || (!existingImageUrl && !hasNewFile);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file); // File -> new upload
        // preview will be created by effect above when `value` is File.
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const removeFile = () => {
    // Explicit removal: set to null
    onChange(null);
  };

  // Image src determination
  const imageSrc = showNewFile
    ? preview
    : showExistingImage
      ? (existingImageUrl ?? "")
      : "";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex-shrink-0">
          {showNewFile ? (
            <div className="relative">
              <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={imageSrc}
                  width={64}
                  height={64}
                  alt="New upload"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", imageSrc);
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded text-[10px]">
                New
              </div>
            </div>
          ) : showExistingImage ? (
            <div className="relative">
              <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={imageSrc}
                  alt="Current product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", imageSrc);
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-gray-600 text-white text-xs px-1 rounded text-[10px]">
                Current
              </div>
            </div>
          ) : (
            <div
              className={`w-16 h-16 rounded border-2 border-dashed flex items-center justify-center ${
                hasRemovedFile
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              {hasRemovedFile ? (
                <X className="h-6 w-6 text-red-400" />
              ) : (
                <FileImage className="h-6 w-6 text-gray-400" />
              )}
            </div>
          )}
        </div>

        <div {...getRootProps()} className="flex-1">
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className="h-8"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {hasRemovedFile
                  ? "Add image"
                  : showExistingImage
                    ? "Replace Image"
                    : "Choose Image"}
              </Button>

              {hasNewFile && (
                <span className="text-sm text-gray-600 truncate flex-1">
                  {(value as File).name}
                </span>
              )}
              {hasRemovedFile && (
                <span className="text-sm text-blue-600 truncate flex-1">
                  Image removed
                </span>
              )}
              {showExistingImage && (
                <span className="text-sm text-gray-500 truncate flex-1">
                  Current image
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {hasRemovedFile
                ? "Image will be removed. Click to add a new image."
                : showExistingImage
                  ? "Click or drag to replace current image"
                  : hasNewFile
                    ? "Click or drag to replace"
                    : "Click or drag to upload"}
            </p>
          </div>
        </div>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-400 flex items-center justify-center z-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border">
            <Upload className="h-10 w-10 text-blue-500 mx-auto mb-3" />
            <p className="font-medium text-blue-900">
              {showExistingImage
                ? "Drop image to replace"
                : "Drop image to upload"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
