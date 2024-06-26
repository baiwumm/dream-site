/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-29 14:39:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-06-17 17:45:24
 * @Description: 获取分类列表
 */
import type { Response, PageResponse, CategoryList, CategoryParams } from '~/types'
import { serverSupabaseClient } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/enum'

export default defineEventHandler(async (event): Promise<Response<PageResponse<CategoryList>>> => {
  const client = await serverSupabaseClient(event)
  // 获取请求参数
  const { current, pageSize, name } = getQuery(event) as CategoryParams
  // 判断参数
  if (!current || !pageSize) {
    return { code: RESPONSE_STATUS_CODE.FAIL, msg: '参数错误' }
  }

  // 计算分页
  const start = (current - 1) * pageSize
  const end = current * pageSize - 1

  // 查询 sql
  let sqlQuery = client
    .from('ds_categorys')
    .select('*,ds_websites(*)', { count: 'exact' })
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
    msg: '请求成功',
    data: {
      list: data,
      total: count
    }
  }
})
