import { Table } from '@tanstack/react-table';
import { Settings2 } from "lucide-react";
import { ReactNode } from 'react';

import { RippleButton } from "@/components/animate-ui/components/buttons/ripple"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function DataGridColumnVisibility<TData>({ table, trigger }: { table: Table<TData>; trigger?: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? trigger : (
          <RippleButton variant="outline" size='sm'>
            <Settings2 />
            列设置
          </RippleButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-37.5">
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.columnDef.meta?.headerTitle || column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataGridColumnVisibility };
