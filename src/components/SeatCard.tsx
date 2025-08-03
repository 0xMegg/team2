import Image from "next/image";
import { Card } from "./ui/card";

interface SeatCardProps {
  seatNumber: number;
  seatData?: {
    seat: number;
    userName: string;
    title?: string;
    profileImage?: string;
  };
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (seatNumber: number) => void;
  isSignUpMode?: boolean;
}

export default function SeatCard({
  seatNumber,
  seatData,
  isSelected,
  isDisabled,
  onClick,
  isSignUpMode = false,
}: SeatCardProps) {
  const getCardStyle = () => {
    let baseStyle =
      "w-20 h-20 text-center flex flex-col items-center justify-center rounded-none";

    if (isDisabled) {
      return `${baseStyle} cursor-not-allowed bg-gray-300`;
    }

    if (isSelected) {
      return `${baseStyle} bg-yellow-300 hover:bg-yellow-400 text-white`;
    }

    return `${baseStyle} hover:bg-yellow-200 cursor-pointer`;
  };

  const handleClick = () => {
    if (!isDisabled) {
      onClick(seatNumber);
    }
  };

  const renderContent = () => {
    if (seatData?.seat && seatData.seat !== 4) {
      if (isSignUpMode) {
        return (
          <div className="w-full h-20 flex items-center justify-center">
            {seatData.profileImage ? (
              <Image
                src={seatData.profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full"
                width={64}
                height={64}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center" />
            )}
          </div>
        );
      } else {
        return (
          <div className="w-full h-20 flex items-center justify-between">
            {seatData.profileImage ? (
              <Image
                src={seatData.profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full ml-2"
                width={64}
                height={64}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2" />
            )}
            <div className="w-full flex flex-col items-end justify-center gap-1 mr-2">
              <p className="min-h-[1.25rem] text-sm">
                {seatData.userName || ""}
              </p>
              <p className="text-xs">{seatData.title || ""}</p>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="text-xs">{seatNumber === 4 ? "Error" : seatNumber}</div>
      );
    }
  };

  return (
    <Card className={getCardStyle()} onClick={handleClick}>
      {renderContent()}
    </Card>
  );
}
