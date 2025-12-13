import React from "react";
import Image from "next/image";

interface ImageUploadBoxProps {
  side: "left" | "right";
  label: string;
  image: string | null;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => void;
  onRemove: (side: "left" | "right") => void;
}

export default function ImageUploadBox({
  side,
  label,
  image,
  onUpload,
  onRemove,
}: ImageUploadBoxProps) {
  return (
    <div className="col-span-1">
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        {label}
      </label>

      <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer group flex items-center justify-center h-40 overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e, side)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        />

        {image ? (
          <>
            {/* Image preview */}
            <Image
              src={image}
              alt={`${label} preview`}
              fill
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white font-medium">
                Change Image
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(side);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80 transition z-20 cursor-pointer"
            >
              ×
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Click or paste
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
