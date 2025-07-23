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
    return seat === seatNumber ? "w-10 bg-blue-500 text-white" : "w-10";
  };

  return (
    <div className="flex flex-col gap-2">
      {rowNumbers.map((rowNumber) => (
        <div key={rowNumber} className="flex gap-2">
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
