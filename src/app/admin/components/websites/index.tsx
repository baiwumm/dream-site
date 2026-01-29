/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-29 17:30:31
 * @Description: 网站列表
 */
"use client"
import { ArrowRotateLeft, CircleCheckFill, Magnifier, Plus } from '@gravity-ui/icons';
import { Button, Card, Input, ListBox, Select, Spinner, toast, useOverlayState } from "@heroui/react";
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
import { type FC, useEffect, useState } from 'react';

import { getColumns } from './components/columns'
import DataTable from './components/data-table';
import DeleteDialog from './components/delete-dialog';
import SaveModal from './components/save-modal';

import ColumnsVisibility from '@/components/ColumnsVisibility';
import DataTablePagination from '@/components/DataTablePagination';
import { RESPONSE } from '@/enums';
import { type FileWithPreview } from '@/hooks/use-file-upload';
import { get } from '@/lib/utils';
import { delWebsite, getWebsitesList } from '@/services/websites';

type WebsitesProps = {
  categorysList: App.Category[];
}

const Websites: FC<WebsitesProps> = ({ categorysList = [] }) => {
  // 分页参数
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // 排序
  const [sorting, setSorting] = useState<SortingState>([]);
  // 受控列
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    desc: false,
    vpn: false,
    commonlyUsed: false,
    updated_at: false
  })
  // 网站名称
  const [name, setName] = useState('');
  // 分类 id
  const [categoryId, setCategoryId] = useState('');
  // 保存弹窗
  const saveModalState = useOverlayState();
  // 删除弹窗
  const delDialogState = useOverlayState();
  // 编辑数据
  const [editData, setEditData] = useState<App.Website | null>(null);
  // 站点标签
  const [tags, setTags] = useState<string[]>([]);
  // Logo
  const [logoFile, setLogoFile] = useState<FileWithPreview['file'] | null>(null);

  // 请求网站列表
  const { data, loading, run } = useRequest(async (params) => get(await getWebsitesList(params), 'data', {}), {
    defaultParams: [{ name, category_id: categoryId, ...pagination }]
  });
  const total = get(data, 'total', 0);

  // 发起请求
  const handleSearch = () => {
    run({ name, category_id: categoryId, ...pagination })
  }

  // 重置
  const handleReset = () => {
    setName('');
    setCategoryId('');
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    run({ name: '', category_id: '', ...pagination })
  }

  // 编辑回调
  const handleEdit = (row: App.Website) => {
    setEditData(row)
    setTags(row?.tags ?? [])
    saveModalState.open()
  }

  // 删除网站
  const { loading: delLoading, run: fetchDelWebsite } = useRequest(delWebsite, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        delDialogState.close();
        toast.success("删除成功", {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        });
        handleSearch();
      }
    },
  });

  // 删除回调
  const handleDel = (row: App.Website) => {
    setEditData(row)
    delDialogState.open()
  }

  // 确认删除回调
  const handleDelConfirm = () => {
    if (editData?.id) {
      fetchDelWebsite(editData.id)
    }
  }

  // 列配置项
  const columns = getColumns({ handleEdit, handleDel, page: get(data, 'page', 0), pageSize: get(data, 'pageSize', 0) });

  // 表格实例
  const table = useReactTable({
    data: get(data, 'list', []),
    columns,
    pageCount: Math.ceil((total || 0) / pagination.pageSize),
    getRowId: (row: App.Website) => row.id,
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
    run({ name, category_id: categoryId, ...pagination })
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
              <Input variant='secondary' placeholder="网站名称" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Select
              aria-label='所属分类'
              className="w-60"
              placeholder="所属分类"
              variant='secondary'
              value={categoryId}
              onChange={(id) => setCategoryId(id as string)}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categorysList?.map(({ id, name }) => (
                    <ListBox.Item key={id} id={id} textValue={name}>
                      {name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
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
      <SaveModal
        state={saveModalState}
        initialValues={editData}
        handleRefresh={handleSearch}
        tags={tags}
        setTags={setTags}
        categorysList={categorysList}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
      />
      {/* 删除弹窗 */}
      <DeleteDialog state={delDialogState} loading={delLoading} handleDelConfirm={handleDelConfirm} />
    </>
  )
}
export default Websites;