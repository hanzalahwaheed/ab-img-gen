import React from "react";

interface FontSelectorProps {
  labelFont: string;
  setLabelFont: (font: string) => void;
}

export default function FontSelector({
  labelFont,
  setLabelFont,
}: FontSelectorProps) {
  const fontOptions = [
    "Inter",
    "System UI",
    "SF Pro Display",
    "Helvetica Neue",
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Monaco",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        Label Font
      </label>
      <select
        value={labelFont}
        onChange={(e) => setLabelFont(e.target.value)}
        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 transition"
      >
        {fontOptions.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
