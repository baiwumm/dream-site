/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:47:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 14:01:47
 * @Description: Axios 请求封装
 */
import { CircleXmarkFill } from '@gravity-ui/icons';
import { toast } from "@heroui/react";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import queryString from 'query-string';

import { finishLoading, startLoading } from './nprogress';

import { RESPONSE } from '@/enums';
import { get, isSuccess } from '@/lib/utils';

type Response<T = unknown> = App.IResponse<T>;
/**
 * @description: 创建 Axios 实例对象
 */
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30 * 1000, // 请求超时时间,默认30秒
});

/**
 * @description: 请求拦截器，主要在这里处理请求发送前的一些工作，比如给 HTTP Header 添加 token ，开启 Loading 效果，设置取消请求等
 * @param {InternalAxiosRequestConfig} config
 */
request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    startLoading();
    return config;
  },
  (error: AxiosError) => {
    toast.danger(error.message, {
      indicator: <CircleXmarkFill />,
      timeout: 3000
    })
    return Promise.reject(error);
  },
);

/**
 * @description: 响应拦截器
 * 根据自定义错误码判断请求是否成功，然后只将组件会用到的数据返回
 * 如果错误码判断请求失败，此时为业务错误，比如用户名不存在、登录信息失效等，在这里进行提示
 * 如果网络错误，则进入第二个回调函数中，根据不同的状态码设置不同的提示消息进行提示
 * @param {AxiosResponse} response
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    finishLoading();
    // 获取接口返回的结果
    const { code, msg } = response.data as Response;
    // 根据返回状态码，统一处理，需要前端和后端沟通确认
    // 配置 skipErrorHandler 会跳过默认的错误处理，用于项目中部分特殊的接口
    if (!isSuccess(code) && !get(response, 'config.skipErrorHandler', false)) {
      // 其它状态码统一提示错误信息
      toast.danger(msg || RESPONSE.label(1), {
        indicator: <CircleXmarkFill />,
        timeout: 3000
      })
    }
    return response.data;
  },
  (error: AxiosError) => {
    finishLoading();
    return Promise.reject(error);
  },
);

/**
 * @description: 导出封装的请求方法
 */
type HttpRequestConfig = AxiosRequestConfig & {
  skipErrorHandler?: boolean;
};
export const httpRequest = {
  get<T = unknown>(url: string, data?: object, config?: HttpRequestConfig): Promise<Response<T>> {
    const queryParams = queryString.stringify(data || {});
    return request.get(queryParams ? `${url}?${queryParams}` : url, config);
  },

  post<T = unknown>(url: string, data?: object, config?: HttpRequestConfig): Promise<Response<T>> {
    return request.post(url, data, config);
  },

  put<T = unknown>(url: string, data?: object, config?: HttpRequestConfig): Promise<Response<T>> {
    return request.put(url, data, config);
  },

  delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<Response<T>> {
    return request.delete(url, config);
  },
};

/**
 * @description: 导出axios实例
 */
export default request;