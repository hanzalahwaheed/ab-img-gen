import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  onClick,
  disabled,
  variant,
  children,
}: ButtonProps) {
  const baseClasses =
    "w-full h-12 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
      type="button"
    >
      {children}
    </button>
  );
}
