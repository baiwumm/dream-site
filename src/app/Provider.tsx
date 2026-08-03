/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-03 16:56:58
 * @Description: 上下文提供者
 */
'use client'
import { AppProgressProvider as ProgressProvider } from '@bprogress/next'
import { ViewTransition } from 'react'

import BackTop from '@/components/BackTop'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProgressBridge from '@/components/ProgressBridge'

import type { FC, PropsWithChildren } from 'react'

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProgressProvider color="var(--accent)" options={{ showSpinner: true }} shallowRouting>
      <ProgressBridge />
      {/* 顶部 */}
      <Header />
      {/* 主体内容 */}
      <ViewTransition name="blur-slide">
        <main className="flex-1 min-h-0 container mx-auto p-4 flex flex-col gap-4">
          {children}
        </main>
      </ViewTransition>
      {/* 底部版权 */}
      <Footer />
      <BackTop />
    </ProgressProvider>
  )
}
export default Providers
