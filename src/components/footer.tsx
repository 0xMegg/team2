export default function Footer() {
  return (
    <footer className="w-full bg-amber-300 py-5 flex flex-col items-center ">
      {/* 저작권 정보 */}
      <p className="text-xs text-white/80 mt-2">
        &copy; 2025{" "}
        <span style={{ fontFamily: "'BagelFatOne-Regular', sans-serif" }}>
          후라이잉
        </span>{" "}
        |{" "}
        <span style={{ fontFamily: "'BagelFatOne-Regular', sans-serif" }}>
          김준엽, 손민준, 최준호, 김현영
        </span>{" "}
        | All rights reserved.
      </p>
    </footer>
  );
}
