/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:48:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 15:33:05
 * @Description: 表格列设置
 */
import { Sliders } from '@gravity-ui/icons';
import { Button, Dropdown, Label, type Selection } from "@heroui/react";
import { Table } from '@tanstack/react-table';

function ColumnsVisibility<TData>({ table }: { table: Table<TData> }) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide()
    );

  const selectedKeys = new Set(
    columns.filter((c) => c.getIsVisible()).map((c) => c.id)
  );

  const handleSelectionChange = (keys: Selection) => {
    const visibleIds = new Set(Array.from(keys));

    columns.forEach((column) => {
      column.toggleVisibility(visibleIds.has(column.id));
    });
  };
  return (
    <Dropdown>
      <Button variant="outline" size='sm'>
        <Sliders />
        列设置
      </Button>
      <Dropdown.Popover className="min-w-37.5">
        <Dropdown.Menu selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={handleSelectionChange}>
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => (
              <Dropdown.Item
                key={column.id}
                id={column.id}
                className="capitalize"
              >
                <Dropdown.ItemIndicator />
                <Label>{column.columnDef?.header as string}</Label>
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default ColumnsVisibility;
