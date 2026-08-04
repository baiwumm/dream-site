import dayjs from 'dayjs'

import type { IResponse } from '@/types'

/**
 * @description: 请求状态
 */
export const RESPONSE = {
  SUCCESS: 200,
  ERROR: 500,
} as const

/**
 * @description: 统一返回体
 */
export function responseMessage(data: unknown, msg: string = '请求成功', code: number = RESPONSE.SUCCESS): IResponse {
  return { data, msg, code, timestamp: dayjs().valueOf() }
}

/**
 * @description: 判断请求是否成功
 */
export const isSuccess = (code?: number): boolean => code === RESPONSE.SUCCESS

/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 */
export function get<TDefault = unknown>(value: unknown, path: string, defaultValue?: TDefault): TDefault {
  const segments = path.split(/[.[\]]/g)
  let current: any = value
  for (const key of segments) {
    if (current === null)
      return defaultValue as TDefault
    if (current === undefined)
      return defaultValue as TDefault
    const dequoted = key.replace(/['"]/g, '')
    if (dequoted.trim() === '')
      continue
    current = current[dequoted]
  }
  if (current === undefined)
    return defaultValue as TDefault
  return current
}

/**
 * Pick a list of properties from an object
 * into a new object
 */
export function pick<T extends object, TKeys extends keyof T>(obj: T, keys: TKeys[]): Pick<T, TKeys> {
  if (!obj)
    return {} as Pick<T, TKeys>
  return keys.reduce((acc, key) => {
    if (Object.hasOwn(obj, key))
      acc[key] = obj[key]
    return acc
  }, {} as Pick<T, TKeys>)
}

// 生成 Logo 链接
export const generateLogoUrl = (path: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}/${path}`
