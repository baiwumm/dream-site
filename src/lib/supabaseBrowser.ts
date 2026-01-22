/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-10-31 18:11:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-03 10:57:12
 * @Description: supabase 客户端
 */
import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
