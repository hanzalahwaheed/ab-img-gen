"use client";

import { useRef, useState } from "react";

export default function ABImageGenerator() {
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      side === "left" ? setLeftImage(url) : setRightImage(url);
    }
  };

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

    // ---- SETTINGS ----
    const MAX_HEIGHT = 800;
    const PADDING = 40;
    const LABEL_STRIP_HEIGHT = 100;
    const BORDER_RADIUS = 50;
    const BG_COLOR = "#f5f5f5";

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

    // Clip canvas to rounded rectangle
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
      totalHeight
    );
    ctx.lineTo(BORDER_RADIUS, totalHeight);
    ctx.quadraticCurveTo(0, totalHeight, 0, totalHeight - BORDER_RADIUS);
    ctx.lineTo(0, BORDER_RADIUS);
    ctx.quadraticCurveTo(0, 0, BORDER_RADIUS, 0);
    ctx.closePath();
    ctx.clip();

    // Fill only the clipped area with gray
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw images
    const offsetAY = PADDING + (contentHeight - newHeightA) / 2;
    const offsetBY = PADDING + (contentHeight - newHeightB) / 2;

    ctx.drawImage(imgA, PADDING, offsetAY, newWidthA, newHeightA);
    ctx.drawImage(
      imgB,
      PADDING * 2 + newWidthA,
      offsetBY,
      newWidthB,
      newHeightB
    );

    // Draw labels
    ctx.fillStyle = "#000000";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "A",
      PADDING + newWidthA / 2,
      contentHeight + PADDING * 2 + LABEL_STRIP_HEIGHT / 2
    );
    ctx.fillText(
      "B",
      PADDING * 2 + newWidthA + newWidthB / 2,
      contentHeight + PADDING * 2 + LABEL_STRIP_HEIGHT / 2
    );

    ctx.restore();
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "ab-comparison.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "left")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "right")}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={generateImage}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow"
        >
          Generate
        </button>
        <button
          onClick={downloadImage}
          className="rounded-xl bg-green-600 px-4 py-2 text-white shadow"
        >
          Download
        </button>
      </div>

      <canvas ref={canvasRef} className="mt-6 w-3/4 h-3/4 border shadow-lg" />
    </div>
  );
}
