/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 17:23:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 15:10:12
 * @Description: 路由加载 Loading
 */
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-80">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" variant='infinite' />
        <span className="text-sm font-bold">加载中...</span>
      </div>
    </div>
  );
}