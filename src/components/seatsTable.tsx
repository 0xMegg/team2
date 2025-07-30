import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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

export const titles: string[] = [
  "코드초심자",
  "개발기린이",
  "알고첫걸음",
  "버그탐험가",
  "함수탐색자",
  "자바입문자",
  "파이썬초보",
  "클래스유망주",
  "변수탐구자",
  "자료열정가",
  "객체연구생",
  "프로젝토끼",
  "스택연습생",
  "큐초석자리",
  "반복먼길이",
  "네트속초보",
  "깃첫커밋",
  "배열새싹이",
  "습득프로토",
  "웹초보연금",
  "피드백바다",
  "디버그유령",
  "로직씨앗",
  "화면설계자",
  "알고밭지기",
  "소스승급생",
  "자료도전자",
  "신입코더즈",
  "프론트마린",
  "백엔드수련",
  "기능준비생",
  "모듈찾기면",
  "꿈꾸는포인터",
  "스크립트손",
  "인터페이서",
  "새벽해커스",
  "뉴코드몽키",
  "퀘스트헌터",
  "유닛신입생",
  "기초블록스",
  "성장노드들",
  "연습코더링",
  "오류발굴단",
  "정렬타자기",
  "코드조각사",
  "패턴탐험대",
  "루프법사들",
  "로딩세대원",
  "학원신입들",
  "실습응시생",
  "Code Novice",
  "Dev Beginner",
  "Algo Starter",
  "Bug Explorer",
  "Function Seeker",
  "Java Learner",
  "Python Rookie",
  "Class Hopeful",
  "Variable Finder",
  "Data Enthusiast",
  "Object Trainee",
  "Project Rabbit",
  "Stack Trainee",
  "Queue Starter",
  "Loop Walker",
  "Net Beginner",
  "First Commit",
  "Array Sprout",
  "Proto Learner",
  "Web Newbie",
  "Feedback Diver",
  "Debug Ghost",
  "Logic Seed",
  "UI Planner",
  "Algo Keeper",
  "Source Upgrader",
  "Data Challenger",
  "Rookie Coders",
  "Frontline Coder",
  "Backend Intern",
  "Feature Novice",
  "Module Hunter",
  "Dreaming Pointer",
  "Script Hand",
  "Interfacer",
  "Dawn Hackers",
  "New Codemonkey",
  "Quest Hunter",
  "Unit Intern",
  "Basic Blocks",
  "Growing Nodes",
  "Practicoder",
  "Bug Squad",
  "Sorting Typer",
  "Code Sculptor",
  "Pattern Scout",
  "Loop Wizard",
  "Loading Member",
  "Academy Newbie",
  "Lab Attender",
];

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

  const getCardStyle = (
    seatNumber: number,
    isLeftCard: boolean = false,
    isRightCard: boolean = false
  ) => {
    const seatData = getSeatData(seatNumber);
    const isOccupied = seatData && seatData.profileImage;
    const isClickable = onSeatChange !== undefined;

    let baseStyle =
      "w-40 h-20 text-center flex flex-col items-center justify-center rounded-none";

    // radius 적용
    if (isLeftCard) {
      baseStyle += " rounded-l-lg";
    } else if (isRightCard) {
      baseStyle += " rounded-r-lg";
    }

    if (currentSelectedSeat === seatNumber) {
      return `${baseStyle} bg-yellow-300 hover:bg-yellow-400 text-white`;
    } else if (isOccupied) {
      return `${baseStyle}`;
    } else {
      return `${baseStyle} ${
        isClickable ? "hover:bg-yellow-200 cursor-pointer" : "cursor-default"
      }`;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {rowNumbers.map((rowNumber) => (
        <div key={rowNumber} className="flex gap-5">
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 1, true, false)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 1) : undefined
              }
            >
              {getSeatData(rowNumber * 6 + 1)?.profileImage ? (
                <div className="w-full h-20 flex items-center justify-between">
                  <img
                    src={getSeatData(rowNumber * 6 + 1)?.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full ml-2"
                  />
                  <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                    <p>{getSeatData(rowNumber * 6 + 1)?.userName}</p>
                    <Button variant="outline" className="w-18 h-8">
                      프로필 작성
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs">{rowNumber * 6 + 1}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 2, false, true)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 2) : undefined
              }
            >
              {getSeatData(rowNumber * 6 + 2)?.profileImage ? (
                <div className="w-full h-20 flex items-center justify-between">
                  <img
                    src={getSeatData(rowNumber * 6 + 2)?.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full ml-2"
                  />
                  <div className="w-full flex flex-col items-end justify-center gap-1 mr-2">
                    <p>{getSeatData(rowNumber * 6 + 2)?.userName}</p>
                  </div>
                </div>
              ) : (
                <div className="text-xs">{rowNumber * 6 + 2}</div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 3, true, false)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 3) : undefined
              }
            >
              {getSeatData(rowNumber * 6 + 3)?.profileImage ? (
                <img
                  src={getSeatData(rowNumber * 6 + 4)?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs">{rowNumber * 6 + 3}</div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 4, false, true)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 4) : undefined
              }
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
              className={getCardStyle(rowNumber * 6 + 5, true, false)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 5) : undefined
              }
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
              className={getCardStyle(rowNumber * 6 + 6, false, true)}
              onClick={
                onSeatChange ? () => onClick(rowNumber * 6 + 6) : undefined
              }
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
