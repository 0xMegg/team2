export default function EggBackground() {
  const total = 20; // 총 이미지 개수
  const positions: Array<{ top: number; left: number }> = [];

  // 겹치지 않도록 위치를 생성하는 함수
  const generatePosition = (): { top: number; left: number } => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const top = Math.random() * 100; // 0% ~ 100% 범위로 확장
      const left = Math.random() * 100; // 0% ~ 100% 범위로 확장

      // 기존 위치들과의 거리 확인
      const minDistance = 15; // 최소 거리
      let isValid = true;

      for (const pos of positions) {
        const distance = Math.sqrt(
          Math.pow(top - pos.top, 2) + Math.pow(left - pos.left, 2)
        );
        if (distance < minDistance) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        return { top, left };
      }

      attempts++;
    }

    // 최대 시도 횟수를 초과하면 랜덤 위치 반환
    return {
      top: Math.random() * 100,
      left: Math.random() * 100,
    };
  };

  // 위치 배열 생성
  for (let i = 0; i < total; i++) {
    positions.push(generatePosition());
  }

  // 이미지 소스 결정 함수
  const getImageSource = (index: number): string => {
    if (index === 0) return "/hancom.svg";
    if (index === 1) return "/sniper.svg";
    return "/favicon.png";
  };

  // 이미지 alt 텍스트 결정 함수
  const getImageAlt = (index: number): string => {
    if (index === 0) return "한글 로고";
    if (index === 1) return "스나이퍼 로고";
    return `계란${index}`;
  };

  // 이미지 크기 결정 함수
  const getImageSize = (index: number, random: number): string => {
    if (index === 0) {
      // hancom.svg는 더 크게
      return random < 0.5 ? "w-20" : "w-24";
    }
    if (index === 1) {
      // sniper.svg는 더 크게
      return random < 0.5 ? "w-28" : "w-32";
    }
    return random < 0.5 ? "w-8" : "w-12"; // 나머지는 기존 크기
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {positions.map((pos, index) => {
        const random = Math.random(); // 한 번만 랜덤 값 생성
        const size = getImageSize(index, random);
        const rotation = random * 360;
        const blur = random * 0.5;

        return (
          <img
            key={index}
            src={getImageSource(index)}
            alt={getImageAlt(index)}
            className={`absolute ${size} opacity-[.25] transition-all duration-1000 ease-in-out`}
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              transform: `rotate(${rotation}deg)`,
              filter: `blur(${blur}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
