import React from "react";
import BackgroundTypeToggle from "./customization/BackgroundTypeToggle";
import SolidColorPicker from "./customization/SolidColorPicker";
import GradientPicker from "./customization/GradientPicker";
import FontSelector from "./customization/FontSelector";
import BorderRadiusSlider from "./customization/BorderRadiusSlider";

export interface GradientStop {
  color: string;
  position: number;
}

interface CustomizationSectionProps {
  backgroundType: "solid" | "gradient";
  setBackgroundType: (type: "solid" | "gradient") => void;
  solidColor: string;
  setSolidColor: (color: string) => void;
  gradientStops: GradientStop[];
  setGradientStops: (stops: GradientStop[]) => void;
  gradientAngle: number;
  setGradientAngle: (angle: number) => void;
  labelFont: string;
  setLabelFont: (font: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
}

export default function CustomizationSection({
  backgroundType,
  setBackgroundType,
  solidColor,
  setSolidColor,
  gradientStops,
  setGradientStops,
  gradientAngle,
  setGradientAngle,
  labelFont,
  setLabelFont,
  borderRadius,
  setBorderRadius,
}: CustomizationSectionProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 transition-colors">
      <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
        Customise
      </h2>
      <div className="space-y-4">
        <BackgroundTypeToggle
          backgroundType={backgroundType}
          setBackgroundType={setBackgroundType}
        />

        {backgroundType === "solid" && (
          <SolidColorPicker
            solidColor={solidColor}
            setSolidColor={setSolidColor}
          />
        )}

        {backgroundType === "gradient" && (
          <GradientPicker
            gradientStops={gradientStops}
            setGradientStops={setGradientStops}
            gradientAngle={gradientAngle}
            setGradientAngle={setGradientAngle}
          />
        )}

        <FontSelector labelFont={labelFont} setLabelFont={setLabelFont} />

        <BorderRadiusSlider
          borderRadius={borderRadius}
          setBorderRadius={setBorderRadius}
        />
      </div>
    </div>
  );
}
