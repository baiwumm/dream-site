<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-05 10:47:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-07-02 15:34:10
 * @Description: 新增/编辑弹窗
-->
<template>
  <el-dialog :model-value="open" width="500" @close="handleClose">
    <template #header>
      {{ websiteId ? `编辑站点: ` : '新增站点' }}
      <el-tag v-if="name" type="primary">
        {{ name }}
      </el-tag>
    </template>
    <template #footer>
      <el-button type="primary" :loading="confirmLoading" @click="handleConfirm(ruleFormRef)">
        确定
      </el-button>
    </template>
    <el-form ref="ruleFormRef" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="所属分类" prop="category_id">
        <el-select v-model="form.category_id" clearable filterable placeholder="请选择所属分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <el-space :size="5">
              <Icon :name="item.icon || 'ri:menu-5-line'" class="h-4 w-4" />
              <span>{{ item.name }}</span>
            </el-space>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网站名称" prop="name">
        <el-input v-model="form.name" maxlength="12" show-word-limit type="text" />
      </el-form-item>
      <el-form-item label="网站链接" prop="url">
        <el-input v-model="form.url" type="text" />
      </el-form-item>
      <el-form-item label="Logo" prop="logo">
        <el-input v-model="form.logo" type="text" />
      </el-form-item>
      <el-form-item label="图标颜色" prop="color">
        <el-input v-model="form.color" type="text" />
      </el-form-item>
      <el-form-item label="站点标签" prop="tags">
        <dynamic-tag v-model="form.tags" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="置顶" prop="pinned">
            <el-switch v-model="form.pinned" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="vpn" prop="vpn">
            <el-switch v-model="form.vpn" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="推荐" prop="recommend">
            <el-switch v-model="form.recommend" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="站点描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="3" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="99" :style="{ width: '100%' }" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import type { WebsiteEdit, CategoryList } from '~/types'
import type { FormInstance, FormRules } from 'element-plus'
import DynamicTag from './DynamicTag.vue'
import { RESPONSE_STATUS_CODE } from '~/enum'

const open = ref(false) // 是否显示弹窗
const name = ref('') // 当前数据
const confirmLoading = ref(false)
const websiteId = ref()

const emit = defineEmits(['refresh'])

// 父组件传递参数
defineProps<{
  categoryList: CategoryList[]
}>()

const form = reactive<WebsiteEdit>({
  category_id: '',
  name: '',
  url: '',
  logo: '',
  color: '',
  tags: [],
  pinned: false,
  vpn: false,
  recommend: false,
  desc: undefined,
  sort: 1
})

const ruleFormRef = ref<FormInstance>()
// 校验网站 url
const validatorUrl = (
  _: any,
  value: any,
  callback: (error?: string | Error | undefined) => void
) => {
  if (!value) {
    callback(new Error('请输入网站链接'))
  } else {
    const reg =
      /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的url'))
    }
  }
}
// 表单规则校验
const rules = reactive<FormRules<WebsiteEdit>>({
  category_id: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
    { min: 1, max: 12, message: '长度1-12个字符', trigger: 'blur' }
  ],
  url: [{ required: true, validator: validatorUrl, trigger: 'blur' }],
  logo: [{ required: true, message: '请输入站点 Logo', trigger: 'blur' }],
  tags: [{ required: true, message: '请输入站点标签', trigger: 'blur' }]
})

// 暴露方法
defineExpose({ open, name, form, websiteId })

// 关闭回调
const handleClose = async () => {
  open.value = false
  name.value = ''
  websiteId.value = undefined
  ruleFormRef.value?.resetFields()
}

// 确定回调
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      confirmLoading.value = true
      await $fetch('/api/websites', {
        method: websiteId.value ? 'put' : 'post',
        body: Object.assign(form, { id: websiteId.value })
      })
        .then(({ code, msg }) => {
          if (code === RESPONSE_STATUS_CODE.SUCCESS) {
            ElMessage.success('操作成功')
            handleClose()
            emit('refresh')
          } else {
            ElMessage.error(msg)
          }
        })
        .finally(() => {
          confirmLoading.value = false
        })
    }
  })
}
</script>
