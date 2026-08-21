"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface ImageConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizeClasses: string[];
}

interface ImageState {
  top: number;
  left: number;
  sizeClass: string;
  rotation: number;
  blur: number;
  zIndex: number;
  opacity: number;
}

const TOTAL_IMAGES = 20;

const IMAGE_CONFIGS: Record<number, ImageConfig> = {
  0: {
    src: "/hancom.svg",
    alt: "한글 로고",
    width: 96,
    height: 96,
    sizeClasses: ["w-20", "w-24"],
  },
  1: {
    src: "/sniper.svg",
    alt: "스나이퍼 로고",
    width: 128,
    height: 128,
    sizeClasses: ["w-28", "w-32"],
  },
  2: {
    src: "https://github.com/9diin.png",
    alt: "프로젝트 멘토 프로필",
    width: 48,
    height: 48,
    sizeClasses: ["w-12", "w-16"],
  },
};

const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  src: "/favicon.png",
  alt: "",
  width: 32,
  height: 32,
  sizeClasses: ["w-8", "w-12"],
};

function hashString(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededUnit(seed: number) {
  const mixed = Math.imul(seed ^ (seed >>> 16), 2246822507);
  return ((mixed ^ (mixed >>> 13)) >>> 0) / 4294967296;
}

function createImageStates(pathname: string): ImageState[] {
  const routeSeed = hashString(pathname);

  return Array.from({ length: TOTAL_IMAGES }, (_, index) => {
    const config = IMAGE_CONFIGS[index] ?? DEFAULT_IMAGE_CONFIG;
    const baseSeed = routeSeed + index * 101;
    const variation = seededUnit(baseSeed + 4);

    return {
      top: 5 + seededUnit(baseSeed + 1) * 82,
      left: 3 + seededUnit(baseSeed + 2) * 90,
      sizeClass:
        config.sizeClasses[
          Math.floor(seededUnit(baseSeed + 3) * config.sizeClasses.length)
        ],
      rotation: variation * 360,
      blur: variation * 0.5,
      zIndex: 1 + Math.floor(variation * 10),
      opacity: IMAGE_CONFIGS[index] ? 0.4 + variation * 0.2 : 0.3 + variation * 0.4,
    };
  });
}

export default function EggBackground() {
  const pathname = usePathname();
  const imageStates = useMemo(() => createImageStates(pathname), [pathname]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {imageStates.map((imageState, index) => {
        const config = IMAGE_CONFIGS[index] ?? DEFAULT_IMAGE_CONFIG;

        return (
          <Image
            key={`${pathname}-${index}`}
            src={config.src}
            alt={config.alt}
            className={`absolute h-auto ${imageState.sizeClass} transition-all duration-1000 ease-in-out`}
            style={{
              top: `${imageState.top}%`,
              left: `${imageState.left}%`,
              transform: `rotate(${imageState.rotation}deg)`,
              filter: `blur(${imageState.blur}px)`,
              zIndex: imageState.zIndex,
              opacity: imageState.opacity,
            }}
            width={config.width}
            height={config.height}
          />
        );
      })}
    </div>
  );
}
