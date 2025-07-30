import Image from "next/image";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { getRandomSeatTitle } from "@/lib/constants";

interface SeatData {
  id: number;
  seat: number;
  userName: string;
  profileImage?: string;
  // 다른 필요한 필드들도 추가할 수 있습니다
}

interface SeatsTableProps {
  // 회원가입 페이지용 props (기존)
  seat?: number;
  onSeatChange?: (seatNumber: number) => void;

  // 랜딩 페이지용 props (새로운)
  seatsData?: SeatData[];
  selectedSeat?: number;
}
export default function SeatsTable({
  seat,
  onSeatChange,
  seatsData = [],
  selectedSeat,
}: SeatsTableProps) {
  const router = useRouter();
  const rowNumbers = [0, 1, 2, 3, 4];

  // 회원가입 페이지에서는 seat prop을 사용, 랜딩 페이지에서는 selectedSeat prop을 사용
  const currentSelectedSeat = selectedSeat !== undefined ? selectedSeat : seat;

  const onClick = (seatNumber: number) => {
    // 이미 가입된 좌석인지 확인
    const seatData = getSeatData(seatNumber);

    // 회원가입 페이지에서만 이미 가입된 좌석 선택 불가
    if (onSeatChange && seatData && seatData.profileImage) {
      // 이미 가입된 좌석은 선택 불가
      return;
    }

    // 회원가입 페이지에서 사용하는 경우
    if (onSeatChange && currentSelectedSeat !== seatNumber) {
      onSeatChange(seatNumber);
    }

    // 랜딩 페이지에서 사용하는 경우
    if (!onSeatChange) {
      if (!seatData || !seatData.profileImage) {
        // 사용자 데이터가 없는 좌석을 클릭했을 때 sign-up 페이지로 이동
        router.push(`/sign-up?seat=${seatNumber}`);
      } else {
        // 사용자 데이터가 있는 좌석을 클릭했을 때 result 페이지로 이동
        router.push(`/result/${seatNumber}`);
      }
    }
  };

  const getSeatData = (seatNumber: number) => {
    return seatsData.find((seat) => seat.seat === seatNumber);
  };

  const getCardStyle = (
    seatNumber: number,
    isLeftCard: boolean = false,
    isRightCard: boolean = false
  ) => {
    const seatData = getSeatData(seatNumber);

    // sign-up 페이지에서는 w-20, 랜딩 페이지에서는 w-40 사용
    const cardWidth = onSeatChange !== undefined ? "w-20" : "w-40";
    let baseStyle = `${cardWidth} h-20 text-center flex flex-col items-center justify-center rounded-none`;

    // radius 적용
    if (isLeftCard) {
      baseStyle += " rounded-l-lg";
    } else if (isRightCard) {
      baseStyle += " rounded-r-lg";
    }

    // 이미 가입된 좌석인 경우 (회원가입 페이지에서만 회색 배경 적용)
    if (seatData && seatData.profileImage && onSeatChange) {
      return `${baseStyle} bg-gray-300 cursor-not-allowed`;
    }

    if (currentSelectedSeat === seatNumber) {
      return `${baseStyle} bg-yellow-300 hover:bg-yellow-400 text-white`;
    } else {
      return `${baseStyle} ${"hover:bg-yellow-200 cursor-pointer"}`;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rowNumbers.map((rowNumber) => (
        <div key={rowNumber} className="flex gap-5">
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 1, true, false)}
              onClick={() => onClick(rowNumber * 6 + 1)}
            >
              {getSeatData(rowNumber * 6 + 1)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 1)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 1)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 1)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 1}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 2, false, true)}
              onClick={() => onClick(rowNumber * 6 + 2)}
            >
              {getSeatData(rowNumber * 6 + 2)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 2)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 2)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 2)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 2}</div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 3, true, false)}
              onClick={() => onClick(rowNumber * 6 + 3)}
            >
              {getSeatData(rowNumber * 6 + 3)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 3)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 3)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 3)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 3}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 4, false, true)}
              onClick={() => onClick(rowNumber * 6 + 4)}
            >
              {getSeatData(rowNumber * 6 + 4)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 4)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 4)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 4)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 4}</div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 5, true, false)}
              onClick={() => onClick(rowNumber * 6 + 5)}
            >
              {getSeatData(rowNumber * 6 + 5)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 5)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 5)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 5)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 5}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 6, false, true)}
              onClick={() => onClick(rowNumber * 6 + 6)}
            >
              {getSeatData(rowNumber * 6 + 6)?.profileImage ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    <Image
                      src={getSeatData(rowNumber * 6 + 6)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    <Image
                      src={getSeatData(rowNumber * 6 + 6)?.profileImage || ""}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ml-2"
                      width={64}
                      height={64}
                    />
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p>{getSeatData(rowNumber * 6 + 6)?.userName}</p>
                      <p>{getRandomSeatTitle()}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">{rowNumber * 6 + 6}</div>
              )}
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
