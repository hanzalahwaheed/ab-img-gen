import React from "react";
import ImageUploadBox from "./ImageUploadBox";

interface ImageUploadSectionProps {
  leftImage: string | null;
  rightImage: string | null;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => void;
  onRemove: (side: "left" | "right") => void;
}

export default function ImageUploadSection({
  leftImage,
  rightImage,
  onUpload,
  onRemove,
}: ImageUploadSectionProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
        Upload Images
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 -mt-2">
        Click each box to upload, or simply paste an image from your clipboard.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <ImageUploadBox
          side="left"
          label="Version A"
          image={leftImage}
          onUpload={onUpload}
          onRemove={onRemove}
        />
        <ImageUploadBox
          side="right"
          label="Version B"
          image={rightImage}
          onUpload={onUpload}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
