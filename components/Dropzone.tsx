'use client';

import { useCallback, useRef, useState } from 'react';

interface DropzoneProps {
  previewSrc: string | null;
  onFileSelect: (dataUrl: string) => void;
}

export function Dropzone({ previewSrc, onFileSelect }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const readFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') onFileSelect(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [onFileSelect],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        readFile(e.dataTransfer.files[0]);
      }}
      className={`relative flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:aspect-[21/9] ${
        isDragOver ? 'border-optical bg-optical-dim/30' : 'border-border bg-surface hover:border-text-muted'
      }`}
      aria-label="Upload a query image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => readFile(e.target.files?.[0])}
      />

      {previewSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="Query image preview" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-4 py-3 text-xs text-text-muted">
            Click or drop to replace
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M10 13V4M10 4L6.5 7.5M10 4l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-sm font-medium text-text-primary">Drag and drop a query image</p>
          <p className="text-xs text-text-muted">or click to browse — used only for this preview, never uploaded</p>
        </div>
      )}
    </div>
  );
}
