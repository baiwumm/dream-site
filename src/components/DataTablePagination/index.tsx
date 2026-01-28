/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-28 09:23:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 10:26:28
 * @Description: 渲染分页
 */
import { ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { Button, ListBox, Select } from "@heroui/react";
import { Table } from '@tanstack/react-table';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  total: number;
}

function DataTablePagination<TData>({ table, total = 0 }: DataTablePaginationProps<TData>) {
  // 渲染中间分页
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  function getPageNumbers(pageIndex: number, pageCount: number, delta = 2) {
    const pages: (number | "...")[] = [];

    const start = Math.max(0, pageIndex - delta);
    const end = Math.min(pageCount - 1, pageIndex + delta);

    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < pageCount - 1) {
      if (end < pageCount - 2) pages.push("...");
      pages.push(pageCount - 1);
    }

    return pages;
  }

  const pages = getPageNumbers(pageIndex, pageCount);
  return (
    <div className="w-full grid grid-cols-[auto_1fr_auto] items-center">
      {/* 条数 */}
      <div className="justify-self-start flex items-center gap-1 text-sm text-muted">
        <span>每页条数:</span>
        <Select
          variant='secondary'
          className="w-30"
          value={table.getState().pagination.pageSize}
          onChange={(key) => table.setPageSize(Number(key))}
          placeholder='请选择'
        >
          <Select.Trigger className="items-center">
            <Select.Value className="text-xs text-muted" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {[5, 10, 20, 50].map(size => {
                const id = `${size}`;
                return (
                  <ListBox.Item key={id} id={size} textValue={id} className="text-xs text-muted">
                    {size} 条/页
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                )
              })}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      <div className="flex items-center justify-center gap-1 justify-self-center">
        {/* 上一页 */}
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
          className="rounded-full"
        >
          <ChevronLeft />
        </Button>
        {/* 中间分页 */}
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              size="sm"
              variant={page === pageIndex ? "primary" : "ghost"}
              onClick={() => table.setPageIndex(page)}
              className="rounded-full"
            >
              {page + 1}
            </Button>
          )
        )}
        {/* 下一页 */}
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
          className="rounded-full"
        >
          <ChevronRight />
        </Button>
      </div>
      {/* 总条数 */}
      <div className="justify-self-end text-sm text-muted">共 {total} 条数据</div>
    </div>
  )
}
export default DataTablePagination;