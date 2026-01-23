/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-17 10:14:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-24 10:12:45
 * @Description: 请求进度条
 */
import { BProgress } from '@bprogress/core';

let requestCount = 0;

let timer: NodeJS.Timeout;
export const startLoading = () => {
  if (requestCount === 0) {
    timer = setTimeout(() => BProgress.start(), 200);
  }
  requestCount++;
};

export const finishLoading = () => {
  requestCount = Math.max(0, requestCount - 1);
  if (requestCount === 0) {
    clearTimeout(timer);
    BProgress.done();
  }
};