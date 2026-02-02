import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 修改网站
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
      .from('ds_websites')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === '23505') {
        return NextResponse.json(responseMessage(null, '网站名称已存在！', -1));
      }

      // 其他错误
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR));
    }

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}

/**
 * @description: 删除网站
 * @param {Request} request
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    const { id: siteId } = await params;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        responseMessage(null, '未登录', -1)
      );
    }

    const uid = user.id;
    const bucket = 'logos';
    const folderPath = `${uid}/${siteId}`;

    /* --------------------------------------------------
     * 1. 列出该站点下所有 logo 文件
     * -------------------------------------------------- */
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: 100,
      });

    if (listError) {
      return NextResponse.json(
        responseMessage(null, listError.message, RESPONSE.ERROR)
      );
    }

    /* --------------------------------------------------
     * 2. 删除所有文件（如果存在）
     * -------------------------------------------------- */
    if (files && files.length > 0) {
      const paths = files.map(
        (file) => `${folderPath}/${file.name}`
      );

      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (removeError) {
        return NextResponse.json(
          responseMessage(
            null,
            `删除 Logo 失败：${removeError.message}`,
            RESPONSE.ERROR
          )
        );
      }
    }

    /* --------------------------------------------------
     * 3. 删除数据库中的网站记录
     * -------------------------------------------------- */
    const { data, error } = await supabase
      .from('ds_websites')
      .delete()
      .eq('id', siteId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR)
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(
      responseMessage(null, (err as Error).message, RESPONSE.ERROR)
    );
  }
}
