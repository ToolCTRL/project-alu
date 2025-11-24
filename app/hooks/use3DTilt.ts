import type React from "react";
import { useCallback, useRef, useState } from "react";

/**
 * Custom hook for 3D tilt effect on mouse move with direct transform manipulation
 * Creates a magnetic 3D card effect that follows the mouse
 */
export function use3DTilt({
  maxAngle = 12,
  scale = 1.01,
  perspective = 1100,
}: {
  maxAngle?: number;
  scale?: number;
  perspective?: number;
} = {}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [{ rotateX, rotateY }, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = e.currentTarget;
      cardRef.current = card;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation percentages (-1 to 1)
      const percentX = (x - centerX) / centerX;
      const percentY = -((y - centerY) / centerY);
      const nextRotateY = percentX * maxAngle;
      const nextRotateX = percentY * maxAngle;

      // Apply transform directly for snappy response
      card.style.transform = `perspective(${perspective}px) rotateY(${nextRotateY}deg) rotateX(${nextRotateX}deg) scale(${scale})`;
      card.style.transition = "transform 0.14s ease-out";
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      setTilt({ rotateX: nextRotateX, rotateY: nextRotateY });
    },
    [maxAngle, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg) scale(1)`;
      cardRef.current.style.transition = "transform 0.35s ease-out";
    }
  }, [perspective]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
