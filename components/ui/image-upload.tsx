'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, FileImage, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: File | null | undefined;
  onChange: (file: File | null | undefined) => void;
  existingImageUrl?: string | null;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value = undefined,
  onChange,
  existingImageUrl = null,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  description = 'Upload a high-quality image for your product',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

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
        setPreview('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Derived flags
  const hasNewFile = value instanceof File;
  const hasRemovedFile = value === null;
  const hasNoChange = value === undefined && !!existingImageUrl;
  const showExistingImage = hasNoChange && existingImageUrl;
  const showNewFile = hasNewFile && !!preview;

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        } else {
          setError(rejection.errors[0]?.message || 'Invalid file type');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
      }
    },
    [onChange, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const removeFile = () => {
    setError('');
    onChange(null);
  };

  // Image src determination
  const imageSrc = showNewFile ? preview : showExistingImage ? (existingImageUrl ?? '') : '';

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
        {/* Image Preview Area */}
        <div className="flex-shrink-0">
          {showNewFile ? (
            <div className="relative group">
              <div className="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
                <Image
                  src={imageSrc}
                  width={80}
                  height={80}
                  alt="New upload"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', imageSrc);
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-white hover:text-red-300 transition-colors p-2"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-blue-600 dark:bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                New
              </div>
            </div>
          ) : showExistingImage ? (
            <div className="relative group">
              <div className="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
                <img
                  src={imageSrc}
                  alt="Current product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', imageSrc);
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-white hover:text-red-300 transition-colors p-2"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-gray-600 dark:bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Current
              </div>
            </div>
          ) : (
            <div
              className={`w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                hasRemovedFile
                  ? ''
                  : isDragActive
                    ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              }`}
            >
              {isDragActive ? (
                <Upload className="h-8 w-8 text-blue-400 dark:text-blue-500 animate-pulse" />
              ) : (
                <FileImage className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
          )}
        </div>

        {/* Upload Controls Area */}
        <div className="flex-1 min-w-0">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  className="h-9 text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {hasRemovedFile
                    ? 'Add Image'
                    : showExistingImage
                      ? 'Replace Image'
                      : 'Upload Image'}
                </Button>

                <div className="flex-1 min-w-0">
                  {hasNewFile && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {(value as File).name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (
                        {(value as File).size / 1024 > 1024
                          ? `${((value as File).size / 1024 / 1024).toFixed(1)} MB`
                          : `${Math.round((value as File).size / 1024)} KB`}
                        )
                      </span>
                    </div>
                  )}
                  {/*{hasRemovedFile && (*/}
                  {/*  <div className="flex items-center gap-2">*/}
                  {/*    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />*/}
                  {/*    <span className="text-sm text-red-600 dark:text-red-400 truncate">*/}
                  {/*      Image will be removed*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*)}*/}
                  {showExistingImage && (
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        Current image selected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {hasRemovedFile
                    ? 'Image will be removed. Click to add a new image.'
                    : showExistingImage
                      ? 'Drag & drop or click to replace current image'
                      : hasNewFile
                        ? 'Drag & drop or click to replace uploaded image'
                        : 'Drag & drop or click to upload an image'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: PNG, JPG, JPEG, GIF, WEBP • Max size: {maxSize / 1024 / 1024}MB
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="fixed inset-0 bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm border-4 border-dashed border-blue-400 dark:border-blue-500 flex items-center justify-center z-50">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
              <Upload className="h-10 w-10 text-blue-500 dark:text-blue-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Drop your image here
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Release to upload the image</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports all common image formats
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
