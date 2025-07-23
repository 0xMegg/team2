import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2Icon, Copy, Image } from "lucide-react";

export default function QuestionBoxComponent() {
  return (
    <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border">
      {/* 질문 헤더 */}
      <div className="w-full flex justify-center gap-3">
        <Input placeholder="질문 제목" />
        <button className="flex flex-col justify-center">
          <Image className="w-4 h-4" />
        </button>
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="질문 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="est">객관식</SelectItem>
            <SelectItem value="cst">주관식</SelectItem>
            <SelectItem value="mst">서술형</SelectItem>
            <SelectItem value="pst">체크박스</SelectItem>
            <SelectItem value="akst">드롭박스</SelectItem>
            <SelectItem value="hst">파일 업로드</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 질문 내용 */}
      <div className="w-full my-3"></div>
      {/* 질문 푸터 */}
      <div className="w-full flex justify-end gap-3 px-5 my-1">
        <button>
          <Copy className="w-4 h-4" />
        </button>
        <button>
          <Trash2Icon className="w-4 h-4" />
        </button>
        <div className="px-3 flex items-center space-x-2 border-l border-gray-300">
          <Label htmlFor="required-switch">필수</Label>
          <Switch id="required-switch" />
        </div>
      </div>
    </div>
  );
}
