import { Card } from "./ui/card";

interface SeatData {
  id: number;
  seat: number;
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
  const rowNumbers = [0, 1, 2, 3, 4];

  // 회원가입 페이지에서는 seat prop을 사용, 랜딩 페이지에서는 selectedSeat prop을 사용
  const currentSelectedSeat = selectedSeat !== undefined ? selectedSeat : seat;

  const onClick = (seatNumber: number) => {
    if (onSeatChange && currentSelectedSeat !== seatNumber) {
      onSeatChange(seatNumber);
    }
  };

  const getSeatData = (seatNumber: number) => {
    return seatsData.find((seat) => seat.seat === seatNumber);
  };

  const getCardStyle = (seatNumber: number) => {
    const seatData = getSeatData(seatNumber);
    const isOccupied = seatData && seatData.profileImage;

    if (currentSelectedSeat === seatNumber) {
      return "w-20 h-20 bg-yellow-300 hover:bg-yellow-400 text-white text-center flex flex-col items-center justify-center";
    } else if (isOccupied) {
      return "w-20 h-20 bg-green-200 text-center";
    } else {
      return "w-20 h-20 hover:bg-yellow-200 text-center flex flex-col items-center justify-center";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rowNumbers.map((rowNumber) => (
        <div key={rowNumber} className="flex gap-5">
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 1)}
              onClick={() => onClick(rowNumber * 6 + 1)}
            >
              {getSeatData(rowNumber * 6 + 1)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 1)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 1}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 2)}
              onClick={() => onClick(rowNumber * 6 + 2)}
            >
              {getSeatData(rowNumber * 6 + 2)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 2)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 2}</div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 3)}
              onClick={() => onClick(rowNumber * 6 + 3)}
            >
              {getSeatData(rowNumber * 6 + 3)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 3)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 3}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 4)}
              onClick={() => onClick(rowNumber * 6 + 4)}
            >
              {getSeatData(rowNumber * 6 + 4)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 4)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 4}</div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 5)}
              onClick={() => onClick(rowNumber * 6 + 5)}
            >
              {getSeatData(rowNumber * 6 + 5)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 5)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 5}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 6)}
              onClick={() => onClick(rowNumber * 6 + 6)}
            >
              {getSeatData(rowNumber * 6 + 6)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 6)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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
