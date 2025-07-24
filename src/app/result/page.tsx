import MainPartComponent from "@/components/main-part";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function result() {
  return (
    <div>
      <div className="flex flex-col min-h-[100%-54px] w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
        <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border items-center">
          <h1>결과 보러왔구나?</h1>
        </div>
      </div>
    </div>
  );
}
