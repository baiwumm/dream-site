"use client"
import { Chip } from "@heroui/react";
import { ColumnDef } from "@tanstack/react-table";

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
  }
]