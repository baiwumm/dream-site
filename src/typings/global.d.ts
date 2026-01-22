declare namespace App {
  /** @description: 响应体 */
  type IResponse<T = unknown> = {
    code: number; // 状态码
    data: T; // 数据
    msg: string; // 消息
    timestamp: number; // 时间戳
  };
}