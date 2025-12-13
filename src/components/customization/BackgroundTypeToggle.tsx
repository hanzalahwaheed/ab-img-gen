import React from "react";

interface BackgroundTypeToggleProps {
  backgroundType: "solid" | "gradient";
  setBackgroundType: (type: "solid" | "gradient") => void;
}

export default function BackgroundTypeToggle({
  backgroundType,
  setBackgroundType,
}: BackgroundTypeToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        Background Type
      </label>
      <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setBackgroundType("solid")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            backgroundType === "solid"
              ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Solid Color
        </button>
        <button
          type="button"
          onClick={() => setBackgroundType("gradient")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            backgroundType === "gradient"
              ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Gradient
        </button>
      </div>
    </div>
  );
}
