"use client"
import { PencilToSquare, TrashBin } from '@gravity-ui/icons';
import { Button, Chip } from "@heroui/react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from 'dayjs';

export const columns: ColumnDef<App.Category>[] = [
  {
    accessorKey: "index",
    header: '序号',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <Chip className="rounded-full">{pageIndex * pageSize + row.index + 1}</Chip>
      )
    }
  },
  {
    accessorKey: "name",
    header: '分类名称',
    cell: ({ getValue }) => <Chip color="accent" variant='primary' className="rounded-full">{getValue<string>()}</Chip>
  },
  {
    accessorKey: "websites",
    header: '站点个数',
    cell: ({ row }) => <Chip color="success" variant="soft" className="rounded-full">{row.original.websites?.length || 0}</Chip>
  },
  {
    accessorKey: "sort",
    header: '排序',
    cell: ({ getValue }) => <Chip color="warning" variant='soft' className="rounded-full">{getValue<number>()}</Chip>
  },
  {
    accessorKey: "created_at",
    header: '创建时间',
    cell: ({ row }) => <span className="text-muted text-xs">{dayjs(row.original.created_at).format('YYYY-MM-DD HH:mm')}</span>
  },
  {
    accessorKey: "updated_at",
    header: '更新时间',
    cell: ({ row }) => <span className="text-muted text-xs">{dayjs(row.original.updated_at).format('YYYY-MM-DD HH:mm')}</span>
  },
  {
    accessorKey: "actions",
    header: '操作',
    cell: ({ row }) => (
      <div className="flex items-center justify-center min-w-25">
        <Button size='sm' variant='ghost' className="text-xs">
          <PencilToSquare />
          修改
        </Button>
        <Button size='sm' variant="ghost" className="text-xs text-danger hover:bg-danger-soft">
          <TrashBin />
          删除
        </Button>
      </div>
    )
  }
]