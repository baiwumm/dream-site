/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 16:11:21
 * @Description: 网站分类
 */
"use client"
import { Magnifier } from '@gravity-ui/icons';
import { Button, Card, Input, Spinner } from "@heroui/react";
import {
  flexRender,
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
import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from 'react';

import { columns } from './components/columns'

import ColumnsVisibility from '@/components/ColumnsVisibility';
import EmptyContent from '@/components/EmptyContent';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card >
      <Card.Header className="flex justify-between items-center w-full flex-col sm:flex-row gap-2">
        <Card.Title className="flex items-center gap-2 flex-wrap">
          <div className="w-60">
            <Input variant='secondary' placeholder="分类名称" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button isPending={loading} size='sm' onPress={handleSearch}>
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size='sm' /> : <Magnifier />}
                查询
              </>
            )}
          </Button>
          <Button variant="secondary" size='sm' onPress={handleReset} isDisabled={loading}>
            重置
          </Button>
        </Card.Title>
        <ColumnsVisibility table={table} />
      </Card.Header>
      <Card.Content className="relative">
        <Table className="border border-default">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyContent />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading ? (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Spinner />
          </div>
        ) : null}
      </Card.Content>
      <Card.Footer>
      </Card.Footer>
    </Card>
  )
}
export default Categorys;