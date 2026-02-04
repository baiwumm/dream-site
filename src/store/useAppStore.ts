/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-04 10:21:36
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-04 11:11:38
 * @Description: 全局状态
 */
'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { TRANSITION_DIRECTION } from '@/enums'

type AppState = {
  /** 过渡动画方向 */
  direction: typeof TRANSITION_DIRECTION.valueType;
  setDirection: (val: typeof TRANSITION_DIRECTION.valueType) => void;
  /** 固定头部 */
  fixedHeader: boolean;
  setFixedHeader: (val: boolean) => void;
  /** 鼠标特效 */
  cursorEffect: boolean;
  setCursorEffect: (val: boolean) => void;
  /** 背景动画 */
  bgEffect: boolean;
  setBgEffect: (val: boolean) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      /* ================= 过渡动画方向 ================= */
      direction: TRANSITION_DIRECTION.LTR,
      setDirection: (val) => {
        set({ direction: val })
      },

      /* ================= 固定头部 ================= */
      fixedHeader: true,
      setFixedHeader: (val) => {
        set({ fixedHeader: val })
      },

      /* ================= 鼠标特效 ================= */
      cursorEffect: false,
      setCursorEffect: (val) => {
        set({ cursorEffect: val })
      },

      /* ================= 背景动画 ================= */
      bgEffect: true,
      setBgEffect: (val) => {
        set({ bgEffect: val })
      },
    }),
    {
      name: 'app-store', // 用于存储在 localStorage 中的键名
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage 存储
    }))