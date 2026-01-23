/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-03 09:09:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 13:57:27
 * @Description: OAuth 回调处理
 */
import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const supabase = await getSupabaseServerClient()
  if (code) {
    // 交换 code 获取 session
    await supabase.auth.exchangeCodeForSession(code)
  }
  // 默认跳转，或可从 query 获取
  return NextResponse.redirect(new URL('/', request.url))
}