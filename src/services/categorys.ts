/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-03 17:39:03
 * @Description: 网站分类模块
 */
import { httpRequest } from '@/lib/request'

import type { Category, CategoryQueryParams, CategorySaveParams, PaginatingResponse } from '@/types'

const BASE_URL = '/categorys'

/**
 * @description: 新增分类
 */
export function addCategory(params: CategorySaveParams) {
  return httpRequest.post<Category>(BASE_URL, params)
}

/**
 * @description: 删除分类
 */
export function delCategory(id: string) {
  return httpRequest.delete<Category>(`${BASE_URL}/${id}`)
}

/**
 * @description: 获取网站分类列表
 */
export function getCategoriesList(params: CategoryQueryParams) {
  return httpRequest.get<PaginatingResponse<Category>>(BASE_URL, params)
}

/**
 * @description: 更新分类
 */
export function updateCategory({ id, ...params }: CategorySaveParams) {
  return httpRequest.put<Category>(`${BASE_URL}/${id}`, params)
}
