import { Card } from "./ui/card";

interface SeatsTableProps {
  seat: number;
  onSeatChange: (seatNumber: number) => void;
}

export default function SeatsTable({ seat, onSeatChange }: SeatsTableProps) {
  const rowNumbers = [0, 1, 2, 3, 4];

  const onClick = (seatNumber: number) => {
    if (seat !== seatNumber) {
      onSeatChange(seatNumber);
    }
  };

  const getCardStyle = (seatNumber: number) => {
    return seat === seatNumber
      ? "w-20 h-10 bg-yellow-300 hover:bg-yellow-400 text-white text-center"
      : "w-20 h-10  hover:bg-yellow-200 text-center";
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
              {rowNumber * 6 + 1}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 2)}
              onClick={() => onClick(rowNumber * 6 + 2)}
            >
              {rowNumber * 6 + 2}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 3)}
              onClick={() => onClick(rowNumber * 6 + 3)}
            >
              {rowNumber * 6 + 3}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 4)}
              onClick={() => onClick(rowNumber * 6 + 4)}
            >
              {rowNumber * 6 + 4}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 5)}
              onClick={() => onClick(rowNumber * 6 + 5)}
            >
              {rowNumber * 6 + 5}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 6)}
              onClick={() => onClick(rowNumber * 6 + 6)}
            >
              {rowNumber * 6 + 6}
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
