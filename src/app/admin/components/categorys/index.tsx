/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 18:09:02
 * @Description: 网站分类
 */
"use client"
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  SortingState,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table';
import { useRequest } from 'ahooks';
import { Search } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useEffect, useMemo, useState } from 'react';

import { RippleButton } from "@/components/animate-ui/components/buttons/ripple";
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTable, CardTitle, CardToolbar } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility'
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { get } from '@/lib/utils';
import { getCategorysList } from '@/services/categorys';

type CategorysProps = {
  categorysList: App.Category[];
  setCategorysList: Dispatch<SetStateAction<App.Category[]>>;
}

const Categorys: FC<CategorysProps> = ({ categorysList = [], setCategorysList }) => {
  // 分页参数
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // 排序
  const [sorting, setSorting] = useState<SortingState>([]);
  // 受控列
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email_confirmed_at: false
  })
  // 网站名称
  const [name, setName] = useState('');

  // 请求分类列表
  const { data: total, loading, run } = useRequest(async (params) => {
    const res = get(await getCategorysList(params), 'data', {});
    const list = get(res, 'list', []);
    setCategorysList(list)
    return get(res, 'total', 0)
  }, {
    defaultParams: [{ name, ...pagination }]
  });

  // 发起请求
  const handleSearch = () => {
    run({ name, ...pagination })
  }

  // 重置
  const handleReset = () => {
    setName('');
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    run({ name: '', ...pagination })
  }

  // 列配置项
  const columns = useMemo<ColumnDef<App.Category>[]>(() => [
    {
      accessorKey: "index",
      header: '序号',
      cell: ({ row }) => <Badge shape="circle">{pagination.pageIndex * pagination.pageSize + row.index + 1}</Badge>,
      meta: {
        headerClassName: 'text-center min-w-20',
        cellClassName: 'text-center',
        headerTitle: '序号',
        skeleton: (
          <div className="flex justify-center items-center">
            <Skeleton className="size-6.5 rounded-full" />
          </div>
        ),
      },
    }
  ], [pagination.pageIndex, pagination.pageSize])

  // 表格实例
  const table = useReactTable({
    data: categorysList,
    columns,
    pageCount: Math.ceil((total || 0) / pagination.pageSize),
    getRowId: (row: App.Category) => row.id,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  })

  useEffect(() => {
    run({ name, ...pagination })
  }, [pagination, run]);
  return (
    <DataGrid
      table={table}
      recordCount={total || 0}
      isLoading={loading}
      tableLayout={{
        columnsVisibility: true,
        cellBorder: true,
        headerSticky: true,
        width: 'auto',
      }}
    >
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-60">
              <Input placeholder="分类名称" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <RippleButton onClick={handleSearch}>
              {loading ? <Spinner variant='circle' /> : <Search />}
              查询
            </RippleButton>
            <RippleButton variant="secondary" onClick={handleReset} disabled={loading}>
              重置
            </RippleButton>
          </CardTitle>
          <CardToolbar>
            <DataGridColumnVisibility table={table} />
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}
export default Categorys;