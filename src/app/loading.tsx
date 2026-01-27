/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 17:23:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 15:49:01
 * @Description: 路由加载 Loading
 */
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-80">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <span className="text-sm font-bold text-muted">加载中...</span>
      </div>
    </div>
  );
}