"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// 상수 정의
const CONSTANTS = {
  TOTAL_IMAGES: 20,
  MIN_DISTANCE: 15,
  MAX_ATTEMPTS: 100,
  OPACITY_MIN: 0.4,
  OPACITY_MAX: 0.6,
  EGG_OPACITY_MIN: 0.3,
  EGG_OPACITY_MAX: 0.7,
  TRANSITION_DURATION: 1000,
  BLUR_MAX: 0.5,
  ROTATION_MAX: 360,
  Z_INDEX_MIN: 1,
  Z_INDEX_MAX: 10,
} as const;

// 타입 정의
interface Position {
  top: number;
  left: number;
}

interface ImageConfig {
  src: string;
  alt: string;
  baseWidth: number;
  baseHeight: number;
  sizeClasses: string[];
}

interface ImageState {
  position: Position;
  sizeClass: string;
  rotation: number;
  blur: number;
  zIndex: number;
  opacity: number;
}

// 이미지 설정 데이터
const IMAGE_CONFIGS: Record<number, ImageConfig> = {
  0: {
    src: "/hancom.svg",
    alt: "한글 로고",
    baseWidth: 96,
    baseHeight: 96,
    sizeClasses: ["w-20", "w-24"],
  },
  1: {
    src: "/sniper.svg",
    alt: "스나이퍼 로고",
    baseWidth: 128,
    baseHeight: 128,
    sizeClasses: ["w-28", "w-32"],
  },
  2: {
    src: "https://github.com/9diin.png",
    alt: "박성재 깃허브 프로필",
    baseWidth: 48,
    baseHeight: 48,
    sizeClasses: ["w-12", "w-16"],
  },
  3: {
    src: "https://novaprotocol.net/profile.png",
    alt: "김태현 깃허브 프로필",
    baseWidth: 48,
    baseHeight: 48,
    sizeClasses: ["w-12", "w-16"],
  },
};

const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  src: "/favicon.png",
  alt: "계란",
  baseWidth: 32,
  baseHeight: 32,
  sizeClasses: ["w-8", "w-12"],
};

export default function EggBackground() {
  const pathname = usePathname();
  const [animationKey, setAnimationKey] = useState(0);
  const previousStatesRef = useRef<ImageState[]>([]);

  // 페이지 변경 시 애니메이션 키 업데이트
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [pathname]);

  // 위치 배열 생성
  const positions = useMemo(() => {
    const positionsArray: Position[] = [];

    // 두 위치 간의 거리 계산
    const calculateDistance = (pos1: Position, pos2: Position): number => {
      return Math.sqrt(
        Math.pow(pos1.top - pos2.top, 2) + Math.pow(pos1.left - pos2.left, 2)
      );
    };

    // 겹치지 않는 위치 생성
    const generateValidPosition = (): Position => {
      let attempts = 0;

      while (attempts < CONSTANTS.MAX_ATTEMPTS) {
        const newPosition: Position = {
          top: Math.random() * 100,
          left: Math.random() * 100,
        };

        // 기존 위치들과의 거리 확인
        const isValid = positionsArray.every(
          (existingPos) =>
            calculateDistance(newPosition, existingPos) >=
            CONSTANTS.MIN_DISTANCE
        );

        if (isValid) {
          return newPosition;
        }

        attempts++;
      }

      // 최대 시도 횟수 초과 시 랜덤 위치 반환
      return {
        top: Math.random() * 100,
        left: Math.random() * 100,
      };
    };

    // 위치 배열 생성
    for (let i = 0; i < CONSTANTS.TOTAL_IMAGES; i++) {
      positionsArray.push(generateValidPosition());
    }

    return positionsArray;
  }, [animationKey]);

  // 이미지 상태 생성
  const imageStates = useMemo(() => {
    const newStates = positions.map((position, index) => {
      const random = Math.random();
      const config = IMAGE_CONFIGS[index] || DEFAULT_IMAGE_CONFIG;

      return {
        position,
        sizeClass:
          config.sizeClasses[Math.floor(random * config.sizeClasses.length)],
        rotation: random * CONSTANTS.ROTATION_MAX,
        blur: random * CONSTANTS.BLUR_MAX,
        zIndex:
          Math.floor(
            random * (CONSTANTS.Z_INDEX_MAX - CONSTANTS.Z_INDEX_MIN + 1)
          ) + CONSTANTS.Z_INDEX_MIN,
        opacity: IMAGE_CONFIGS[index]
          ? CONSTANTS.OPACITY_MIN +
            random * (CONSTANTS.OPACITY_MAX - CONSTANTS.OPACITY_MIN)
          : CONSTANTS.EGG_OPACITY_MIN +
            random * (CONSTANTS.EGG_OPACITY_MAX - CONSTANTS.EGG_OPACITY_MIN),
      };
    });

    // 현재 상태를 이전 상태로 저장
    if (previousStatesRef.current.length === 0) {
      previousStatesRef.current = newStates;
    }

    return newStates;
  }, [animationKey, positions]);

  // 이미지 렌더링 함수
  const renderImage = (imageState: ImageState, index: number) => {
    const config = IMAGE_CONFIGS[index] || DEFAULT_IMAGE_CONFIG;
    const previousState = previousStatesRef.current[index];
    const isFirstRender = !previousState;

    // 첫 렌더링이 아닌 경우 이전 상태에서 새 상태로 전환
    const currentState = isFirstRender ? imageState : previousState;
    const targetState = imageState;

    return (
      <Image
        key={`${index}-${animationKey}`}
        src={config.src}
        alt={config.alt}
        className={`absolute ${currentState.sizeClass} transition-all duration-${CONSTANTS.TRANSITION_DURATION} ease-in-out`}
        style={{
          top: `${targetState.position.top}%`,
          left: `${targetState.position.left}%`,
          transform: `rotate(${targetState.rotation}deg)`,
          filter: `blur(${targetState.blur}px)`,
          zIndex: targetState.zIndex,
          opacity: targetState.opacity,
        }}
        width={config.baseWidth}
        height={config.baseHeight}
        priority={false}
      />
    );
  };

  // 전환 완료 후 이전 상태 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      previousStatesRef.current = imageStates;
    }, CONSTANTS.TRANSITION_DURATION);

    return () => clearTimeout(timer);
  }, [imageStates]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {imageStates.map((imageState, index) => renderImage(imageState, index))}
    </div>
  );
}
