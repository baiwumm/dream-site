/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 14:14:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 10:34:08
 * @Description: 全局 Loading
 */
"use client"
import { Spinner } from "@heroui/react";
import { type FC, type ReactNode, useEffect, useState } from 'react';

type FullLoadingProps = {
  children: ReactNode;
}

const FullLoading: FC<FullLoadingProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return (
      <div className="fixed inset-0 flex w-screen h-screen justify-center items-center flex-col z-999 overflow-hidden bg-accent-foreground">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-xs text-muted font-bold">加载中...</span>
        </div>
      </div>
    );
  }
  return children
};
export default FullLoading;