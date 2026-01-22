import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

import { RESPONSE } from '@/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description: 统一返回体
 */
export const responseMessage = (
  data: unknown,
  msg: string = RESPONSE.label(RESPONSE.SUCCESS),
  code: number = RESPONSE.SUCCESS,
): App.IResponse => ({ data, msg, code, timestamp: dayjs().valueOf() });
