"use client";

import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const ShortAnswerInput = ({ value, onChange }: Props) => (
  <Input
    placeholder="짧은 주관식 답변"
    className="w-full h-10"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default ShortAnswerInput;
