/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-04 17:20:23
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import DataTablePagination from '@/components/DataTablePagination'
import useRequest from '@/hooks/use-request'
import { get, RESPONSE } from '@/lib/utils'

import { getColumns } from './components/columns'
import DataTable from './components/data-table'
import DeleteDialog from './components/delete-dialog'
import HeaderContent from './components/header-content'
import SaveModal from './components/save-modal'

import type { Category, PaginatingResponse, Website } from '@/types'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { FC } from 'react'

const Websites: FC = () => {
  // 搜索参数
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const searchParams = useMemo(() => ({ name, category_id: categoryId, ...pagination }), [name, categoryId, pagination])
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
  const { data: categorysResult } = useRequest<PaginatingResponse<Category>>('/categorys', {
    params: { pageIndex: 0, pageSize: 999 },
  })
  const categorysList = useMemo(() => categorysResult?.list ?? [], [categorysResult])

  // 请求网站列表
  const { data, loading, run } = useRequest<PaginatingResponse<Website>>('/websites', {
    manual: true,
    params: searchParams,
  })
  const total = useMemo(() => data?.total ?? 0, [data])
  const list = useMemo(() => data?.list ?? [], [data])
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  // 发起请求
  const handleSearch = () => {
    run(searchParams)
  }

  // 重置
  const handleReset = () => {
    setName('')
    setCategoryId('')
    setPagination({ pageIndex: 0, pageSize: 10 })
    run({
      name: '',
      category_id: '',
      pageIndex: 0,
      pageSize: 10,
    })
  }

  // 编辑回调
  const handleEdit = useCallback((row: Website) => {
    setEditData(row)
    setTags(row?.tags ?? [])
    saveModalState.open()
  }, [saveModalState])

  // 新增回调
  const handleAdd = useCallback(() => {
    setEditData(null)
    setTags([])
    saveModalState.open()
  }, [saveModalState])

  // 删除网站
  const { loading: delLoading, run: fetchDelWebsite } = useRequest('/websites', {
    method: 'DELETE',
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
    data: list,
    columns,
    pageCount: Math.ceil((total || 0) / searchParams.pageSize),
    getRowId: (row: Website) => row.id,
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
    run(searchParamsRef.current)
  }, [run, pagination.pageIndex, pagination.pageSize])
  return (
    <>
      <Card className="shadow-lg">
        <HeaderContent
          name={name}
          categoryId={categoryId}
          categorysList={categorysList || []}
          handleAdd={handleAdd}
          handleReset={handleReset}
          handleSearch={handleSearch}
          loading={loading}
          saveModalState={saveModalState}
          setCategoryId={setCategoryId}
          setName={setName}
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
