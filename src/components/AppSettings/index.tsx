"use client"
import { Check, Sparkles, Xmark } from '@gravity-ui/icons';
import { Button, Popover, Switch, Tooltip } from '@heroui/react';
import { type FC } from 'react';
import { useShallow } from "zustand/react/shallow";

import { TRANSITION_DIRECTION } from '@/enums'
import { pick } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

type SwitchComponentProps = {
  title: string;
  isSelected: boolean;
  setSelected: (value: boolean) => void;
};

// 渲染 Switch 开关
const SwitchComponent: FC<SwitchComponentProps> = ({ title, isSelected, setSelected }) => (
  <div className="flex justify-between items-center">
    <span className="font-black">{title}</span>
    <Switch isSelected={isSelected} onChange={setSelected}>
      {({ isSelected }) => (
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Icon>
              {isSelected ? (
                <Check className="size-3 text-inherit opacity-100" />
              ) : (
                <Xmark className="size-3 text-inherit opacity-70" />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      )}
    </Switch>
  </div>
)

const AppSettings: FC = () => {
  const {
    direction,
    setDirection,
    themeEffect,
    setThemeEffect,
    fixedHeader,
    setFixedHeader,
    cursorEffect,
    setCursorEffect,
    bgEffect,
    setBgEffect,
  } = useAppStore(
    useShallow((s) => pick(s, [
      "direction",
      "setDirection",
      'themeEffect',
      'setThemeEffect',
      'fixedHeader',
      'setFixedHeader',
      'cursorEffect',
      'setCursorEffect',
      'bgEffect',
      'setBgEffect'
    ])
    ));
  return (
    <Popover>
      <Tooltip>
        <Button
          aria-label="AppSettings"
          variant="outline"
          size='sm'
          className="size-8 rounded-full"
        >
          <Sparkles />
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          主题设置
        </Tooltip.Content>
      </Tooltip>
      <Popover.Content className="w-85 md:w-100">
        <Popover.Arrow />
        <Popover.Dialog>
          <Popover.Heading />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-sm">过渡动画方向</h1>
              <div className="grid grid-cols-4 gap-2">
                {TRANSITION_DIRECTION.items.map(({ value, label, raw }) => (
                  <Button
                    size="sm"
                    aria-label="过渡动画方向"
                    variant={direction === value ? "primary" : "outline"}
                    key={value}
                    className="text-xs"
                    onClick={() => setDirection(value)}
                  >
                    {raw.icon}
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <SwitchComponent title='主题动画' isSelected={themeEffect} setSelected={setThemeEffect} />
            <SwitchComponent title='固定头部' isSelected={fixedHeader} setSelected={setFixedHeader} />
            <SwitchComponent title='鼠标特效' isSelected={cursorEffect} setSelected={setCursorEffect} />
            <SwitchComponent title='背景动画' isSelected={bgEffect} setSelected={setBgEffect} />
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
export default AppSettings;