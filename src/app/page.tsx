"use client";

import { useRef, useState } from "react";

export default function ABImageGenerator() {
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [labelFont, setLabelFont] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState(24);
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
    const BORDER_RADIUS = borderRadius;
    const BG_COLOR = bgColor;

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
    ctx.font = `bold 48px ${labelFont}, sans-serif`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            A/B Test Image Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Create professional A/B test comparison images with customizable
            styling
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Upload Images
              </h2>

              {/* Image Upload Cards */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Version A
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, "left")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {leftImage ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          Image A uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Click to upload Version A
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Version B
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, "right")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {rightImage ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          Image B uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Click to upload Version B
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Customization
              </h2>

              <div className="space-y-6">
                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono"
                      placeholder="#f8fafc"
                    />
                  </div>
                </div>

                {/* Label Font */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Label Font
                  </label>
                  <select
                    value={labelFont}
                    onChange={(e) => setLabelFont(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>0px</span>
                    <span>25px</span>
                    <span>50px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={generateImage}
                disabled={!leftImage || !rightImage}
                className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 px-4 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Generate Image
              </button>

              <button
                onClick={downloadImage}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Preview
              </h2>

              <div className="flex justify-center">
                <div
                  className="relative bg-slate-50 dark:bg-slate-800 p-8 transition-all duration-200"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    border: `2px dashed ${
                      borderRadius > 0 ? "#e2e8f0" : "transparent"
                    }`,
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto shadow-xl"
                    style={{ borderRadius: `${borderRadius}px` }}
                  />
                  {!leftImage || !rightImage ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-2">
                          Upload both images to see preview
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">
                          Your A/B test comparison will appear here
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
