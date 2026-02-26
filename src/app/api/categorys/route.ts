/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:08:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-29 14:48:12
 * @Description: 网站分类模块
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 查询分类列表
 * @param {Request} request
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const pageIndex = Number(searchParams.get('pageIndex') || '0');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const name = searchParams.get('name');

    // 判断参数
    if (
      Number.isNaN(pageIndex) ||
      Number.isNaN(pageSize) ||
      pageIndex < 0 ||
      pageSize <= 0
    ) {
      return NextResponse.json(responseMessage(null, '参数错误', RESPONSE.ERROR))
    }

    // 计算分页
    const start = pageIndex * pageSize;
    const end = start + pageSize - 1;

    // 查询 sql
    let sqlQuery = supabase
      .from('ds_categorys')
      .select('*,websites:ds_websites(*)', { count: 'exact' })
      .range(start, end)
      .order('sort', {
        ascending: false
      })
      .order('created_at', {
        ascending: false
      })

    // 判断查询参数
    if (name) {
      sqlQuery = sqlQuery.like('name', `%${name}%`)
    }

    // 请求列表
    const { data, error, count } = await sqlQuery

    // 执行失败
    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    if (data) {
      data.forEach((category: App.Category) => {
        category?.websites.sort((a, b) => {
          // 2. 再按 pinned 降序 (true 排在前面)
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1

          // 1. 先按 sort 降序 (b - a)
          if (b.sort !== a.sort) return b.sort - a.sort

          // 3. 然后按 recommend 降序 (true 排在前面)
          if (a.recommend !== b.recommend) return b.recommend ? 1 : -1

          // 4. 最后按 created_at 降序 (新日期在前)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      })
    }

    return NextResponse.json(responseMessage({
      list: data,
      total: count,
      page: pageIndex + 1,
      pageSize,
    }));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}

/**
 * @description: 新增分类
 * @param {Request} request
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析请求体
    const body = await request.json(); // 如果是 JSON 数据

    // 插入数据
    const { data, error } = await supabase.from('ds_categorys').insert(body).select().single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === '23505') {
        return NextResponse.json(responseMessage(null, '分类名称已存在！', -1));
      }

      // 其他错误
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR));
    }
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}