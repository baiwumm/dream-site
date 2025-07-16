/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-29 14:39:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-16 08:50:16
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

  if (data) {
    data.forEach((category: CategoryList) => {
      category?.ds_websites.sort((a, b) => {
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
