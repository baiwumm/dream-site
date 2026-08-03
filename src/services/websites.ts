/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-03 17:24:18
 * @Description: 网站列表模块
 */
import { httpRequest } from '@/lib/request'

import type { PaginatingResponse, Website, WebsiteQueryParams, WebsiteSaveParams } from '@/types'

const BASE_URL = '/websites'

/**
 * @description: 新增网站
 */
export function addWebsite(params: WebsiteSaveParams) {
  return httpRequest.post<Website>(BASE_URL, params)
}

/**
 * @description: 删除网站
 */
export function delWebsite(id: string) {
  return httpRequest.delete<Website>(`${BASE_URL}/${id}`)
}

/**
 * @description: 获取网站列表
 */
export function getWebsitesList(params: WebsiteQueryParams) {
  return httpRequest.get<PaginatingResponse<Website>>(BASE_URL, params)
}

/**
 * @description: 更新网站
 */
export function updateWebsite({ id, ...params }: WebsiteSaveParams) {
  return httpRequest.put<Website>(`${BASE_URL}/${id}`, params)
}

/**
 * @description: 上传 Logo
 */
export function uploadLogo({ id, formData }: { id: string, formData: FormData }) {
  return httpRequest.put<Website>(`${BASE_URL}/${id}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
