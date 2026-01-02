"use client";

import { useRef, useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import ImageUploadSection from "@/components/ImageUploadSection";
import CustomizationSection, {
  GradientStop,
} from "@/components/CustomizationSection";
import PreviewSection from "@/components/PreviewSection";
import ActionButtons from "@/components/ActionButtons";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function ABImageGenerator() {
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);

  // Background type state
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient">(
    "gradient",
  );

  // Solid color state
  const [solidColor, setSolidColor] = useState("#f8fafc");

  // Gradient states
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([
    { color: "#f8fafc", position: 0 },
    { color: "#e2e8f0", position: 100 },
  ]);
  const [gradientAngle, setGradientAngle] = useState(90);

  const [labelFont, setLabelFont] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState(24);
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageFile = (file: File, side: "left" | "right") => {
    const url = URL.createObjectURL(file);
    if (side === "left") {
      setLeftImage(url);
    } else {
      setRightImage(url);
    }
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file, side);
    }
  };

  const handleRemove = (side: "left" | "right") => {
    if (side === "left") {
      setLeftImage(null);
    } else {
      setRightImage(null);
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const side = !leftImage ? "left" : "right";
            handleImageFile(file, side);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [leftImage, rightImage]);

  const generateImage = async () => {
    if (!leftImage || !rightImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgA = new Image();
    const imgB = new Image();

    imgA.src = leftImage;
    imgB.src = rightImage;

    await Promise.all([
      new Promise((res) => (imgA.onload = res)),
      new Promise((res) => (imgB.onload = res)),
    ]);

    const MAX_HEIGHT = 800;
    const PADDING = 40;
    const LABEL_STRIP_HEIGHT = 100;
    const BORDER_RADIUS = borderRadius;

    const scaleA = Math.min(1, MAX_HEIGHT / imgA.height);
    const scaleB = Math.min(1, MAX_HEIGHT / imgB.height);

    const newHeightA = imgA.height * scaleA;
    const newWidthA = imgA.width * scaleA;

    const newHeightB = imgB.height * scaleB;
    const newWidthB = imgB.width * scaleB;

    const contentHeight = Math.max(newHeightA, newHeightB);
    const totalWidth = newWidthA + newWidthB + PADDING * 3;
    const totalHeight = contentHeight + PADDING * 2 + LABEL_STRIP_HEIGHT;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(BORDER_RADIUS, 0);
    ctx.lineTo(totalWidth - BORDER_RADIUS, 0);
    ctx.quadraticCurveTo(totalWidth, 0, totalWidth, BORDER_RADIUS);
    ctx.lineTo(totalWidth, totalHeight - BORDER_RADIUS);
    ctx.quadraticCurveTo(
      totalWidth,
      totalHeight,
      totalWidth - BORDER_RADIUS,
      totalHeight,
    );
    ctx.lineTo(BORDER_RADIUS, totalHeight);
    ctx.quadraticCurveTo(0, totalHeight, 0, totalHeight - BORDER_RADIUS);
    ctx.lineTo(0, BORDER_RADIUS);
    ctx.quadraticCurveTo(0, 0, BORDER_RADIUS, 0);
    ctx.closePath();
    ctx.clip();

    // Apply background based on type
    if (backgroundType === "solid") {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    } else {
      // Gradient background
      const radians = (gradientAngle - 90) * (Math.PI / 180);
      const centerX = totalWidth / 2;
      const centerY = totalHeight / 2;

      const diagonal = Math.sqrt(
        totalWidth * totalWidth + totalHeight * totalHeight,
      );
      const x1 = centerX - (Math.cos(radians) * diagonal) / 2;
      const y1 = centerY - (Math.sin(radians) * diagonal) / 2;
      const x2 = centerX + (Math.cos(radians) * diagonal) / 2;
      const y2 = centerY + (Math.sin(radians) * diagonal) / 2;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

      const sortedStops = [...gradientStops].sort(
        (a, b) => a.position - b.position,
      );
      sortedStops.forEach((stop) => {
        gradient.addColorStop(stop.position / 100, stop.color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    }

    const offsetAY = PADDING + (contentHeight - newHeightA) / 2;
    const offsetBY = PADDING + (contentHeight - newHeightB) / 2;

    ctx.drawImage(imgA, PADDING, offsetAY, newWidthA, newHeightA);
    ctx.drawImage(
      imgB,
      PADDING * 2 + newWidthA,
      offsetBY,
      newWidthB,
      newHeightB,
    );

    ctx.fillStyle = "#000000";
    ctx.font = `bold 48px ${labelFont}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "A",
      PADDING + newWidthA / 2,
      contentHeight + PADDING * 2 + LABEL_STRIP_HEIGHT / 2,
    );
    ctx.fillText(
      "B",
      PADDING * 2 + newWidthA + newWidthB / 2,
      contentHeight + PADDING * 2 + LABEL_STRIP_HEIGHT / 2,
    );

    ctx.restore();
    setGenerated(true);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "ab-comparison.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 left-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            A/B Test Image Generator
          </h1>
          <Link
            href={"https://github.com/hanzalahwaheed/ab-img-gen"}
            target="_blank"
          >
            <GithubIcon className="absolute cursor-pointer top-0 right-0 mt-1" />
          </Link>
        </header>

        <main className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUploadSection
              leftImage={leftImage}
              rightImage={rightImage}
              onUpload={handleUpload}
              onRemove={handleRemove}
            />
            <CustomizationSection
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundType}
              solidColor={solidColor}
              setSolidColor={setSolidColor}
              gradientStops={gradientStops}
              setGradientStops={setGradientStops}
              gradientAngle={gradientAngle}
              setGradientAngle={setGradientAngle}
              labelFont={labelFont}
              setLabelFont={setLabelFont}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadius}
            />
            <ActionButtons
              onGenerate={generateImage}
              onDownload={downloadImage}
              canGenerate={!!(leftImage && rightImage)}
              canDownload={generated}
            />
          </div>
          <PreviewSection
            canvasRef={canvasRef}
            borderRadius={borderRadius}
            leftImage={leftImage}
            rightImage={rightImage}
          />
        </main>
      </div>
    </div>
  );
}
