/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 16:24:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 14:38:55
 * @Description: 代理层
 */
import { NextRequest } from 'next/server'

import { updateSession } from "@/lib/supabase/proxy"

export default async function proxy(request: NextRequest) {
  return await updateSession(request)
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - _next (Next.js 内部文件)
     * - 静态资源 (如 .css, .png)
     * - API 路由 (可选，但通常不需要保护)
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js|json|xml|txt|md|png|jpg|jpeg|gif|webp|avif|ico|bmp|svg|tiff|tif|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf|otf|webmanifest)$).*)',
  ],
}