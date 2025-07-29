<template>
  <UModal
    v-model:open="isOpen"
    :title="state.id ? '编辑分类' : '新增分类'"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm ref="form" :schema :state class="space-y-4" @submit="onSubmit">
        <UFormField label="分类名称" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="请输入分类名称"
            class="w-full"
            size="lg"
            :maxlength="12"
            aria-describedby="name"
          />
        </UFormField>

        <UFormField name="desc" label="分类描述">
          <UTextarea
            v-model="state.desc"
            placeholder="请输入分类描述"
            :maxrows="4"
            autoresize
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField name="icon" label="分类图标">
          <UInput v-model="state.icon" placeholder="请输入分类图标" class="w-full" size="lg">
            <template #trailing>
              <UIcon :name="state.icon" v-if="state.icon" />
            </template>
          </UInput>
        </UFormField>

        <UFormField name="sort" label="排序" required>
          <UInputNumber v-model="state.sort" placeholder="请输入排序" class="w-full" size="lg" :min="1" :max="9999" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton color="neutral" variant="outline" label="取消" class="cursor-pointer" @click="closeModal" size="lg" />
      <UButton
        color="neutral"
        variant="solid"
        label="确认"
        :loading="loading"
        class="cursor-pointer"
        @click="form?.submit()"
        size="lg"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { CategoryEdit } from "~/lib/type";
import { RESPONSE_STATUS_CODE } from "~/lib/enum";
import type { FormSubmitEvent } from "@nuxt/ui";
import { UIcon } from "#components";

const props = defineProps<{
  modelValue: boolean;
  category?: CategoryEdit | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [];
}>();

const form = useTemplateRef("form");

const toast = useToast();

// 表单验证模式
const schema = z.object({
  id: z.string().optional(),
  name: z.string("请输入分类名称").min(1, "分类名称不能为空").max(12, "分类名称不能超过12个字符"),
  desc: z.string().max(100, "分类描述不能超过100个字符").optional().nullable(),
  icon: z.string().max(50, "分类图标不能超过50个字符").optional().nullable(),
  sort: z.number(),
});

type Schema = z.output<typeof schema>;

// 定义一个默认值的函数
const getDefaultState = (): Partial<Schema> => ({
  id: undefined,
  name: undefined,
  sort: 1,
  desc: undefined,
  icon: undefined,
});

// 表单数据
const state = reactive<Partial<Schema>>(getDefaultState());

// 加载状态
const loading = ref(false);

// 重置表单
const resetForm = () => {
  Object.assign(state, getDefaultState());
};

// 模态框状态
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 监听 category 变化
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      Object.assign(state, newCategory);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

// 表单提交
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const url = "/api/categorys";
    const isAdd = !!state.id;
    const method = isAdd ? "PUT" : "POST";

    await $fetch(url, {
      method,
      body: state,
    }).then(({ code, msg }) => {
      if (code === RESPONSE_STATUS_CODE.SUCCESS) {
        toast.add({
          title: isAdd ? "编辑成功" : "新增成功",
          color: "success",
          icon: "ri:checkbox-circle-line",
        });
        emit("success");
        closeModal();
      } else {
        toast.add({
          title: msg,
          color: "error",
          icon: "ri:close-circle-line",
        });
      }
    });
  } catch {
    // 处理其他错误
    toast.add({
      title: "操作失败",
      color: "error",
      icon: "ri:close-circle-line",
    });
  } finally {
    loading.value = false;
  }
}
</script>
