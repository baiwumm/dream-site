/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 17:23:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 16:15:32
 * @Description: 路由加载 Loading
 */
import { Description, Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <Description>加载中...</Description>
      </div>
    </div>
  );
}