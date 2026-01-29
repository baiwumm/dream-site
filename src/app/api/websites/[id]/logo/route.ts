import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 上传网站 Logo
 * @param {Request} request
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    // 获取动态参数
    const { id } = await params;
    // 解析请求体
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        responseMessage(null, '缺少 file 参数', -1)
      )
    }

    // 获取用户信息
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        responseMessage(null, '未登录', -1)
      )
    }

    // 文件路径
    const logoPath = `${user.id}/${id}`

    // 上传 logo
    const { error: uploadError } = await supabase.storage.from('logos').upload(logoPath, file, {
      upsert: false, // 允许覆盖文件
    })
    if (uploadError) {
      // ❗兜底：logo 失败，站点已创建，但不影响使用
      return NextResponse.json(
        responseMessage(
          { id },
          `站点创建成功，但 Logo 上传失败: ${uploadError}`,
          -1
        )
      )
    }

    // 4️⃣ 回写 logo_path
    const { data, error: updateError } = await supabase
      .from('ds_websites')
      .update({ logo: logoPath })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      // ❗兜底：回滚 Storage
      await supabase.storage
        .from('logos')
        .remove([logoPath])

      return NextResponse.json(
        responseMessage(null, updateError.message, -1)
      )
    }

    return NextResponse.json(responseMessage(data))
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}