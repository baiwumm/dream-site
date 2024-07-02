<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-06-05 10:47:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-07-02 15:30:06
 * @Description: 新增/编辑弹窗
-->
<template>
  <el-dialog :model-value="open" width="500" @close="handleClose">
    <template #header>
      {{ categoryId ? `编辑分类: ` : '新增分类' }}
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
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" maxlength="12" show-word-limit type="text" />
      </el-form-item>
      <el-form-item label="分类描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="3" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="分类图标" prop="icon">
        <el-input v-model="form.icon" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="99" :style="{ width: '100%' }" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import type { CategoryEdit } from '~/types'
import type { FormInstance, FormRules } from 'element-plus'
import { RESPONSE_STATUS_CODE } from '~/enum'

const open = ref(false) // 是否显示弹窗
const name = ref('') // 当前数据
const confirmLoading = ref(false)
const categoryId = ref()

const emit = defineEmits(['refresh'])

const form = reactive<CategoryEdit>({
  name: '',
  desc: undefined,
  icon: '',
  sort: 1
})

const ruleFormRef = ref<FormInstance>()
// 表单规则校验
const rules = reactive<FormRules<CategoryEdit>>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 12, message: '长度1-12个字符', trigger: 'blur' }
  ]
})

// 暴露方法
defineExpose({ open, name, form, categoryId })

// 关闭回调
const handleClose = () => {
  open.value = false
  name.value = ''
  categoryId.value = undefined
  ruleFormRef.value?.resetFields()
}

// 确定回调
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      confirmLoading.value = true
      await $fetch('/api/categorys', {
        method: categoryId.value ? 'put' : 'post',
        body: Object.assign(form, { id: categoryId.value })
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
