/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-06 10:30:33
 * @Description: 上下文提供者
 */
"use client"
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { Toast } from '@heroui/react';
import { MotionConfig } from 'motion/react';
import { type FC, type PropsWithChildren, ViewTransition } from 'react';

import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAvailableHeight } from '@/hooks/use-available-height';

const Providers: FC<PropsWithChildren> = ({ children }) => {
  // 计算主体内容高度
  const mainHeight = useAvailableHeight({
    elementIds: ['header', 'footer'],
    debounceMs: 0,
  });
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider
        color="var(--accent)"
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
        <Toast.Provider placement='top' />
        <BackTop />
      </ProgressProvider>
    </MotionConfig>
  );
};
export default Providers;