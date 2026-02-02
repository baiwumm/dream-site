/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-02 11:12:26
 * @Description: 网站列表
 */
"use client"
import { CircleCheckFill } from '@gravity-ui/icons';
import { Card, toast, useOverlayState } from "@heroui/react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table';
import { useRequest, useSetState } from 'ahooks';
import { type FC, useEffect, useState } from 'react';

import { getColumns } from './components/columns'
import DataTable from './components/data-table';
import DeleteDialog from './components/delete-dialog';
import HeaderContent from './components/header-content';
import SaveModal from './components/save-modal';

import DataTablePagination from '@/components/DataTablePagination';
import { RESPONSE } from '@/enums';
import { type FileWithPreview } from '@/hooks/use-file-upload';
import { get } from '@/lib/utils';
import { delWebsite, getWebsitesList } from '@/services/websites';

// 初始参数
const InitialParams: App.WebsiteQueryParams = {
  pageIndex: 0,
  pageSize: 10,
  name: '',
  category_id: '',
};

type WebsitesProps = {
  categorysList: App.Category[];
}

const Websites: FC<WebsitesProps> = ({ categorysList = [] }) => {
  // 搜索参数
  const [searchParams, setSearchParams] = useSetState<App.WebsiteQueryParams>(InitialParams);
  // 排序
  const [sorting, setSorting] = useState<SortingState>([]);
  // 受控列
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    desc: false,
    vpn: false,
    commonlyUsed: false,
    updated_at: false
  })

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
    defaultParams: [searchParams]
  });
  const total = get(data, 'total', 0);

  // 发起请求
  const handleSearch = () => {
    run(searchParams)
  }

  // 重置
  const handleReset = () => {
    setSearchParams(InitialParams)
    run(InitialParams)
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
    pageCount: Math.ceil((total || 0) / searchParams.pageSize),
    getRowId: (row: App.Website) => row.id,
    state: {
      pagination: {
        pageIndex: searchParams.pageIndex,
        pageSize: searchParams.pageSize,
      },
      sorting,
      columnVisibility,
    },
    onPaginationChange: setSearchParams,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  })

  useEffect(() => {
    run(searchParams)
  }, [run, searchParams.pageIndex, searchParams.pageSize]);

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
        <HeaderContent
          table={table}
          categorysList={categorysList}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          loading={loading}
          handleSearch={handleSearch}
          handleReset={handleReset}
          saveModalState={saveModalState}
        />
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