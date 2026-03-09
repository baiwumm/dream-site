/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 17:23:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 17:10:38
 * @Description: 路由加载 Loading
 */
import LoadingContent from '@/components/LoadingContent';

export default function Loading() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <LoadingContent />
    </div>
  );
}