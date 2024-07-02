import { RESPONSE_STATUS_CODE } from '~/enum'

/**
 * @description: 响应体结构
 */
export type Response<T = any> = {
  code: RESPONSE_STATUS_CODE // 状态码
  msg: string // 状态信息
  data?: T // 数据
}

/**
 * @description: 分页列表
 */
export type PageResponse<T = any> = {
  list: T[]
  total: number | null // 总页数
}

/**
 * @description: 分页参数
 */
export type PaginationParams = {
  current: number // 当前页
  pageSize: number // 每页条数
}

/**
 * @description: 分类列表
 */
export type CategoryList = {
  id: string // uuid
  name: string // 分类名称
  desc: string // 分类描述
  icon: string // 分类图标
  user_id: string // 用户 id
  email: string // 用户邮箱
  sort: number // 排序
  created_at: Date // 创建时间
  updated_at: Date // 更新时间
}

/**
 * @description: 分类查询参数
 */
export type CategoryParams = PaginationParams & Partial<Pick<CategoryList, 'name'>>

/**
 * @description: 新增/编辑参数
 */
export type CategoryEdit = Pick<CategoryList, 'name' | 'sort'> &
  Partial<Pick<CategoryList, 'id' | 'desc' | 'icon'>>

/**
 * @description: 站点列表
 */
export type WebsiteList = {
  id: string // uuid
  category_id: string // 所属分类
  name: string // 站点名称
  desc: string // 站点描述
  url: string // 站点 url
  logo: string // logo url
  color: string // 图标颜色
  tags: string[] // 站点标签
  pinned: boolean // 是否置顶
  vpn: boolean // 是否需要 vpn
  recommend: boolean // 是否推荐
  user_id: string // 用户 id
  email: string // 用户邮箱
  sort: number // 排序
  created_at: Date // 创建时间
  updated_at: Date // 更新时间
}

/**
 * @description: 站点查询参数
 */
export type WebsiteParams = PaginationParams & Partial<Pick<WebsiteList, 'name' | 'category_id'>>

/**
 * @description: 新增/编辑参数
 */
export type WebsiteEdit = Pick<
  WebsiteList,
  'category_id' | 'name' | 'url' | 'logo' | 'tags' | 'pinned' | 'vpn' | 'recommend' | 'sort'
> &
  Partial<Pick<WebsiteList, 'id' | 'desc' | 'color'>>

/**
 * @description: 社交图标类型
 */
export type Social = {
  icon: string // 图标
  url?: string // 跳转地址
  tip?: string // tip 文案
}
