export default function EggBackground() {
  const rows = 6; // 세로 줄 수
  const cols = 6; // 가로 줄 수
  const gap = 100 / Math.max(rows, cols); // 각 칸 크기
  const total = rows * cols;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {Array.from({ length: total }).map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const top = row * gap + Math.random() * (gap / 2);
        const left = col * gap + Math.random() * (gap / 2);

        return (
          <img
            key={index}
            src="/favicon.png"
            alt={`계란${index}`}
            className={`absolute w-${getSize(index)} opacity-${getOpacity(
              index
            )}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
            }}
          />
        );
      })}
    </div>
  );
}

function getSize(index: number) {
  const sizes = [6, 8, 10, 12];
  return sizes[index % sizes.length];
}

function getOpacity(index: number) {
  const opacities = [10, 20, 25, 30];
  return opacities[index % opacities.length];
}
