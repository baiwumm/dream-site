/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-13 13:39:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-18 14:15:00
 * @Description: 删除网站分类
 */
import type { Response, CategoryEdit, CategoryList } from '~/lib/type'
import { serverSupabaseClient } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'

export default defineEventHandler(async (event): Promise<Response<CategoryList[]>> => {
  const client = await serverSupabaseClient<CategoryList>(event)
  // 得到请求体
  const { id }: CategoryEdit = await readBody(event)

  if (!id) {
    return {
      code: RESPONSE_STATUS_CODE.FAIL,
      msg: 'id不能为空!'
    }
  }

  // 删除数据
  const { error } = await client.from('ds_categorys').delete().eq('id', id)

  // 判断请求结果
  if (error) {
    // 23503 是 PostgreSQL 的 waiting_resource_violation 错误码，表示外键约束被违反。
    if (error.code === '23503') {
      return {
        code: RESPONSE_STATUS_CODE.FAIL,
        msg: '该网站分类存在子站点，请删除全部站点后，再来删除！'
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
    msg: '请求成功'
  }
})
