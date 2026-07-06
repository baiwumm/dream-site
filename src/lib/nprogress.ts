/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-17 10:14:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-06 10:59:55
 * @Description: 请求进度条
 */
import { getProgress } from './progress'

let requestCount = 0;

let timer: ReturnType<typeof setTimeout>;
export const startLoading = () => {
  if (requestCount === 0) {
    timer = setTimeout(() => getProgress()?.start(), 200);
  }
  requestCount++;
};

export const finishLoading = () => {
  requestCount = Math.max(0, requestCount - 1);
  if (requestCount === 0) {
    clearTimeout(timer);
    getProgress()?.stop();
  }
};