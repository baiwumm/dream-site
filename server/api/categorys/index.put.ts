/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-12 17:45:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-13 17:47:25
 * @Description: 更新分类列表
 */
import type { Response, CategoryEdit, CategoryList } from '~/lib/type'
import { serverSupabaseClient } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'

export default defineEventHandler(async (event): Promise<Response<CategoryList[]>> => {
  const client = await serverSupabaseClient<CategoryList>(event)
  // 得到请求体
  const { id, ...body }: CategoryEdit = await readBody(event)

  if (!id) {
    return {
      code: RESPONSE_STATUS_CODE.FAIL,
      msg: 'id不能为空!'
    }
  }

  // 插入数据
  const { data, error } = await client
    .from('ds_categorys')
    .update({ ...body, updated_at: new Date() })
    .eq('id', id)
    .select()

  // 判断请求结果
  if (error) {
    // 23505 是 PostgreSQL 的唯一性违反错误码
    if (error.code === '23505') {
      return {
        code: RESPONSE_STATUS_CODE.FAIL,
        msg: '分类名称已存在!'
      }
    } else {
      throw createError({
        statusCode: RESPONSE_STATUS_CODE.FAIL,
        statusMessage: error.message
      })
    }
  }

  // 请求成功
  return {
    code: RESPONSE_STATUS_CODE.SUCCESS,
    msg: '请求成功',
    data: data
  }
})
