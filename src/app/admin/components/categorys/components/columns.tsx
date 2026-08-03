'use client'
import { PencilToSquare, TrashBin } from '@gravity-ui/icons'
import { Button, Chip } from '@heroui/react'
import { createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'

import type { Category } from '@/types'

const columnHelper = createColumnHelper<Category>()

interface ColumnsProps {
  handleEdit: (row: Category) => void
  handleDel: (row: Category) => void
  page: number
  pageSize: number
}

export function getColumns({
  handleEdit,
  handleDel,
  page = 1,
  pageSize = 10,
}: ColumnsProps) {
  return [
    columnHelper.display({
      id: 'index',
      header: '序号',
      cell: ({ row }) => (
        <Chip>
          {(page - 1) * pageSize + row.index + 1}
        </Chip>
      ),
    }),

    columnHelper.accessor('name', {
      header: '分类名称',
      cell: ({ getValue }) => (
        <Chip color="accent" variant="primary">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.display({
      id: 'websites',
      header: '站点个数',
      cell: ({ row }) => (
        <Chip color="success" variant="soft">
          {row.original.websites?.length || 0}
        </Chip>
      ),
    }),

    columnHelper.accessor('sort', {
      header: '排序',
      cell: ({ getValue }) => (
        <Chip color="warning" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor('created_at', {
      header: '创建时间',
      cell: ({ getValue }) => (
        <span className="text-muted text-xs">
          {dayjs(getValue()).format('YYYY-MM-DD HH:mm')}
        </span>
      ),
    }),

    columnHelper.accessor('updated_at', {
      header: '更新时间',
      cell: ({ getValue }) => (
        <span className="text-muted text-xs">
          {dayjs(getValue()).format('YYYY-MM-DD HH:mm')}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center justify-center min-w-25">
          <Button
            size="sm"
            variant="ghost"
            onPress={() => handleEdit(row.original)}
            className="text-xs"
          >
            <PencilToSquare />
            修改
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onPress={() => handleDel(row.original)}
            className="text-xs text-danger hover:bg-danger-soft"
          >
            <TrashBin />
            删除
          </Button>
        </div>
      ),
    }),
  ]
}
