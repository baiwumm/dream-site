<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <!-- 顶部搜索 -->
      <div class="flex gap-2">
        <UInput v-model="name" placeholder="输入站点名称搜索" class="w-60" />
        <USelect
          v-model="category_id"
          placeholder="请选择所属分类"
          value-key="id"
          label-key="name"
          :loading="categoryLoading === 'pending'"
          :items="categoryData?.data?.list || []"
          class="w-60"
        />
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
    <EditModal
      v-model="showEditModal"
      :website="currentWebsite"
      :category-list="categoryData?.data?.list || []"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup lang="ts">
import type { PageResponse, WebsiteList, Response, WebsiteEdit, CategoryList } from "~/lib/type";
import { RESPONSE_STATUS_CODE } from "~/lib/enum";
import type { TableColumn } from "@nuxt/ui";
import EditModal from "./components/EditModal.vue";
import { pick } from "~/lib/utils";
import SiteImage from "~/components/SiteImage/index.vue";
import type { Column } from "@tanstack/vue-table";

const UBadge = resolveComponent("UBadge");
const UIcon = resolveComponent("UIcon");
const UButton = resolveComponent("UButton");
const UCheckbox = resolveComponent("UCheckbox");
const deleteId = ref(""); // 删除 id

const dayjs = useDayjs();

// 请求参数
const current = ref(1); // 当前页
const pageSize = ref(10); // 每页条数
const name = ref(""); // 站点名称
const category_id = ref(""); // 所属分类

const toast = useToast();

// 请求分类列表
const { data: categoryData, status: categoryLoading } = await useFetch<Response<PageResponse<CategoryList>>>(
  "/api/categorys",
  {
    query: { current: 1, pageSize: 9999 }, // 这里请求全部分类
  }
);

// 请求列表
const { data, refresh, status } = await useFetch<Response<PageResponse<WebsiteList>>>("/api/websites", {
  query: { current, pageSize, name, category_id },
  watch: [current, pageSize],
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
  current.value = 1;
  name.value = "";
  category_id.value = "";
  deleteId.value = "";
};

// 分页切换回调
const handlePageChange = (page: number) => {
  current.value = page;
};

// 编辑模态框状态
const showEditModal = ref(false);
const currentWebsite = ref<WebsiteEdit | undefined>();

// 新增回调
const handleAdd = () => {
  currentWebsite.value = undefined;
  showEditModal.value = true;
};

// 编辑回调
const handleEdit = (category: WebsiteList) => {
  currentWebsite.value = pick(category, [
    "id",
    "category_id",
    "name",
    "url",
    "logo",
    "tags",
    "pinned",
    "vpn",
    "recommend",
    "commonlyUsed",
    "color",
    "desc",
    "sort",
  ]);
  showEditModal.value = true;
};

// 删除回调
const handleDelete = async (id: string) => {
  deleteId.value = id;
  try {
    await $fetch("/api/websites", {
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

function getHeader(column: Column<WebsiteList>, label: string, position: "left" | "right") {
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
const columns: TableColumn<WebsiteList>[] = [
  {
    accessorKey: "name",
    header: "站点名称",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row, column }) => {
      return h("div", { class: "flex justify-center gap-2" }, [
        h(
          UBadge,
          {
            variant: "soft",
          },
          () => row.getValue("name")
        ),
        h(UIcon, {
          name: "ri:share-box-fill",
          class: "cursor-pointer",
          onClick: () => window.open(row.original.url),
        }),
      ]);
    },
  },
  {
    accessorKey: "logo",
    header: "Logo",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => h(SiteImage, { url: row.original.logo, size: 32, color: row.original.color, class: "m-auto" }),
  },
  {
    accessorKey: "tags",
    header: "站点标签",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const tags = row.original?.tags || [];
      return h(
        "div",
        { class: "flex justify-center gap-2" },
        tags.map((tag) =>
          h(UBadge, {
            color: "neutral",
            variant: "soft",
            label: tag,
          })
        )
      );
    },
  },
  {
    accessorKey: "category_id",
    header: "所属分类",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const categoryName = row.original.ds_categorys.name;
      return h(UBadge, { variant: "soft", color: "info", label: categoryName });
    },
  },
  {
    accessorKey: "desc",
    header: "站点描述",
    meta: {
      class: {
        td: "text-center w-20",
        th: "text-center w-20",
      },
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
    accessorKey: "pinned",
    header: "置顶",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const pinned = row.original.pinned;
      return h(UCheckbox, { disabled: true, defaultValue: pinned || "indeterminate" });
    },
  },
  {
    accessorKey: "vpn",
    header: "VPN",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const vpn = row.original.vpn;
      return h(UCheckbox, { disabled: true, defaultValue: vpn || "indeterminate" });
    },
  },
  {
    accessorKey: "recommend",
    header: "推荐",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const recommend = row.original.recommend;
      return h(UCheckbox, { disabled: true, defaultValue: recommend || "indeterminate" });
    },
  },
  {
    accessorKey: "commonlyUsed",
    header: "常用",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const commonlyUsed = row.original.commonlyUsed;
      return h(UCheckbox, { disabled: true, defaultValue: commonlyUsed || "indeterminate" });
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
  desc: false,
  updated_at: false,
});

// 这里要做个映射
const columnVisibilityMap: Record<string, string> = reactive({
  name: "站点名称",
  logo: "Logo",
  tags: "站点标签",
  category_id: "所属分类",
  desc: "站点描述",
  url: "站点链接",
  pinned: "置顶",
  vpn: "VPN",
  recommend: "推荐",
  commonlyUsed: "常用",
  actions: "操作",
  sort: "排序",
  created_at: "创建时间",
  updated_at: "更新时间",
});
</script>
