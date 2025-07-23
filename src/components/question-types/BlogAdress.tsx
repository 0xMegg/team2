import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const ShortAnswerInput = () => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-3 ml-2">
      <Image src="/discord.svg" alt="discord adress" width={30} height={30} />
      <Input placeholder="짧은 주관식 답변" className="w-full h-10" />
    </div>
    <div className="flex gap-3 my-2 ml-2">
      <Image src="/github.svg" alt="github adress" width={30} height={30} />
      <Input placeholder="짧은 주관식 답변" className="w-full h-10" />
    </div>
    <div className="flex gap-3 ml-2">
      <Image
        src="/instagram.svg"
        alt="instagram adress"
        width={30}
        height={30}
      />
      <Input placeholder="짧은 주관식 답변" className="w-full h-10" />
    </div>
  </div>
);

export default ShortAnswerInput;
