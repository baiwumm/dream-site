"use client";
import { Xmark } from "@gravity-ui/icons";
import { Button, Input, Label } from "@heroui/react";
import { AnimatePresence, motion } from 'motion/react';
import { type FC, KeyboardEvent, useRef, useState } from "react";

type TagInputsProps = {
  value: string[];
  onChange: (value: string[]) => void;
}

const MotionButton = motion.create(Button);

const TagInputs: FC<TagInputsProps> = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addTag = (text: string) => {
    const val = text.trim();
    if (val && !value.includes(val)) {
      onChange?.([...value, val]);
    }
    setInputValue("");
  };

  const removeTag = (text: string) => {
    onChange?.(value.filter((tag) => tag !== text));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length) {
      e.preventDefault();
      onChange?.(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="tags">标签</Label>
      <div
        className="flex flex-wrap items-center gap-2 px-2 py-2 border rounded-lg border-default bg-transparent"
      >
        <AnimatePresence>
          {value.map((tag) => (
            <motion.div
              key={tag}
              layout
              initial={{ opacity: 0, filter: 'blur(2px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(2px)', y: 10 }}
              transition={{ duration: 0.2, }}
              className="border border-default p-2 transition-all rounded-xl flex items-center gap-1 text-xs hover:bg-default"
            >
              <span>{tag}</span>
              <Xmark className="cursor-pointer relative z-10" onClick={() => removeTag(tag)} />
            </motion.div>
          ))}
        </AnimatePresence>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="回车添加"
          variant='secondary'
          className="w-25 text-xs"
        />
      </div>
    </div>
  );
}
export default TagInputs;
