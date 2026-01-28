/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 14:35:38
 * @Description: 网站分类
 */
"use client"
import { ArrowRotateLeft, CircleCheckFill, CircleXmarkFill, Magnifier, Plus } from '@gravity-ui/icons';
import { Button, Card, Input, Spinner, toast, useOverlayState } from "@heroui/react";
import {
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

import { getColumns } from './components/columns'
import DataTable from './components/data-table';
import DeleteDialog from './components/delete-dialog';
import SaveModal from './components/save-modal';

import ColumnsVisibility from '@/components/ColumnsVisibility';
import DataTablePagination from '@/components/DataTablePagination';
import { RESPONSE } from '@/enums';
import { get } from '@/lib/utils';
import { delCategory, getCategorysList } from '@/services/categorys';

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
    updated_at: false
  })
  // 网站名称
  const [name, setName] = useState('');
  // 保存弹窗
  const saveModalState = useOverlayState();
  // 删除弹窗
  const delDialogState = useOverlayState();
  // 编辑数据
  const [editData, setEditData] = useState<App.Category | null>(null);

  // 请求分类列表
  const { data, loading, run } = useRequest(async (params) => {
    const res = get(await getCategorysList(params), 'data', {});
    const list = get(res, 'list', []);
    setCategorysList(list)
    return res;
  }, {
    defaultParams: [{ name, ...pagination }]
  });
  const total = get(data, 'total', 0);

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

  // 编辑回调
  const handleEdit = (row: App.Category) => {
    setEditData(row)
    saveModalState.open()
  }

  // 删除分类
  const { loading: delLoading, run: fetchDelCategory } = useRequest(delCategory, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        delDialogState.close();
        toast.success("删除成功", {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        });
        handleReset();
      }
    },
  });

  // 删除回调
  const handleDel = (row: App.Category) => {
    if (row?.websites?.length) {
      toast.danger('该分类下存在关联网站，无法直接删除.', {
        indicator: <CircleXmarkFill />,
        timeout: 3000
      })
      return
    }
    setEditData(row)
    delDialogState.open()
  }

  // 确认删除回调
  const handleDelConfirm = () => {
    if (editData?.id) {
      fetchDelCategory(editData.id)
    }
  }

  // 列配置项
  const columns = getColumns({ handleEdit, handleDel, page: get(data, 'page', 0), pageSize: get(data, 'pageSize', 0) });

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

  useEffect(() => {
    if (!saveModalState.isOpen) {
      setEditData(null);
    }
  }, [saveModalState.isOpen]);

  useEffect(() => {
    if (!delDialogState.isOpen) {
      setEditData(null);
    }
  }, [delDialogState.isOpen]);
  return (
    <>
      <Card className="shadow-lg">
        <Card.Header className="flex justify-between items-start w-full flex-col sm:flex-row sm:items-center gap-2">
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
              <ArrowRotateLeft />
              重置
            </Button>
            <Button variant="outline" size='sm' onPress={() => saveModalState.open()}>
              <Plus />
              新增
            </Button>
          </Card.Title>
          <ColumnsVisibility table={table} />
        </Card.Header>
        <Card.Content>
          <DataTable table={table} colSpan={columns.length} loading={loading} />
        </Card.Content>
        <Card.Footer>
          <DataTablePagination table={table} total={total || 0} />
        </Card.Footer>
      </Card>
      {/* 保存弹窗 */}
      <SaveModal state={saveModalState} initialValues={editData} handleRefresh={handleReset} />
      {/* 删除弹窗 */}
      <DeleteDialog state={delDialogState} loading={delLoading} handleDelConfirm={handleDelConfirm} />
    </>
  )
}
export default Categorys;