/**
 * @description: 响应状态码
 */
export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200, // 请求成功
  FAIL = 400, // 请求失败
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 禁止访问
  NOT_FOUND = 404, // 请求资源不存在
  TIMEOUT = 408, // 请求超时
  SERVER_ERROR = 500, // 服务器异常
  SERVICE_UNAVAILABLE = 503, // 服务不可用
  GATEWAY_TIMEOUT = 504 // 网关超时
}
