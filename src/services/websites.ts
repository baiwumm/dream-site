/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 17:23:13
 * @Description: 网站列表模块
 */
import { httpRequest } from '@/lib/request';

const BASE_URL = '/websites';

/**
 * @description: 获取网站列表
 */
export const getWebsitesList = (params: App.WebsiteQueryParams) => {
  return httpRequest.get<App.PaginatingResponse<App.Website>>(BASE_URL, params);
};

/**
 * @description: 新增网站
 */
export const addWebsite = (params: App.WebsiteSaveParams) => {
  return httpRequest.post<App.Website>(BASE_URL, params);
};

/**
 * @description: 更新网站
 */
export const updateWebsite = ({ id, ...params }: App.WebsiteSaveParams) => {
  return httpRequest.put<App.Website>(`${BASE_URL}/${id}`, params);
};

/**
 * @description: 删除网站
 */
export const delWebsite = (id: string) => {
  return httpRequest.delete<App.Website>(`${BASE_URL}/${id}`);
};