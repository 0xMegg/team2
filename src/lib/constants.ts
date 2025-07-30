export const SEAT_TITLES: readonly string[] = [
  "코드초심자",
  "개발기린이",
  "알고첫걸음",
  "버그탐험가",
  "함수탐색자",
  "자바입문자",
  "파이썬초보",
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
] as const;

// 타입 안전성을 위한 타입 정의
export type SeatTitle = (typeof SEAT_TITLES)[number];

// 랜덤 좌석 타이틀 반환
export function getRandomSeatTitle(): SeatTitle {
  const randomIndex = Math.floor(Math.random() * SEAT_TITLES.length);
  return SEAT_TITLES[randomIndex];
}
