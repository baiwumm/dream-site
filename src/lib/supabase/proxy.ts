import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

import { responseMessage } from '@/lib/utils'

import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const path = request.nextUrl.pathname
  const isApiRoute = path.startsWith('/api')
  const isWriteApiRoute = isApiRoute && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)

  // 首页直接放行
  if (path === '/') {
    return supabaseResponse
  }

  const url = request.nextUrl.clone()
  const code = url.searchParams.get('code')

  // ✅ 只要有 code，立刻清理并跳首页
  if (code) {
    url.searchParams.delete('code')
    return NextResponse.rewrite(url)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  if (user && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!user && isWriteApiRoute) {
    return NextResponse.json(
      responseMessage(null, '未登录', -1),
      { status: 401 },
    )
  }

  if (!user && !isApiRoute && !path.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}
