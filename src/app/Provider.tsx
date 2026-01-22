/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-22 16:41:50
 * @Description: 上下文提供者
 */
"use client"
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { MotionConfig } from 'motion/react';
import { useTheme } from "next-themes";
import { type FC, type PropsWithChildren, ViewTransition } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SplashCursor from '@/components/SplashCursor';
import Squares from '@/components/Squares';
import { Toaster } from '@/components/ui/sonner';
import { THEME_MODE } from '@/enums';
import { useAvailableHeight } from '@/hooks/use-available-height';

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === THEME_MODE.DARK;

  // 计算主体内容高度
  const mainHeight = useAvailableHeight({
    elementIds: ['header', 'footer'],
    debounceMs: 0,
  });
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider
        color="var(--primary)"
        options={{ showSpinner: true }}
        shallowRouting
      >
        {/* 顶部 */}
        <Header />
        {/* 主体内容 */}
        <ViewTransition name='blur-slide'>
          <main className="container mx-auto p-4 flex flex-col gap-4" style={{ minHeight: mainHeight }}>
            {children}
          </main>
        </ViewTransition>
        {/* 底部版权 */}
        <Footer />
        {/* 背景 */}
        <div className="fixed inset-0 -z-10">
          <Squares
            speed={0.2}
            squareSize={40}
            direction="diagonal"
            borderColor={isDark ? '#3A3A3A' : '#D1D1D1'}
            hoverFillColor={isDark ? '#2C2C2C' : '#B0B0B0'}
          />
        </div>
        {/* 鼠标动画 */}
        <SplashCursor />
        <Toaster position="top-center" />
      </ProgressProvider>
    </MotionConfig>
  );
};
export default Providers;