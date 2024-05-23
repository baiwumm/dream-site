/**
 * @description: 分类列表
 */
export type CategoryList = {
  id: string // uuid
  name: string // 分类名称
  desc?: string // 分类描述
  created_at: Date // 创建时间
  updated_at: Date // 更新时间
}
