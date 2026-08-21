import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSeatTitle } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth";

interface SeatData {
  id: string | number;
  seat: number;
  userName: string;
  title?: string;
  profileImage?: string;
  url?: string;
}

interface SeatsTableProps {
  seat?: number;
  onSeatChange?: (seatNumber: number) => void;
  seatsData?: SeatData[];
  selectedSeat?: number;
  isEditMode?: boolean;
}

const ROW_NUMBERS = [0, 1, 2, 3, 4];
const PAIR_STARTS = [1, 3, 5];
const ERROR_SEAT = 1;

export default function SeatsTable({
  seat,
  onSeatChange,
  seatsData = [],
  selectedSeat,
  isEditMode = false,
}: SeatsTableProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSelectionView = onSeatChange !== undefined;
  const currentSelectedSeat = selectedSeat ?? seat;

  const getSeatData = (seatNumber: number) => {
    if (seatNumber === ERROR_SEAT) {
      return {
        id: "error-seat",
        seat: ERROR_SEAT,
        title: "Error",
        userName: "",
        profileImage: "",
      };
    }

    return seatsData.find((item) => item.seat === seatNumber);
  };

  const isSeatDisabled = (seatNumber: number) => {
    const seatData = getSeatData(seatNumber);

    if (seatNumber === ERROR_SEAT) return true;
    if (isSelectionView && !isEditMode && seatData?.seat) return true;
    if (!isSelectionView && isAuthenticated && !seatData?.seat) return true;
    return false;
  };

  const getSeatStyle = (
    seatNumber: number,
    isLeftCard: boolean,
    isRightCard: boolean,
  ) => {
    const seatData = getSeatData(seatNumber);
    const cardWidth = isSelectionView ? "w-20" : "w-40";
    let style = [
      cardWidth,
      "h-20 shrink-0 border bg-card text-card-foreground shadow-sm",
      "text-center flex items-center justify-center rounded-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600",
      "disabled:opacity-100",
    ].join(" ");

    if (isLeftCard) style += " rounded-l-lg";
    if (isRightCard) style += " rounded-r-lg";

    if (seatNumber === ERROR_SEAT) {
      return `${style} cursor-not-allowed`;
    }

    if (isSelectionView && !isEditMode && seatData?.seat) {
      return `${style} bg-gray-300 cursor-not-allowed`;
    }

    if (!isSelectionView && isAuthenticated && !seatData?.seat) {
      return `${style} cursor-default`;
    }

    if (currentSelectedSeat === seatNumber) {
      return `${style} bg-yellow-300 hover:bg-yellow-400 text-white cursor-pointer`;
    }

    return `${style} hover:bg-yellow-200 cursor-pointer`;
  };

  const getSeatLabel = (seatNumber: number) => {
    const seatData = getSeatData(seatNumber);

    if (seatNumber === ERROR_SEAT) return "사용할 수 없는 좌석";
    if (!seatData?.seat) {
      return isSelectionView
        ? `${seatNumber}번 빈 좌석`
        : `${seatNumber}번 빈 좌석, 회원가입 화면으로 이동`;
    }

    const participant = [seatData.userName, seatData.title]
      .filter(Boolean)
      .join(", ");
    return `${seatNumber}번 좌석${participant ? `, ${participant}` : ""}`;
  };

  const handleUrlNavigation = (rawUrl?: string) => {
    if (!rawUrl) return;
    try {
      const target = new URL(rawUrl, window.location.origin);
      if (!["http:", "https:"].includes(target.protocol)) return;

      if (target.origin === window.location.origin) {
        router.push(`${target.pathname}${target.search}${target.hash}`);
      } else {
        window.open(target.toString(), "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("유효하지 않은 공유 URL입니다:", error);
    }
  };

  const handleSeatClick = (seatNumber: number) => {
    if (isSeatDisabled(seatNumber)) return;

    const seatData = getSeatData(seatNumber);
    if (isSelectionView) {
      if (currentSelectedSeat !== seatNumber) onSeatChange?.(seatNumber);
      return;
    }

    if (!seatData?.seat) {
      router.push(`/sign-up?seat=${seatNumber}`);
      return;
    }

    handleUrlNavigation(seatData.url);
  };

  const renderSeatContent = (seatNumber: number) => {
    const seatData = getSeatData(seatNumber);

    if (!seatData?.seat || seatNumber === ERROR_SEAT) {
      return (
        <span className="text-xs">
          {seatNumber === ERROR_SEAT ? "Error" : seatNumber}
        </span>
      );
    }

    if (isSelectionView) {
      return (
        <span className="flex h-20 w-full items-center justify-center">
          {seatData.profileImage ? (
            <Image
              src={seatData.profileImage}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
              width={64}
              height={64}
            />
          ) : (
            <span className="h-16 w-16 rounded-full bg-white" aria-hidden="true" />
          )}
        </span>
      );
    }

    return (
      <span className="flex h-20 w-full items-center justify-between">
        {seatData.profileImage ? (
          <Image
            src={seatData.profileImage}
            alt=""
            className="ml-2 h-16 w-16 rounded-full object-cover"
            width={64}
            height={64}
          />
        ) : (
          <span
            className="ml-2 h-16 w-16 shrink-0 rounded-full bg-white"
            aria-hidden="true"
          />
        )}
        <span className="mr-2 flex min-w-0 flex-1 flex-col items-end justify-center gap-1">
          <span className="max-w-full truncate">{seatData.userName}</span>
          <span className="max-w-full truncate">
            {seatData.title || getSeatTitle(seatNumber)}
          </span>
        </span>
      </span>
    );
  };

  return (
    <div
      className="w-full overflow-x-auto pb-2"
      role="region"
      aria-label="30석 좌석 배치"
    >
      <div className="flex min-w-max flex-col gap-2">
        {ROW_NUMBERS.map((rowNumber) => (
          <div key={rowNumber} className="flex gap-5">
            {PAIR_STARTS.map((pairStart) => (
              <div key={pairStart} className="flex">
                {[pairStart, pairStart + 1].map((offset, index) => {
                  const seatNumber = rowNumber * 6 + offset;
                  return (
                    <button
                      key={seatNumber}
                      type="button"
                      className={getSeatStyle(
                        seatNumber,
                        index === 0,
                        index === 1,
                      )}
                      disabled={isSeatDisabled(seatNumber)}
                      aria-label={getSeatLabel(seatNumber)}
                      aria-pressed={
                        isSelectionView
                          ? currentSelectedSeat === seatNumber
                          : undefined
                      }
                      onClick={() => handleSeatClick(seatNumber)}
                    >
                      {renderSeatContent(seatNumber)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
