import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { RippleButton } from "@/components/animate-ui/components/buttons/ripple"
import { useDataGrid } from '@/components/ui/data-grid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface DataGridPaginationProps {
  sizes?: number[];
  sizesInfo?: string;
  sizesLabel?: string;
  sizesDescription?: string;
  sizesSkeleton?: ReactNode;
  more?: boolean;
  moreLimit?: number;
  infoSkeleton?: ReactNode;
  className?: string;
  rowsPerPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  ellipsisText?: string;
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { table, recordCount, isLoading } = useDataGrid();

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: 'Show',
    sizesDescription: 'per page',
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    infoSkeleton: <Skeleton className="h-8 w-60" />,
    rowsPerPageLabel: '每页条数',
    previousPageLabel: 'Go to previous page',
    nextPageLabel: 'Go to next page',
    ellipsisText: '...',
  };

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };

  const btnBaseClasses = 'size-7 p-0 text-sm';
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();

  // Replace placeholders in paginationInfo
  const paginationInfo = `"第 ${from} - ${to} 条，共 ${recordCount} 条"`;

  // Pagination limit logic
  const paginationMoreLimit = mergedProps?.moreLimit || 5;

  // Determine the start and end of the pagination group
  const currentGroupStart = Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount);

  // Render page buttons based on the current group
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <RippleButton
          key={i}
          size="sm"
          mode="icon"
          variant="ghost"
          className={cn(btnBaseClasses, 'text-muted-foreground', {
            'bg-accent text-accent-foreground': pageIndex === i,
          })}
          onClick={() => {
            if (pageIndex !== i) {
              table.setPageIndex(i);
            }
          }}
        >
          {i + 1}
        </RippleButton>,
      );
    }
    return buttons;
  };

  // Render a "previous" ellipsis button if there are previous pages to show
  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <RippleButton
          size="sm"
          mode="icon"
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
        >
          {mergedProps.ellipsisText}
        </RippleButton>
      );
    }
    return null;
  };

  // Render a "next" ellipsis button if there are more pages to show after the current group
  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <RippleButton
          className={btnBaseClasses}
          variant="ghost"
          size="sm"
          mode="icon"
          onClick={() => table.setPageIndex(currentGroupEnd)}
        >
          {mergedProps.ellipsisText}
        </RippleButton>
      );
    }
    return null;
  };

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        'flex flex-wrap flex-col sm:flex-row justify-between items-center gap-2.5 py-2.5 sm:py-0 grow',
        mergedProps?.className,
      )}
    >
      {/* 左侧每页条数 */}
      <div className="flex flex-wrap items-center gap-1 sm:order-0 order-2">
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <div className="text-sm text-muted-foreground">{mergedProps.rowsPerPageLabel}</div>
            <Select
              value={`${pageSize}`}
              indicatorPosition="right"
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
              }}
            >
              <SelectTrigger className="w-fit" size="sm">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-12.5">
                {mergedProps?.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {`${size}条/页`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      {/* 中间分页 */}
      <div className="flex items-center gap-1 sm:order-0 order-1">
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : pageCount > 1 ? (
          <>
            <RippleButton
              size="sm"
              mode="icon"
              variant="ghost"
              className={btnArrowClasses}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{mergedProps.previousPageLabel}</span>
              <ChevronLeftIcon className="size-4" />
            </RippleButton>

            {renderEllipsisPrevButton()}

            {renderPageButtons()}

            {renderEllipsisNextButton()}

            <RippleButton
              size="sm"
              mode="icon"
              variant="ghost"
              className={btnArrowClasses}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{mergedProps.nextPageLabel}</span>
              <ChevronRightIcon className="size-4" />
            </RippleButton>
          </>
        ) : null}
      </div>
      {/* 右侧总条数 */}
      <div className="text-sm text-muted-foreground text-nowrap sm:order-0 order-3">
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : paginationInfo}
      </div>
    </div>
  );
}

export { DataGridPagination, type DataGridPaginationProps };
