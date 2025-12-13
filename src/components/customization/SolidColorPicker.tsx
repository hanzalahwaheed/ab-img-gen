import React from "react";

interface SolidColorPickerProps {
  solidColor: string;
  setSolidColor: (color: string) => void;
}

export default function SolidColorPicker({
  solidColor,
  setSolidColor,
}: SolidColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        Background Color
      </label>
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10">
          <input
            type="color"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-700"
            style={{ backgroundColor: solidColor }}
          />
        </div>
        <input
          type="text"
          value={solidColor}
          onChange={(e) => setSolidColor(e.target.value)}
          className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="#f8fafc"
        />
      </div>
    </div>
  );
}
