'use client';
import { VariantProps } from 'class-variance-authority';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { buttonVariants } from '@/components/animate-ui/components/buttons/icon';
import { RippleButton } from "@/components/animate-ui/components/buttons/ripple";
import {
  type Resolved,
  type ThemeSelection,
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
} from '@/components/animate-ui/primitives/effects/theme-toggler';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { THEME_MODE } from '@/enums';

const getNextTheme = (
  effective: ThemeSelection,
  modes: ThemeSelection[],
): ThemeSelection => {
  const i = modes.indexOf(effective);
  if (i === -1) return modes[0];
  return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    modes?: ThemeSelection[];
    onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
    direction?: ThemeTogglerPrimitiveProps['direction'];
  };

function ThemeTogglerButton({
  modes = ['light', 'dark'],
  direction = 'ltr',
  onImmediateChange,
  onClick,
  className,
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = theme === THEME_MODE.DARK;
  return (
    <ThemeTogglerPrimitive
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
      direction={direction}
      onImmediateChange={onImmediateChange}
    >
      {({ effective, toggleTheme }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <RippleButton
              aria-label="ThemeToggle"
              variant="outline"
              radius="full"
              mode="icon"
              size='sm'
              onClick={(e) => {
                onClick?.(e);
                toggleTheme(getNextTheme(effective, modes));
              }}
              className={className}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="text-neutral-800 dark:text-neutral-200"
                  >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="text-neutral-800 dark:text-neutral-200"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </RippleButton>
          </TooltipTrigger>
          <TooltipContent>主题模式</TooltipContent>
        </Tooltip>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
