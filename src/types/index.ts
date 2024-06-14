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
  Partial<Pick<CategoryList, 'id' | 'desc'>>

/**
 * @description: 社交图标类型
 */
export type Social = {
  icon: string // 图标
  url?: string // 跳转地址
  tip?: string // tip 文案
}
