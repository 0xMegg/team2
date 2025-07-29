"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const EssayAnswerTextarea = ({ value, onChange }: Props) => (
  <Textarea
    placeholder="긴 서술형 답변"
    className="min-h-[100px]"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default EssayAnswerTextarea;
