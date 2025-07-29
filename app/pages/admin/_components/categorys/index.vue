<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <!-- 顶部搜索 -->
      <div class="flex gap-2">
        <UInput v-model="name" placeholder="输入分类名称搜索" class="w-80" />
        <UButton
          icon="ri:search-line"
          size="md"
          variant="solid"
          class="cursor-pointer"
          :loading="status === 'pending'"
          @click="handleSearch"
          >查询</UButton
        >
        <UButton
          icon="ri:reset-left-line"
          size="md"
          variant="outline"
          color="neutral"
          class="cursor-pointer"
          @click="handleReset"
          >重置</UButton
        >
        <UButton
          icon="ri:add-line"
          size="md"
          color="secondary"
          variant="solid"
          class="cursor-pointer"
          @click="handleAdd"
          >新增</UButton
        >
      </div>
      <!-- 列控制项 -->
      <UDropdownMenu
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: columnVisibilityMap[column.id] || column.id,
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked);
              },
              onSelect(e?: Event) {
                e?.preventDefault();
              },
            }))
        "
        :content="{ align: 'end' }"
      >
        <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
      </UDropdownMenu>
    </div>
    <!-- 表格列表 -->
    <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <UTable
        ref="table"
        :loading="status === 'pending'"
        :data="data?.data?.list || []"
        :columns="columns"
        v-model:column-pinning="columnPinning"
        v-model:column-visibility="columnVisibility"
        :ui="{
          th: 'border border-gray-200 dark:border-gray-700',
          td: 'border border-gray-200 dark:border-gray-700',
        }"
      />
    </div>
    <!-- 分页 -->
    <div class="flex justify-center">
      <UPagination
        v-model:page="current"
        :items-per-page="pageSize"
        :total="data?.data?.total || 0"
        show-edges
        @update:page="handlePageChange"
      />
    </div>
    <!-- 编辑模态框 -->
    <EditModal v-model="showEditModal" :category="currentCategory" @success="handleSuccess" />
  </div>
</template>
<script setup lang="ts">
import type { PageResponse, CategoryList, Response, CategoryEdit } from "~/lib/type";
import { RESPONSE_STATUS_CODE } from "~/lib/enum";
import type { TableColumn } from "@nuxt/ui";
import EditModal from "./components/EditModal.vue";
import { pick } from "~/lib/utils";
import type { Column } from "@tanstack/vue-table";

const UBadge = resolveComponent("UBadge");
const UIcon = resolveComponent("UIcon");
const UButton = resolveComponent("UButton");
const UChip = resolveComponent("UChip");
const deleteId = ref(""); // 删除 id

const dayjs = useDayjs();

// 请求参数
const current = ref(1); // 当前页
const pageSize = ref(10); // 每页条数
const name = ref(""); // 分类名称

const toast = useToast();

// 请求列表
const { data, refresh, status } = await useFetch<Response<PageResponse<CategoryList>>>("/api/categorys", {
  query: { current, pageSize, name },
  // watch: [current, pageSize],
  // 处理响应数据
  onResponse: ({ response }) => {
    const { code, msg } = response._data;
    if (code !== RESPONSE_STATUS_CODE.SUCCESS) {
      toast.add({
        title: msg,
      });
    }
  },
});

// 查询回调
const handleSearch = () => {
  current.value = 1;
  refresh();
};

// 重置回调
const handleReset = () => {
  name.value = "";
  current.value = 1;
  currentCategory.value = null;
  deleteId.value = "";
};

// 分页切换回调
const handlePageChange = (page: number) => {
  current.value = page;
};

// 编辑模态框状态
const showEditModal = ref(false);
const currentCategory = ref<CategoryEdit | null>();

// 新增回调
const handleAdd = () => {
  currentCategory.value = null;
  showEditModal.value = true;
};

// 编辑回调
const handleEdit = (category: CategoryList) => {
  currentCategory.value = pick(category, ["id", "name", "desc", "icon", "sort"]);
  showEditModal.value = true;
};

// 删除回调
const handleDelete = async (id: string) => {
  deleteId.value = id;
  try {
    await $fetch("/api/categorys", {
      method: "DELETE",
      body: { id },
    })
      .then(({ code, msg }) => {
        if (code === RESPONSE_STATUS_CODE.SUCCESS) {
          toast.add({
            title: "删除成功",
            color: "success",
            icon: "ri:checkbox-circle-line",
          });
          refresh();
        } else {
          toast.add({
            title: msg,
            color: "error",
            icon: "ri:close-circle-line",
          });
        }
      })
      .finally(() => {
        deleteId.value = "";
      });
  } catch {
    toast.add({
      title: "操作失败",
      color: "error",
      icon: "ri:close-circle-line",
    });
  }
};

// 操作成功回调
const handleSuccess = () => {
  handleReset();
  refresh();
};

function getHeader(column: Column<CategoryList>, label: string, position: "left" | "right") {
  const isPinned = column.getIsPinned();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    icon: isPinned ? "i-lucide-pin-off" : "i-lucide-pin",
    class: "-mx-2.5",
    onClick() {
      column.pin(isPinned === position ? false : position);
    },
  });
}

// 列配置项
const columns: TableColumn<CategoryList>[] = [
  {
    accessorKey: "name",
    header: "分类名称",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) =>
      h(UChip, { size: "3xl", text: row.original.ds_websites?.length || 0, color: "error" }, () =>
        h(UBadge, { variant: "soft" }, () => row.getValue("name"))
      ),
  },
  {
    accessorKey: "desc",
    header: "分类描述",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "icon",
    header: "分类图标",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      return row.original.icon
        ? h(UIcon, { name: row.getValue("icon"), size: "30" }, () => row.getValue("icon"))
        : "--";
    },
  },
  {
    accessorKey: "sort",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "排序",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      return h(UBadge, { color: "info", ariant: "soft" }, () => row.getValue("sort"));
    },
  },
  {
    accessorKey: "created_at",
    header: "创建时间",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => dayjs(row.original.created_at).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    accessorKey: "updated_at",
    header: "更新时间",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => dayjs(row.original.updated_at).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    accessorKey: "actions",
    header: ({ column }) => h("div", { class: "text-right" }, getHeader(column, "操作", "right")),
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      return h("div", { class: "flex justify-center gap-2" }, [
        h(UButton, {
          color: "primary",
          variant: "soft",
          icon: "ri:edit-line",
          size: "xs",
          label: "编辑",
          class: "cursor-pointer",
          onClick: () => handleEdit(row.original),
        }),
        h(UButton, {
          color: "error",
          variant: "soft",
          icon: "ri:delete-bin-line",
          size: "xs",
          label: "删除",
          loading: row.original.id === deleteId.value,
          class: "cursor-pointer",
          onClick: () => handleDelete(row.original.id),
        }),
      ]);
    },
  },
];

const table = useTemplateRef("table");

// 列固定
const columnPinning = ref({
  left: [],
  right: ["actions"],
});

// 列隐藏
const columnVisibility = ref({
  updated_at: false,
});

// 这里要做个映射
const columnVisibilityMap: Record<string, string> = reactive({
  name: "分类名称",
  desc: "分类描述",
  icon: "分类图标",
  actions: "操作",
  sort: "排序",
  created_at: "创建时间",
  updated_at: "更新时间",
});
</script>
