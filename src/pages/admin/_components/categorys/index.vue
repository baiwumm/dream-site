<template>
  <div class="flex flex-col gap-4">
    <el-space wrap>
      <el-input v-model="name" style="width: 240px" placeholder="输入分类名称搜索" />
      <el-button type="primary" :loading="pending" @click="handleSearch"> 查询 </el-button>
      <el-button type="primary" @click="handleAdd"> 新增 </el-button>
    </el-space>
    <!-- 表格列表 -->
    <table-template
      :pending="pending"
      :data-source="data?.data?.list || []"
      @handle-edit="handleEdit"
      @handle-delete="handleDelete"
    />
    <!-- 分页 -->
    <el-row justify="end">
      <el-pagination
        v-model:current-page="current"
        small
        background
        layout="total,prev, pager, next"
        :total="data?.data?.total || 0"
        :page-size="pageSize"
        @change="handleChangePage"
      />
    </el-row>
    <!-- 新增/编辑弹窗 -->
    <edit-modal ref="modalRef" @refresh="refresh" />
  </div>
</template>
<script setup lang="ts">
import type { PageResponse, CategoryList, Response } from '~/types'
import { RESPONSE_STATUS_CODE } from '~/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditModal from './components/EditModal.vue'
import TableTemplate from './components/TableTemplate.vue'

// 请求参数
const current = ref(1) // 当前页
const pageSize = ref(5) // 每页条数
const name = ref('') // 分类名称

const modalRef = ref<InstanceType<typeof EditModal>>()

// 请求列表
const { data, pending, refresh } = await useFetch<Response<PageResponse<CategoryList>>>(
  '/api/categorys',
  {
    query: { current, pageSize, name },
    watch: [current, pageSize],
    // 处理响应数据
    onResponse: ({ response }) => {
      const { code, message, msg } = response._data
      if (code !== RESPONSE_STATUS_CODE.SUCCESS) {
        ElMessage.error(msg || message)
      }
    }
  }
)

// 改变分页时回调
const handleChangePage = (currentPage: number, page: number) => {
  current.value = currentPage
  pageSize.value = page
}

// 查询回调
const handleSearch = () => {
  current.value = 1
  refresh()
}

// 新增回调
const handleAdd = () => {
  if (modalRef.value) {
    modalRef.value.open = true
  }
}

// 编辑回调
const handleEdit = (row: CategoryList) => {
  if (modalRef.value) {
    modalRef.value.open = true
    modalRef.value.name = row.name
    modalRef.value.categoryId = row.id
    Object.assign(modalRef.value.form, {
      name: row.name,
      desc: row.desc,
      sort: row.sort
    })
  }
}

// 删除回调
const handleDelete = (row: CategoryList) => {
  ElMessageBox.confirm('确认要删除当前数据吗?', '温馨提示', {
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        await $fetch('/api/categorys', {
          method: 'delete',
          body: { id: row.id }
        })
          .then(({ code, msg }) => {
            if (code === RESPONSE_STATUS_CODE.SUCCESS) {
              ElMessage.success('删除成功')
              refresh()
            } else {
              ElMessage.error(msg)
            }
            done()
          })
          .finally(() => {
            instance.confirmButtonLoading = false
          })
      } else {
        done()
      }
    }
  })
}
</script>
