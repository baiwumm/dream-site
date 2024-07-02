<template>
  <div class="flex flex-col gap-4">
    <el-space wrap>
      <el-form :model="form" inline class="searchForm">
        <el-form-item prop="name">
          <el-input v-model="form.name" style="width: 240px" placeholder="输入站点名称搜索" />
        </el-form-item>
        <el-form-item prop="category_id">
          <el-select
            v-model="form.category_id"
            clearable
            filterable
            :loading="categoryLoading === 'pending'"
            placeholder="请选择所属分类"
            style="width: 240px"
          >
            <el-option
              v-for="item in categoryData?.data?.list || []"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <el-space :size="5">
                <Icon name="ri:menu-5-line" class="h-4 w-4" />
                <span>{{ item.name }}</span>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="status === 'pending'" @click="handleSearch">
        <el-space :size="5">
          <Icon name="ri:search-line" class="h-4 w-4" />
          <span>查询</span>
        </el-space>
      </el-button>
      <el-button type="primary" @click="handleAdd">
        <el-space :size="5">
          <Icon name="ri:add-fill" class="h-4 w-4" />
          <span>新增</span>
        </el-space>
      </el-button>
    </el-space>
    <!-- 表格列表 -->
    <table-template
      :pending="status === 'pending'"
      :data-source="data?.data?.list || []"
      @handle-edit="handleEdit"
      @handle-delete="handleDelete"
    />
    <!-- 分页 -->
    <el-row justify="end">
      <el-pagination
        v-model:current-page="current"
        size="small"
        background
        layout="total,prev, pager, next"
        :total="data?.data?.total || 0"
        :page-size="pageSize"
        @change="handleChangePage"
      />
    </el-row>
    <!-- 新增/编辑弹窗 -->
    <edit-modal ref="modalRef" :category-list="categoryData?.data?.list || []" @refresh="refresh" />
  </div>
</template>
<script setup lang="ts">
import type { PageResponse, WebsiteList, Response, CategoryList } from '~/types'
import { RESPONSE_STATUS_CODE } from '~/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditModal from './components/EditModal.vue'
import TableTemplate from './components/TableTemplate.vue'

// 请求参数
const current = ref(1) // 当前页
const pageSize = ref(10) // 每页条数

// 查询参数
const form = reactive({
  name: '',
  category_id: ''
})

const modalRef = ref<InstanceType<typeof EditModal>>()

// 请求分类列表
const { data: categoryData, status: categoryLoading } = await useFetch<
  Response<PageResponse<CategoryList>>
>('/api/categorys', {
  query: { current: 1, pageSize: 9999 } // 这里请求全部分类
})

// 请求站点列表
const { data, status, refresh } = await useFetch<Response<PageResponse<WebsiteList>>>(
  '/api/websites',
  {
    query: Object.assign(form, {
      current,
      pageSize
    }),
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
const handleEdit = (row: WebsiteList) => {
  if (modalRef.value) {
    modalRef.value.open = true
    modalRef.value.name = row.name
    modalRef.value.websiteId = row.id
    Object.assign(modalRef.value.form, {
      category_id: row.category_id,
      name: row.name,
      url: row.url,
      logo: row.logo,
      tags: row.tags,
      pinned: row.pinned,
      vpn: row.vpn,
      recommend: row.recommend,
      desc: row.desc,
      sort: row.sort,
      color: row.color
    })
  }
}

// 删除回调
const handleDelete = (row: WebsiteList) => {
  ElMessageBox.confirm('确认要删除当前数据吗?', '温馨提示', {
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        await $fetch('/api/websites', {
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
<style scoped>
:deep(.searchForm .el-form-item) {
  margin-bottom: 0;
}
:deep(.searchForm .el-form-item) {
  margin-right: 8px;
}
</style>
