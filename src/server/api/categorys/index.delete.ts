/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-13 13:39:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-13 13:43:03
 * @Description: 删除网站分类
 */
import type { Response, CategoryEdit, CategoryList } from '~/types'
import { serverSupabaseClient } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/enum'

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

  // 插入数据
  const { error } = await client.from('categorys').delete().eq('id', id)

  // 判断请求结果
  if (error) {
    throw createError({
      statusCode: RESPONSE_STATUS_CODE.FAIL,
      statusMessage: error.message
    })
  }

  // 请求成功
  return {
    code: RESPONSE_STATUS_CODE.SUCCESS,
    msg: '请求成功'
  }
})
