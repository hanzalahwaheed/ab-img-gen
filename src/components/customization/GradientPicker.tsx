import React from "react";
import { GradientStop } from "../CustomizationSection";

interface GradientPickerProps {
  gradientStops: GradientStop[];
  setGradientStops: (stops: GradientStop[]) => void;
  gradientAngle: number;
  setGradientAngle: (angle: number) => void;
}

export default function GradientPicker({
  gradientStops,
  setGradientStops,
  gradientAngle,
  setGradientAngle,
}: GradientPickerProps) {
  const generateGradientString = () => {
    const sortedStops = [...gradientStops].sort(
      (a, b) => a.position - b.position,
    );
    const gradientStopsStr = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");
    return `linear-gradient(${gradientAngle}deg, ${gradientStopsStr})`;
  };

  const addGradientStop = () => {
    const newPosition = Math.floor(Math.random() * 100);
    const newStops = [
      ...gradientStops,
      { color: "#808080", position: newPosition },
    ];
    setGradientStops(newStops);
  };

  const removeGradientStop = (index: number) => {
    if (gradientStops.length > 2) {
      const newStops = gradientStops.filter((_, i) => i !== index);
      setGradientStops(newStops);
    }
  };

  const updateGradientStop = (
    index: number,
    field: "color" | "position",
    value: string | number,
  ) => {
    const newStops = gradientStops.map((stop, i) =>
      i === index ? { ...stop, [field]: value } : stop,
    );
    setGradientStops(newStops);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Background Gradient
      </label>

      {/* Gradient Angle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 w-12">
          Angle:
        </span>
        <input
          type="range"
          min="0"
          max="360"
          value={gradientAngle}
          onChange={(e) => setGradientAngle(Number(e.target.value))}
          className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400 w-10 text-right">
          {gradientAngle}°
        </span>
      </div>

      {/* Gradient Preview */}
      <div
        className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700"
        style={{ background: generateGradientString() }}
      />

      {/* Color Stops */}
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {gradientStops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <input
                type="color"
                value={stop.color}
                onChange={(e) =>
                  updateGradientStop(index, "color", e.target.value)
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600"
                style={{ backgroundColor: stop.color }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) =>
                updateGradientStop(index, "position", Number(e.target.value))
              }
              className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-xs w-10 text-neutral-500 dark:text-neutral-400 text-right">
              {stop.position}%
            </span>
            {gradientStops.length > 2 && (
              <button
                type="button"
                onClick={() => removeGradientStop(index)}
                className="w-7 h-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center text-xl leading-none"
                title="Remove color stop"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGradientStop}
        className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
      >
        + Add Color Stop
      </button>
    </div>
  );
}
