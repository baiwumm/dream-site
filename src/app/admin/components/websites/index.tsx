/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-03 17:39:19
 * @Description: 网站列表
 */
'use client'
import { CircleCheckFill } from '@gravity-ui/icons'
import { Card, toast, useOverlayState } from '@heroui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,

} from '@tanstack/react-table'
import { useRequest, useSetState } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

import DataTablePagination from '@/components/DataTablePagination'
import { RESPONSE } from '@/enums'
import { get } from '@/lib/utils'
import { getCategoriesList } from '@/services/categorys'
import { delWebsite, getWebsitesList } from '@/services/websites'

import { getColumns } from './components/columns'
import DataTable from './components/data-table'
import DeleteDialog from './components/delete-dialog'
import HeaderContent from './components/header-content'
import SaveModal from './components/save-modal'

import type { Category, Website, WebsiteQueryParams } from '@/types'
import type { SortingState, VisibilityState } from '@tanstack/react-table'
import type { FC } from 'react'

// 初始参数
const InitialParams: WebsiteQueryParams = {
  pageIndex: 0,
  pageSize: 10,
  name: '',
  category_id: '',
}

const Websites: FC = () => {
  // 搜索参数
  const [searchParams, setSearchParams] = useSetState<WebsiteQueryParams>(InitialParams)
  // 排序
  const [sorting, setSorting] = useState<SortingState>([])
  // 受控列
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    desc: false,
    vpn: false,
    commonlyUsed: false,
    updated_at: false,
  })

  // 保存弹窗
  const saveModalState = useOverlayState()
  // 删除弹窗
  const delDialogState = useOverlayState()
  // 编辑数据
  const [editData, setEditData] = useState<Website | null>(null)
  // 站点标签
  const [tags, setTags] = useState<string[]>([])

  // 请求分类列表
  const { data: categorysList } = useRequest(async params => get<Category[]>(await getCategoriesList(params), 'data.list', []), {
    defaultParams: [{ pageIndex: 0, pageSize: 999 }],
  })

  // 请求网站列表
  const { data, loading, run } = useRequest(async params => get(await getWebsitesList(params), 'data', {}), {
    manual: true,
    defaultParams: [searchParams],
  })
  const total = get(data, 'total', 0)

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
  const handleEdit = useCallback((row: Website) => {
    setEditData(row)
    setTags(row?.tags ?? [])
    saveModalState.open()
  }, [saveModalState])

  // 删除网站
  const { loading: delLoading, run: fetchDelWebsite } = useRequest(delWebsite, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        delDialogState.close()
        toast.success('删除成功', {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        })
        handleSearch()
      }
    },
  })

  // 删除回调
  const handleDel = useCallback((row: Website) => {
    setEditData(row)
    delDialogState.open()
  }, [delDialogState])

  // 确认删除回调
  const handleDelConfirm = () => {
    if (editData?.id) {
      fetchDelWebsite(editData.id)
    }
  }

  // 列配置项
  const columns = useMemo(
    () => getColumns({ handleEdit, handleDel, page: get(data, 'page', 0), pageSize: get(data, 'pageSize', 0) }),
    [handleEdit, handleDel, data],
  )

  // 表格实例
  const table = useReactTable({
    data: get(data, 'list', []),
    columns,
    pageCount: Math.ceil((total || 0) / searchParams.pageSize),
    getRowId: (row: Website) => row.id,
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
  }, [run, searchParams.pageIndex, searchParams.pageSize])
  return (
    <>
      <Card className="shadow-lg">
        <HeaderContent
          categorysList={categorysList || []}
          handleReset={handleReset}
          handleSearch={handleSearch}
          loading={loading}
          saveModalState={saveModalState}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          table={table}
        />
        <Card.Content>
          <DataTable loading={loading} table={table} />
        </Card.Content>
        <Card.Footer>
          <DataTablePagination table={table} total={total || 0} />
        </Card.Footer>
      </Card>
      {/* 保存弹窗 */}
      <SaveModal
        categorysList={categorysList || []}
        handleRefresh={handleSearch}
        initialValues={editData}
        setTags={setTags}
        state={saveModalState}
        tags={tags}
        onClose={() => setEditData(null)}
      />
      {/* 删除弹窗 */}
      <DeleteDialog handleDelConfirm={handleDelConfirm} loading={delLoading} state={delDialogState} onClose={() => setEditData(null)} />
    </>
  )
}
export default Websites
