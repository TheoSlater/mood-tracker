// MIT Licensed – © 2025 Theo Slater
// https://github.com/TheoSlater/blob-component
// theoslater.xyz

"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface AnimatedBlobProps {
  size?: number;
  colors?: string[];
  speed?: number;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  glowIntensity?: number;
  dropShadow?: boolean;
  vertices?: number;
  gradientAngle?: number;
  gradientType?: "linear" | "radial";
  animateGradient?: boolean;
  gradientSpeed?: number;
  gradientDirection?: "clockwise" | "counterclockwise";
}

export function AnimatedBlob({
  size = 200,
  colors = ["#6366f1", "#8b5cf6", "#ec4899"],
  speed = 1,
  intensity = 0.5,
  className = "",
  style = {},
  glow = true,
  glowIntensity = 3,
  dropShadow = true,
  vertices = 24,
  gradientAngle = 45,
  gradientType = "linear",
  animateGradient = false,
  gradientSpeed = 1,
  gradientDirection = "clockwise",
}: AnimatedBlobProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<
    SVGLinearGradientElement | SVGRadialGradientElement
  >(null);
  const animationRef = useRef<number>();
  const gradientId = useRef(
    `blob-gradient-${Math.random().toString(36).substr(2, 9)}`
  );

  // Use refs to store current values without causing re-renders
  const currentSizeRef = useRef(size);
  const currentSpeedRef = useRef(speed);
  const currentIntensityRef = useRef(intensity);
  const currentVerticesRef = useRef(vertices);
  const currentGradientAngleRef = useRef(gradientAngle);
  const currentGradientSpeedRef = useRef(gradientSpeed);
  const currentGradientDirectionRef = useRef(gradientDirection);
  const currentAnimateGradientRef = useRef(animateGradient);
  const currentGradientTypeRef = useRef(gradientType);

  // Keep track of animation time to prevent resets
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  const [interpolatedColors, setInterpolatedColors] = useState(colors);
  const interpolationRef = useRef<number>();

  // Update refs when props change (without triggering re-renders)
  useEffect(() => {
    currentSizeRef.current = size;
  }, [size]);

  useEffect(() => {
    currentSpeedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    currentIntensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    currentVerticesRef.current = vertices;
  }, [vertices]);

  useEffect(() => {
    currentGradientAngleRef.current = gradientAngle;
  }, [gradientAngle]);

  useEffect(() => {
    currentGradientSpeedRef.current = gradientSpeed;
  }, [gradientSpeed]);

  useEffect(() => {
    currentGradientDirectionRef.current = gradientDirection;
  }, [gradientDirection]);

  useEffect(() => {
    currentAnimateGradientRef.current = animateGradient;
  }, [animateGradient]);

  useEffect(() => {
    currentGradientTypeRef.current = gradientType;
  }, [gradientType]);

  // Smooth color interpolation without restarting animation
  useEffect(() => {
    if (colors.join() !== interpolatedColors.join()) {
      // Clear any existing interpolation
      if (interpolationRef.current) {
        clearInterval(interpolationRef.current);
      }

      interpolateColors(interpolatedColors, colors, 300);
    }
  }, [colors]);

  const interpolateColors = useCallback(
    (fromColors: string[], toColors: string[], duration: number) => {
      const frameRate = 60;
      const steps = (duration / 1000) * frameRate;
      let currentStep = 0;

      const fromRGB = fromColors.map(hexToRgb);
      const toRGB = toColors.map(hexToRgb);

      interpolationRef.current = setInterval(() => {
        currentStep++;
        const t = currentStep / steps;

        const blended = fromRGB.map((from, i) => {
          const to = toRGB[i % toRGB.length];
          return rgbToHex({
            r: Math.round(from.r + (to.r - from.r) * t),
            g: Math.round(from.g + (to.g - from.g) * t),
            b: Math.round(from.b + (to.b - from.b) * t),
          });
        });

        setInterpolatedColors(blended);

        if (currentStep >= steps) {
          clearInterval(interpolationRef.current!);
        }
      }, 1000 / frameRate);
    },
    []
  );

  const hexToRgb = useCallback((hex: string) => {
    const parsed = hex.replace(/^#/, "");
    const bigint = parseInt(parsed, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }, []);

  const rgbToHex = useCallback(
    ({ r, g, b }: { r: number; g: number; b: number }) => {
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    },
    []
  );

  const generateBlobPath = useCallback(
    (
      baseRadius: number,
      time: number,
      morphIntensity: number,
      pointCount: number
    ): string => {
      const padding = Math.max(20, baseRadius * 0.1);
      const radius = baseRadius - padding;
      const points = Math.max(12, Math.min(48, pointCount));
      const angleStep = (Math.PI * 2) / points;
      let path = "";

      const coords: Array<{ x: number; y: number }> = [];

      const baseNoise = morphIntensity * 0.03;
      const centerX = baseRadius;
      const centerY = baseRadius;

      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        const noise1 = Math.sin(angle * 3 + time) * baseNoise;
        const noise2 = Math.cos(angle * 5 + time * 1.5) * (baseNoise * 0.5);
        const noise3 = Math.sin(angle * 7 + time * 0.8) * (baseNoise * 0.25);

        const radiusVariation = 1 + noise1 + noise2 + noise3;
        const currentRadius = radius * radiusVariation;

        const x = Math.cos(angle) * currentRadius + centerX;
        const y = Math.sin(angle) * currentRadius + centerY;

        coords.push({ x, y });
      }

      if (coords.length > 0) {
        path = `M ${coords[0].x} ${coords[0].y}`;

        for (let i = 0; i < coords.length - 1; i++) {
          const current = coords[i];
          const next = coords[(i + 1) % coords.length];
          const nextNext = coords[(i + 2) % coords.length];
          const prev = coords[(i - 1 + coords.length) % coords.length];

          const cp1x = current.x + (next.x - prev.x) * 0.15;
          const cp1y = current.y + (next.y - prev.y) * 0.15;
          const cp2x = next.x - (nextNext.x - current.x) * 0.15;
          const cp2y = next.y - (nextNext.y - current.y) * 0.15;

          path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
        }

        path += " Z";
      }

      return path;
    },
    []
  );

  const getGradientCoords = useCallback(
    (angle: number, type: "linear" | "radial") => {
      if (type === "radial") {
        return {
          x1: "50%",
          y1: "50%",
          x2: "50%",
          y2: "50%",
          r: "50%",
        };
      }

      const radians = (angle * Math.PI) / 180;
      const x1 = 50 - 50 * Math.cos(radians);
      const y1 = 50 - 50 * Math.sin(radians);
      const x2 = 50 + 50 * Math.cos(radians);
      const y2 = 50 + 50 * Math.sin(radians);

      return {
        x1: `${x1}%`,
        y1: `${y1}%`,
        x2: `${x2}%`,
        y2: `${y2}%`,
      };
    },
    []
  );

  // Single animation loop that doesn't restart
  useEffect(() => {
    const animate = (currentTime: number) => {
      // Calculate elapsed time to maintain smooth animation
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Update time based on speed
      timeRef.current += (deltaTime / 1000) * currentSpeedRef.current;

      if (pathRef.current) {
        const path = generateBlobPath(
          currentSizeRef.current / 2,
          timeRef.current,
          currentIntensityRef.current,
          currentVerticesRef.current
        );
        pathRef.current.setAttribute("d", path);
      }

      if (
        currentAnimateGradientRef.current &&
        gradientRef.current &&
        currentGradientTypeRef.current === "linear"
      ) {
        const gradientTime = timeRef.current * currentGradientSpeedRef.current;
        const direction =
          currentGradientDirectionRef.current === "clockwise" ? 1 : -1;
        const animatedAngle =
          currentGradientAngleRef.current + gradientTime * 30 * direction;
        const gradientCoords = getGradientCoords(
          animatedAngle,
          currentGradientTypeRef.current
        );

        gradientRef.current.setAttribute("x1", gradientCoords.x1);
        gradientRef.current.setAttribute("y1", gradientCoords.y1);
        gradientRef.current.setAttribute("x2", gradientCoords.x2);
        gradientRef.current.setAttribute("y2", gradientCoords.y2);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    lastFrameTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (interpolationRef.current) {
        clearInterval(interpolationRef.current);
      }
    };
  }, []); // Empty dependency array - animation never restarts

  const gradientCoords = getGradientCoords(gradientAngle, gradientType);
  const shadowClass = dropShadow ? "drop-shadow-lg" : "";

  return (
    <div className={`relative ${className}`} style={style}>
      <motion.svg
        width={size}
        height={size}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        viewBox={`0 0 ${size} ${size}`}
        className={shadowClass}
      >
        <defs>
          {gradientType === "linear" ? (
            <linearGradient
              ref={gradientRef as React.RefObject<SVGLinearGradientElement>}
              id={gradientId.current}
              x1={gradientCoords.x1}
              y1={gradientCoords.y1}
              x2={gradientCoords.x2}
              y2={gradientCoords.y2}
            >
              {interpolatedColors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${
                    (index / Math.max(1, interpolatedColors.length - 1)) * 100
                  }%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          ) : (
            <radialGradient
              ref={gradientRef as React.RefObject<SVGRadialGradientElement>}
              id={gradientId.current}
              cx={gradientCoords.x1}
              cy={gradientCoords.y1}
              r={gradientCoords.r}
            >
              {interpolatedColors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${
                    (index / Math.max(1, interpolatedColors.length - 1)) * 100
                  }%`}
                  stopColor={color}
                />
              ))}
            </radialGradient>
          )}
          {glow && (
            <filter id={`glow-${gradientId.current}`}>
              <feGaussianBlur
                stdDeviation={glowIntensity}
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        <path
          ref={pathRef}
          fill={`url(#${gradientId.current})`}
          filter={glow ? `url(#glow-${gradientId.current})` : undefined}
          className="transition-all duration-100 ease-out"
        />
      </motion.svg>
    </div>
  );
}

export const BlobPresets = {
  subtle: { intensity: 0.3, speed: 0.8 },
  normal: { intensity: 0.5, speed: 1 },
  dynamic: { intensity: 1, speed: 1.5 },
  extreme: { intensity: 2, speed: 2 },
  static: { intensity: 0, speed: 0 },
  gradientSpin: {
    intensity: 0.5,
    speed: 1,
    animateGradient: true,
    gradientSpeed: 1,
  },
  fastSpin: {
    intensity: 0.8,
    speed: 1.2,
    animateGradient: true,
    gradientSpeed: 2,
  },
} as const;

export const BlobColors = {
  purple: ["#6366f1", "#8b5cf6", "#ec4899"],
  ocean: ["#06b6d4", "#0891b2", "#0e7490"],
  sunset: ["#f59e0b", "#f97316", "#ef4444"],
  forest: ["#10b981", "#059669", "#047857"],
  rose: ["#ec4899", "#be185d", "#9f1239"],
  monochrome: ["#374151", "#6b7280", "#9ca3af"],
  rainbow: [
    "#ff0000",
    "#ff8000",
    "#ffff00",
    "#80ff00",
    "#00ff00",
    "#00ff80",
    "#00ffff",
    "#0080ff",
    "#0000ff",
    "#8000ff",
    "#ff00ff",
    "#ff0080",
  ],
  neon: ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5"],
} as const;
