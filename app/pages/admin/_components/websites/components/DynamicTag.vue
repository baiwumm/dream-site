<template>
  <el-space wrap>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput"> + New Tag </el-button>
  </el-space>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'

// 定义props和emits
const props = defineProps<{
  modelValue: string[]
}>()
const emits = defineEmits(['update:modelValue'])

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const dynamicTags = ref(props.modelValue)

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    // 触发更新事件通知父组件
    emits('update:modelValue', dynamicTags.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

watch(
  () => props.modelValue,
  (newVal) => {
    dynamicTags.value = newVal // 确保 dynamicTags 总是与 modelValue 同步
  },
  { immediate: true } // 添加 immediate: true 以在初始渲染时立即同步
)
</script>
