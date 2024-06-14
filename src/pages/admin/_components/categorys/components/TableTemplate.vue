<template>
  <el-space direction="vertical" fill class="w-full">
    <el-table v-loading="pending" :data="data?.list || []" border stripe table-layou="auto">
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="name" label="分类名称" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag type="primary">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="分类描述" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <div>{{ row.desc || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" sortable />
      <el-table-column prop="created_at" label="创建时间" align="center" width="180" sortable>
        <template #default="{ row }">
          <div>{{ formatDateTime(row.created_at) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" align="center" width="180" sortable>
        <template #default="{ row }">
          <div>{{ formatDateTime(row.updated_at) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="emit('handleEdit', row)"> 编辑 </el-button>
          <el-button size="small" type="danger" @click="emit('handleDelete', row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="end">
      <el-pagination
        small
        background
        layout="total,prev, pager, next"
        :total="data?.total || 0"
        :page-size="pageSize"
        @change="(currentPage: number, page: number) => emit('handleChangePage', currentPage, page)"
      />
    </el-row>
  </el-space>
</template>
<script setup lang="ts">
import { formatDateTime } from '@/utils'
import type { PageResponse, CategoryList } from '~/types'

// 父组件传递参数
defineProps<{
  pending: boolean // 数据加载 loading
  data?: PageResponse<CategoryList> // 表格数据
  pageSize: number // 分页
}>()

// 父组件方法
const emit = defineEmits(['handleEdit', 'handleDelete', 'handleChangePage'])
</script>
