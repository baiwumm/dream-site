/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-06 10:14:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-14 15:17:24
 * @Description: 新增站点列表
 */
import type { Response, WebsiteEdit, WebsiteList } from '~/types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/enum'

export default defineEventHandler(async (event): Promise<Response<WebsiteList[]>> => {
  const client = await serverSupabaseClient<WebsiteList>(event)
  const user = await serverSupabaseUser(event)
  // 得到请求体
  const body: WebsiteEdit = await readBody(event)

  // 插入数据
  const { data, error } = await client
    .from('ds_websites')
    .insert({ ...body, email: user?.email })
    .select()

  // 判断请求结果
  if (error) {
    // 23505 是 PostgreSQL 的唯一性违反错误码
    if (error.code === '23505') {
      return {
        code: RESPONSE_STATUS_CODE.FAIL,
        msg: '站点名称已存在!'
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
