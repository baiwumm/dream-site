/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-28 09:01:56
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 14:22:40
 * @Description: 数据表格
 */
import { Spinner } from "@heroui/react";
import { flexRender, type Table as TableInstance } from '@tanstack/react-table';
import { type FC } from 'react';

import EmptyContent from '@/components/EmptyContent';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableProps = {
  table: TableInstance<App.Category>;
  colSpan: number;
  loading: boolean;
}

const DataTable: FC<DataTableProps> = ({ table, colSpan, loading = false }) => {
  return (
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
      <TableBody className="relative">
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
            <TableCell colSpan={colSpan}>
              <EmptyContent />
            </TableCell>
          </TableRow>
        )}
        {loading ? (
          <TableRow className="absolute inset-0 z-10">
            <TableCell colSpan={colSpan} className="p-0">
              <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
export default DataTable;