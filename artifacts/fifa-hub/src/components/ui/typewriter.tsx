import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  textArray: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export function Typewriter({
  textArray,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
  className = "",
  cursorClassName = "bg-primary",
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = textArray[currentTextIndex];

    if (isDeleting) {
      if (displayedText.length === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (displayedText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, textArray, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
        className={`inline-block w-[2px] h-[1em] ml-[4px] -mb-[1px] ${cursorClassName}`}
      />
    </span>
  );
}
