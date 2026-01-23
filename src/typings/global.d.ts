declare namespace App {
  /** @description: 分页响应体 */
  type PaginatingResponse<T = unknown> = {
    total: number; // 总条数
    list: T[];
  } & import('@tanstack/react-table').PaginationState;

  /** @description: 响应体 */
  type IResponse<T = unknown> = {
    code: number; // 状态码
    data: T; // 数据
    msg: string; // 消息
    timestamp: number; // 时间戳
  };

  /** @description: 公共列 */
  type Columns = {
    id: string; // 主键
    user_id: string; // 登录用户 id
    emial: string; // 邮箱
    sort: number; // 排序
    created_at: string; // 创建时间
    updated_at: string; // 更新时间
  }

  /** @description: 网站列表 */
  type Website = Columns & {
    name: string; // 分类名称
    tags: string[] // 站点标签
    pinned: boolean // 是否置顶
    recommend: boolean // 是否推荐
    vpn: boolean // 是否需要 vpn
  }

  /** @description: 网站分类 */
  type Category = Columns & {
    name: string; // 分类名称
    websites: Website[]; // 网站列表
  }

  /** @description: 网站分类查询参数 */
  type CategoryQueryParams = PaginatingParams & Partial<Pick<Category, 'name'>>;

  /** @description: 网站分类表单 */
  type CategorySaveParams = Pick<Category, 'name', 'sort'>;
}