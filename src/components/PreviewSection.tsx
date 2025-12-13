import React from "react";

interface PreviewSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  borderRadius: number;
  leftImage: string | null;
  rightImage: string | null;
}

export default function PreviewSection({
  canvasRef,
  borderRadius,
  leftImage,
  rightImage,
}: PreviewSectionProps) {
  return (
    <div className="col-span-1 md:col-span-3">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors">
        <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
          Preview
        </h2>
        <div className="w-full bg-neutral-100 dark:bg-neutral-900/50 rounded-xl flex items-center justify-center p-8 min-h-[400px] transition-colors">
          <div
            className="relative"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto shadow-2xl"
              style={{ borderRadius: `${borderRadius}px` }}
            />
            {!leftImage || !rightImage ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">
                    Upload both images to see a preview
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
