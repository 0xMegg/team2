import Image from "next/image";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { getRandomSeatTitle } from "@/lib/constants";
import { supabase } from "@/utils/client";
import { useAuthStore } from "@/stores/auth";

interface SeatData {
  id: number;
  seat: number;
  userName: string;
  title?: string;
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
  const { isAuthenticated } = useAuthStore();
  const rowNumbers = [0, 1, 2, 3, 4];
  const errorSeat = 4;

  // 회원가입 페이지에서는 seat prop을 사용, 랜딩 페이지에서는 selectedSeat prop을 사용
  const currentSelectedSeat = selectedSeat !== undefined ? selectedSeat : seat;

  const onClick = async (seatNumber: number) => {
    // 4번 좌석은 클릭 불가
    if (seatNumber === errorSeat) {
      return;
    }

    // 이미 가입된 좌석인지 확인
    const seatData = getSeatData(seatNumber);

    // 회원가입 페이지에서만 이미 가입된 좌석 선택 불가
    if (onSeatChange && seatData && seatData.seat) {
      // 이미 가입된 좌석은 선택 불가
      return;
    }

    // 회원가입 페이지에서 사용하는 경우
    if (onSeatChange && currentSelectedSeat !== seatNumber) {
      onSeatChange(seatNumber);
    }

    // 랜딩 페이지에서 사용하는 경우
    if (!onSeatChange) {
      if (!seatData || !seatData.seat) {
        // 빈 좌석 클릭
        if (isAuthenticated) {
          // 로그인된 상태에서 빈 좌석 클릭 시 동작 없음
          return;
        } else {
          // 로그인되지 않은 상태에서 빈 좌석 클릭 시 sign-in 페이지로 이동
          router.push(`/sign-in?redirect=/result/${seatNumber}`);
        }
      } else {
        // 데이터가 있는 좌석 클릭
        if (isAuthenticated) {
          // 로그인된 상태
          try {
            // 현재 로그인된 사용자 정보 가져오기
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
              console.error("사용자 정보를 찾을 수 없습니다");
              return;
            }

            // 해당 좌석의 사용자 ID 가져오기
            const { data: seatUserData, error: seatError } = await supabase
              .from("userInfo")
              .select("id")
              .eq("seat", seatNumber)
              .single();

            if (seatError || !seatUserData) {
              console.error("좌석 정보를 찾을 수 없습니다:", seatError);
              return;
            }

            // 해당 좌석이 현재 사용자의 좌석인지 확인
            if (seatUserData.id === user.id) {
              // 내 좌석 클릭 시 내 userInfo에서 url 가져와서 이동
              await handleUrlNavigation(seatNumber);
            } else {
              // 남의 좌석 클릭 시 해당 유저의 userInfo에서 url 가져와서 이동
              await handleUrlNavigation(seatNumber);
            }
          } catch (error) {
            console.error("좌석 클릭 처리 중 오류 발생:", error);
          }
        } else {
          // 로그인되지 않은 상태에서 데이터가 있는 좌석 클릭 시 해당 유저의 url로 이동
          await handleUrlNavigation(seatNumber);
        }
      }
    }
  };

  // URL 처리 함수
  const handleUrlNavigation = async (seatNumber: number) => {
    try {
      const { data: userInfoData, error: userInfoError } = await supabase
        .from("userInfo")
        .select("url")
        .eq("seat", seatNumber)
        .single();

      if (userInfoError || !userInfoData) {
        console.error("사용자 정보를 찾을 수 없습니다:", userInfoError);
        // url 정보가 없으면 기본적으로 /result/${seatNumber}로 이동
        router.push(`/result/${seatNumber}`);
        return;
      }

      // url이 있는 경우 해당 URL로 이동
      if (userInfoData.url) {
        // 외부 URL인지 확인 (http:// 또는 https://로 시작하는지)
        if (
          userInfoData.url.startsWith("http://") ||
          userInfoData.url.startsWith("https://")
        ) {
          // 외부 URL인 경우 새 탭에서 열기
          window.open(userInfoData.url, "_blank");
        } else {
          // 내부 경로인 경우 같은 탭에서 이동
          router.push(userInfoData.url);
        }
      } else {
        // url이 없는 경우 기본적으로 /result/${seatNumber}로 이동
        router.push(`/result/${seatNumber}`);
      }
    } catch (error) {
      console.error("URL 정보 가져오기 중 오류 발생:", error);
      // 오류 발생 시 기본적으로 /result/${seatNumber}로 이동
      router.push(`/result/${seatNumber}`);
    }
  };

  const getSeatData = (seatNumber: number) => {
    // 4번 좌석은 특별히 "Error"라는 title을 가진 데이터 반환
    if (seatNumber === 4) {
      return {
        seat: 4,
        title: "Error",
        userName: "",
        profileImage: null,
      };
    }
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

    // 4번 좌석은 클릭 불가
    if (seatNumber === 4) {
      return `${baseStyle} cursor-not-allowed`;
    }

    // 이미 가입된 좌석인 경우 (회원가입 페이지에서만 회색 배경 적용)
    if (seatData && seatData.seat && onSeatChange) {
      return `${baseStyle} bg-gray-300 cursor-not-allowed`;
    }

    // 로그인된 상태에서 빈 좌석인 경우 커서 스타일만 변경하고 hover 효과는 유지
    if (!onSeatChange && isAuthenticated && (!seatData || !seatData.seat)) {
      return `${baseStyle} hover:bg-yellow-200 cursor-default`;
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
              {getSeatData(rowNumber * 6 + 1)?.seat &&
              getSeatData(rowNumber * 6 + 1)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 1)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 1)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 1)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 1)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 1)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 1)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 1)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 1}
                </div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 2, false, true)}
              onClick={() => onClick(rowNumber * 6 + 2)}
            >
              {getSeatData(rowNumber * 6 + 2)?.seat &&
              getSeatData(rowNumber * 6 + 2)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 2)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 2)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 2)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 2)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 2)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 2)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 2)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 2}
                </div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 3, true, false)}
              onClick={() => onClick(rowNumber * 6 + 3)}
            >
              {getSeatData(rowNumber * 6 + 3)?.seat &&
              getSeatData(rowNumber * 6 + 3)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 3)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 3)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 3)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 3)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 3)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 3)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 3)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 3}
                </div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 4, false, true)}
              onClick={() => onClick(rowNumber * 6 + 4)}
            >
              {getSeatData(rowNumber * 6 + 4)?.seat &&
              getSeatData(rowNumber * 6 + 4)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 4)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 4)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 4)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 4)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 4)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 4)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 4)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 4}
                </div>
              )}
            </Card>
          </div>
          <div className="flex">
            <Card
              className={getCardStyle(rowNumber * 6 + 5, true, false)}
              onClick={() => onClick(rowNumber * 6 + 5)}
            >
              {getSeatData(rowNumber * 6 + 5)?.seat &&
              getSeatData(rowNumber * 6 + 5)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 5)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 5)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 5)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 5)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 5)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 5)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 5)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 5}
                </div>
              )}
            </Card>
            <Card
              className={getCardStyle(rowNumber * 6 + 6, false, true)}
              onClick={() => onClick(rowNumber * 6 + 6)}
            >
              {getSeatData(rowNumber * 6 + 6)?.seat &&
              getSeatData(rowNumber * 6 + 6)?.seat !== 4 ? (
                onSeatChange ? (
                  // 회원가입 페이지: profileImage만 표시
                  <div className="w-full h-20 flex items-center justify-center">
                    {getSeatData(rowNumber * 6 + 6)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 6)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"></div>
                    )}
                  </div>
                ) : (
                  // 랜딩 페이지: username과 title 표시
                  <div className="w-full h-20 flex items-center justify-between">
                    {getSeatData(rowNumber * 6 + 6)?.profileImage ? (
                      <Image
                        src={getSeatData(rowNumber * 6 + 6)?.profileImage || ""}
                        alt="Profile"
                        className="w-16 h-16 rounded-full ml-2"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center ml-2"></div>
                    )}
                    <div className="w-full flex flex-col items-end justify-center gap- mr-2">
                      <p className="min-h-[1.25rem]">
                        {getSeatData(rowNumber * 6 + 6)?.userName || ""}
                      </p>
                      <p>
                        {getSeatData(rowNumber * 6 + 6)?.title ||
                          getRandomSeatTitle()}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-xs">
                  {getSeatData(rowNumber * 6 + 6)?.seat === 4
                    ? "Error"
                    : rowNumber * 6 + 6}
                </div>
              )}
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
