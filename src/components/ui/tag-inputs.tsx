'use client'
import { CircleXmarkFill } from '@gravity-ui/icons'
import { Chip, Input, Label } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'

import type { FC, KeyboardEvent } from 'react'

interface TagInputsProps {
  value: string[]
  onChange: (value: string[]) => void
}

const MotionChip = motion.create(Chip)

const TagInputs: FC<TagInputsProps> = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addTag = (text: string) => {
    const val = text.trim()
    if (val && !value.includes(val)) {
      onChange?.([...value, val])
    }
    setInputValue('')
  }

  const removeTag = (text: string) => {
    onChange?.(value.filter(tag => tag !== text))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    }
    else if (e.key === 'Backspace' && inputValue === '' && value.length) {
      e.preventDefault()
      onChange?.(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="tags">标签</Label>
      <div
        className="flex flex-wrap items-center gap-2 px-2 py-2 border rounded-lg border-default bg-transparent"
      >
        <AnimatePresence>
          {value.map(tag => (
            <MotionChip
              key={tag}
              size="sm"
              variant="soft"
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(2px)', y: 10 }}
              initial={{ opacity: 0, filter: 'blur(2px)', y: 10 }}
              layout
              transition={{ duration: 0.2 }}
            >
              <Chip.Label>{tag}</Chip.Label>
              <CircleXmarkFill onClick={() => removeTag(tag)} className="cursor-pointer" />
            </MotionChip>
          ))}
        </AnimatePresence>
        <Input
          ref={inputRef}
          variant="secondary"
          placeholder="回车添加"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-25 text-xs py-1"
        />
      </div>
    </div>
  )
}
export default TagInputs
