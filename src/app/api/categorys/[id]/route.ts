import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 修改分类
 * @param {Request} request
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    // 获取动态参数
    const { id } = await params;
    // 解析请求体
    const body = await request.json(); // 如果是 JSON 数据

    // 更新分类
    const { data, error } = await supabase
      .from('ds_categorys')
      .update(body)
      .eq('id', id);

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === '23505') {
        return NextResponse.json(responseMessage(null, '分类名称已存在！', -1));
      }

      // 其他错误
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR));
    }

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data ? data[0] : data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}

/**
 * @description: 删除分类
 * @param {Request} request
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    const { id } = await params;

    // 删除分类
    const { data, error } = await supabase
      .from('ds_categorys')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR));
    }

    // 返回成功响应
    return NextResponse.json(responseMessage(data ? data[0] : data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}