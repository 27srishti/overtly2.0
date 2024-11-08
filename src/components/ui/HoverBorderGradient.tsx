"use client"; // Ensure this is the first line
import React, { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the props interface
interface HoverBorderGradientProps {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements; // Allows any valid HTML element
  duration?: number;
  clockwise?: boolean;
  [key: string]: any; // Allow additional props
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<"TOP" | "LEFT" | "BOTTOM" | "RIGHT">("TOP");

  const rotateDirection = (currentDirection: "TOP" | "LEFT" | "BOTTOM" | "RIGHT") => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"] as const;
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  // Updated movingMap to use larger height for reddish-orange color gradients
  const movingMap = {
    TOP: "radial-gradient(20% 70% at 50% 0%, rgba(128, 128, 128, 1) 0%, rgba(128, 128, 128, 0) 100%)", // Gray gradient
    LEFT: "radial-gradient(20% 70% at 0% 50%, rgba(128, 128, 128, 1) 0%, rgba(128, 128, 128, 0) 100%)", // Gray gradient
    BOTTOM: "radial-gradient(20% 70% at 50% 100%, rgba(128, 128, 128, 1) 0%, rgba(128, 128, 128, 0) 100%)", // Gray gradient
    RIGHT: "radial-gradient(20% 70% at 100% 50%, rgba(128, 128, 128, 1) 0%, rgba(128, 128, 128, 0) 100%)", // Gray gradient
  };

  const highlight = "radial-gradient(75% 181.15942028985506% at 50% 50%, rgba(128, 128, 128, 0.5) 0%, rgba(255, 255, 255, 0) 100%)"; // Gray highlight

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovered) {
        setDirection((prevState) => rotateDirection(prevState));
      }
    }, duration * 1000);
    
    return () => clearInterval(interval);
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative rounded-full content-center bg-black/20 hover:bg-black/5 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn("w-auto text-white bg-black px-4 py-2 rounded-full z-20", className)}
      >
        {children}
      </div>
      <motion.div
        className={cn("flex-none z-10 inset-0 opacity-40 overflow-hidden absolute rounded-full")}
        style={{
          filter: "blur(0px) drop-shadow(0 0 5px rgba(128, 128, 128, 0.5))", // Apply blur and gray drop-shadow
          position: "absolute",
          width: "100%",
          height: "100%",
          border: hovered ? "4px solid rgba(128, 128, 128, 0.8)" : "4px solid transparent", // Gray border
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
          borderColor: hovered ? "rgba(128, 128, 128, 0.8)" : "transparent", // Gray border on hover
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
    </Tag>
  );
}