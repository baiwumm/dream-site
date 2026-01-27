/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-13 17:03:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 10:01:05
 * @Description: 主题切换
 */
"use client";
import { Moon, Sun } from '@gravity-ui/icons';
import { Button, Tooltip } from '@heroui/react';
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from 'next-themes';
import { type FC } from "react";

import { THEME_MODE } from '@/enums';

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === THEME_MODE.DARK;

  // 是否支持 View Transition
  const enableTransitions = () =>
    "startViewTransition" in document &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  // View Transition + 主题切换
  async function toggleDark() {
    const root = document.documentElement;

    // 不支持动画，直接切
    if (!enableTransitions()) {
      const next = isDark ? THEME_MODE.LIGHT : THEME_MODE.DARK;
      setTheme(next);
      return;
    }

    // ⚠️ 关键：同步修改 DOM，View Transition 才能捕获
    await document.startViewTransition(() => {
      const next = root.classList.contains(THEME_MODE.DARK) ? THEME_MODE.LIGHT : THEME_MODE.DARK;
      setTheme(next); // React 状态同步 UI
      return next;
    }).ready;

    // 自定义过渡动画
    document.documentElement.animate(
      {
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  return (
    <>
      <Tooltip>
        <Button
          aria-label="ThemeSwitcher"
          variant="outline"
          size='sm'
          className="size-8 rounded-full"
          onPress={toggleDark}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Moon />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Sun />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          主题切换
        </Tooltip.Content>
      </Tooltip>
      {/* 禁用浏览器默认 View Transition 动画 */}
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
      `}</style>
    </>
  );
};

export default ThemeSwitcher;
