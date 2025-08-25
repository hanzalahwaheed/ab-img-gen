"use client";

import { useRef, useState, useEffect } from "react";

export default function ABImageGenerator() {
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#f8fafc");
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
    side: "left" | "right"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file, side);
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
            // If left image is empty, paste there. Otherwise, paste to right.
            const side = !leftImage ? "left" : "right";
            handleImageFile(file, side);
            break; // Handle only the first image
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [leftImage, rightImage]); // Rerun if images change to correctly determine side

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

    // Fill only the clipped area with neutral
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
    setGenerated(true);
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            A/B Test Image Generator
          </h1>
        </header>

        <main className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col 1: Upload Images */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
              <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                Upload Images
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 -mt-2">
                Click each box to upload, or simply paste an image from your
                clipboard. It will be placed in the first available slot.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { side: "left", label: "Version A", image: leftImage },
                  { side: "right", label: "Version B", image: rightImage },
                ].map(({ side, label, image }) => (
                  <div key={side} className="col-span-1">
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                      {label}
                    </label>
                    <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer group flex items-center justify-center h-24">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUpload(e, side as "left" | "right")
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {image ? (
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600 dark:text-green-400"
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
                          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                            Image loaded
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-neutral-500"
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
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Click or paste to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Customization */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
              <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                Customise
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-700"
                        style={{ backgroundColor: bgColor }}
                      />
                    </div>
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="#f8fafc"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    Label Font
                  </label>
                  <select
                    value={labelFont}
                    onChange={(e) => setLabelFont(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Col 3: Actions */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col justify-center gap-4">
              <button
                onClick={generateImage}
                disabled={!leftImage || !rightImage}
                className="w-full bg-blue-600 text-white h-12 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Generate Image
              </button>

              <button
                onClick={downloadImage}
                disabled={!generated}
                className="w-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 h-12 px-4 rounded-lg font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                Preview
              </h2>
              <div className="w-full bg-neutral-100 dark:bg-neutral-900/50 rounded-xl flex items-center justify-center p-8 min-h-[400px]">
                <div
                  className="relative transition-all duration-200"
                  style={{
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto shadow-2xl shadow-neutral-400/20 dark:shadow-black/20"
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
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium mb-2">
                          Upload both images to see a preview
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                          Your A/B test comparison will appear here
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
