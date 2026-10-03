'use client';

import * as React from 'react';
import Image from 'next/image';
import { UploadCloud, X, ArrowLeft, ArrowRight, Loader2, Video, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MediaUploaderProps {
  value: string | string[];
  onChange: (urls: string[] | string) => void;
  maxFiles?: number;
  resourceType?: 'image' | 'video';
  folder?: string;
  label?: string;
  className?: string;
}

export function MediaUploader({
  value,
  onChange,
  maxFiles = 5,
  resourceType = 'image',
  folder = 'flourish-woman',
  label,
  className,
}: MediaUploaderProps) {
  const isMultiple = Array.isArray(value);
  const fileList: string[] = isMultiple ? value : value ? [value] : [];

  const [isUploading, setIsUploading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage(null);

    // 1. Max Files Check
    if (isMultiple && fileList.length + files.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} ${resourceType}s.`);
      return;
    }

    setIsUploading(true);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 2. Client-side Video Size Validation (Strict 3 MB limit)
      if (resourceType === 'video' || file.type.startsWith('video/')) {
        if (file.size > 3 * 1024 * 1024) {
          setErrorMessage(`Video "${file.name}" exceeds 3 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please compress your reel.`);
          setIsUploading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('resourceType', resourceType);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Upload failed');
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error uploading file.');
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);

    if (isMultiple) {
      const updated = [...fileList, ...uploadedUrls].slice(0, maxFiles);
      onChange(updated);
    } else if (uploadedUrls.length > 0) {
      onChange(uploadedUrls[0]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    if (isMultiple) {
      const updated = fileList.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (!isMultiple) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fileList.length) return;

    const updated = [...fileList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const canUploadMore = isMultiple ? fileList.length < maxFiles : fileList.length === 0;

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            {label}
          </label>
          <span className="text-[11px] text-[#64748B]">
            {resourceType === 'video'
              ? 'Max 3 MB (MP4/WebM)'
              : `${fileList.length}/${maxFiles} photos (Max 5)`}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Media Grid / Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fileList.map((url, idx) => (
          <div
            key={url + idx}
            className="group relative aspect-[3/4] bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs"
          >
            {resourceType === 'video' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#071324] text-white text-center">
                <Video className="w-8 h-8 text-[#38BDF8] mb-1" />
                <span className="text-[10px] truncate max-w-full font-mono">Video Ready</span>
              </div>
            ) : (
              <Image
                src={url}
                alt={`Media ${idx + 1}`}
                fill
                sizes="150px"
                className="object-cover object-top"
              />
            )}

            {/* Primary badge for first image */}
            {idx === 0 && isMultiple && (
              <span className="absolute top-2 left-2 bg-[#0F172A] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm z-10">
                Primary Cover
              </span>
            )}

            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 shadow-sm cursor-pointer hover:bg-rose-700"
              title="Remove media"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Reorder controls for multiple images */}
            {isMultiple && fileList.length > 1 && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 bg-black/75 backdrop-blur-xs p-1 rounded-lg">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'left')}
                  className="text-white hover:text-[#38BDF8] disabled:opacity-30 disabled:pointer-events-none p-0.5 cursor-pointer"
                  title="Move left"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-white font-mono font-medium">{idx + 1}</span>
                <button
                  type="button"
                  disabled={idx === fileList.length - 1}
                  onClick={() => handleMove(idx, 'right')}
                  className="text-white hover:text-[#38BDF8] disabled:opacity-30 disabled:pointer-events-none p-0.5 cursor-pointer"
                  title="Move right"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Upload Trigger Area */}
        {canUploadMore && (
          <label
            className={cn(
              'aspect-[3/4] border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-[#F8FAFC] hover:bg-[#F0F9FF] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group',
              isUploading && 'opacity-50 pointer-events-none'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={resourceType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/avif'}
              multiple={isMultiple && fileList.length < maxFiles}
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 h-6 text-[#0284C7] animate-spin mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#0F172A] font-semibold leading-tight">
                  Upload {resourceType === 'video' ? 'Reel' : 'Photo'}
                </span>
                <span className="text-[10px] text-[#64748B] mt-1 font-light">
                  {resourceType === 'video' ? 'Max 3 MB' : 'Max 5 photos'}
                </span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
