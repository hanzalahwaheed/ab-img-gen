import React from "react";

interface BorderRadiusSliderProps {
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
}

export default function BorderRadiusSlider({
  borderRadius,
  setBorderRadius,
}: BorderRadiusSliderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
        Border Radius: {borderRadius}px
      </label>
      <input
        type="range"
        min="0"
        max="50"
        value={borderRadius}
        onChange={(e) => setBorderRadius(Number(e.target.value))}
        className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-500 [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  );
}
