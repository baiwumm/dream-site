/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-22 17:09:10
 * @Description: 上下文提供者
 */
"use client"
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { type FC, type PropsWithChildren, ViewTransition } from 'react';

import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProgressBridge from '@/components/ProgressBridge';
import { useAvailableHeight } from '@/hooks/use-available-height';

const Providers: FC<PropsWithChildren> = ({ children }) => {
  // 计算主体内容高度
  const mainHeight = useAvailableHeight({
    elementIds: ['header', 'footer'],
    debounceMs: 0,
  });
  return (
    <ProgressProvider color="var(--accent)" options={{ showSpinner: true }} shallowRouting>
      <ProgressBridge />
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
      <BackTop />
    </ProgressProvider>
  );
};
export default Providers;