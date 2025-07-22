<template>
  <UModal
    v-model:open="isOpen"
    :title="state.id ? '编辑站点' : '新增站点'"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
    aria-describedby="website-modal"
  >
    <template #body>
      <UForm ref="form" :schema :state class="space-y-4" @submit="onSubmit">
        <UFormField label="所属分类" name="category_id" required>
          <USelect
            v-model="state.category_id"
            placeholder="请选择所属分类"
            value-key="id"
            label-key="name"
            :items="categoryList || []"
            class="w-full"
          />
        </UFormField>

        <UFormField label="站点名称" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="请输入站点名称"
            class="w-full"
            size="lg"
            :maxlength="12"
            aria-describedby="name"
          >
            <template #trailing>
              <div id="character-count" class="text-xs text-muted tabular-nums" aria-live="polite" role="status">
                {{ state.name?.length || 0 }}/12
              </div>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="网站链接" name="url" required>
          <UInput v-model="state.url" placeholder="请输入网站链接" class="w-full" size="lg" aria-describedby="url" />
        </UFormField>

        <UFormField label="Logo" name="logo" required>
          <UInput v-model="state.logo" placeholder="请输入Logo" class="w-full" size="lg" aria-describedby="logo" />
        </UFormField>

        <UFormField label="图标颜色" name="color">
          <UInput
            v-model="state.color"
            placeholder="请输入图标颜色"
            class="w-full"
            size="lg"
            aria-describedby="color"
          />
        </UFormField>

        <div class="grid grid-cols-4">
          <UFormField label="置顶" name="pinned">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.pinned" />
          </UFormField>
          <UFormField label="vpn" name="vpn">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.vpn" />
          </UFormField>
          <UFormField label="推荐" name="recommend">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.recommend" />
          </UFormField>
          <UFormField label="常用" name="commonlyUsed">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.commonlyUsed" />
          </UFormField>
        </div>

        <UFormField name="desc" label="站点描述">
          <UTextarea
            v-model="state.desc"
            placeholder="请输入站点描述"
            :maxrows="4"
            autoresize
            class="w-full"
            :maxlength="120"
            size="lg"
          />
        </UFormField>

        <UFormField name="tags" label="站点标签" required>
          <UInputTags
            v-model="state.tags"
            :max-length="4"
            placeholder="请输入站点标签"
            size="lg"
            icon="ri:price-tag-3-line"
            class="w-full"
          />
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
import type { WebsiteEdit, CategoryList } from "~/lib/type";
import { RESPONSE_STATUS_CODE } from "~/lib/enum";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  modelValue: boolean;
  website?: WebsiteEdit;
  categoryList?: CategoryList[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [];
}>();

const form = useTemplateRef("form");

const toast = useToast();

const hexColorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))?$/;

// 表单验证模式
const schema = z.object({
  id: z.string().optional(),
  category_id: z.string("请选择所属分类"),
  name: z.string("请输入站点名称").min(1, "站点名称不能为空").max(12, "站点名称不能超过12个字符"),
  url: z.url("请输入正确的站点链接"),
  logo: z.string("请输入Logo"),
  color: z
    .string()
    .regex(hexColorRegex, {
      message: "必须是有效的 HEX 颜色（如 #FF0000 或 #FFF），或留空",
    })
    .optional(),
  tags: z.string().array().nonempty("请输入站点标签"),
  pinned: z.boolean().optional(),
  vpn: z.boolean().optional(),
  recommend: z.boolean().optional(),
  commonlyUsed: z.boolean().optional(),
  desc: z.string().max(100, "站点描述不能超过100个字符").optional().nullable(),
  icon: z.string().max(50, "站点图标不能超过50个字符").optional(),
  sort: z.number(),
});

type Schema = z.output<typeof schema>;

// 定义一个默认值的函数
const getDefaultState = (): Partial<Schema> => ({
  category_id: undefined,
  name: undefined,
  url: undefined,
  logo: undefined,
  color: undefined,
  tags: [],
  pinned: false,
  vpn: false,
  recommend: false,
  commonlyUsed: false,
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

// 监听 website 变化
watch(
  () => props.website,
  (newWebsite) => {
    if (newWebsite) {
      Object.assign(state, newWebsite);
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
    const url = "/api/websites";
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
