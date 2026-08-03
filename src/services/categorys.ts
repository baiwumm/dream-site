/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 17:04:39
 * @Description: 网站分类模块
 */
import { httpRequest } from '@/lib/request'

const BASE_URL = '/categorys'

/**
 * @description: 新增分类
 */
export function addCategory(params: App.CategorySaveParams) {
  return httpRequest.post<App.Category>(BASE_URL, params)
}

/**
 * @description: 删除分类
 */
export function delCategory(id: string) {
  return httpRequest.delete<App.Category>(`${BASE_URL}/${id}`)
}

/**
 * @description: 获取网站分类列表
 */
export function getCategorysList(params: App.CategoryQueryParams) {
  return httpRequest.get<App.PaginatingResponse<App.Category>>(BASE_URL, params)
}

/**
 * @description: 更新分类
 */
export function updateCategory({ id, ...params }: App.CategorySaveParams) {
  return httpRequest.put<App.Category>(`${BASE_URL}/${id}`, params)
}
