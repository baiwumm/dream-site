import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const path = request.nextUrl.pathname;
  // 首页或者 Api 接口直接放行
  if (path === '/' || path.startsWith('/api/')) {
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
    }
  )

  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  if (user && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!user && !path.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}