/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-02 10:19:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-02 11:22:22
 * @Description: 顶部区域
 */
"use client"
import { ArrowRotateLeft, Magnifier, Plus } from '@gravity-ui/icons';
import { Button, Card, SearchField, Spinner, useOverlayState } from "@heroui/react";
import { type Table } from '@tanstack/react-table';
import type { SetState } from 'ahooks/es/useSetState';
import { type FC, type KeyboardEvent } from 'react';

import ColumnsVisibility from '@/components/ColumnsVisibility';

type HeaderContentProps = {
  table: Table<App.Category>;
  searchParams: App.CategoryQueryParams;
  setSearchParams: SetState<App.CategoryQueryParams>;
  loading: boolean;
  handleSearch: VoidFunction;
  handleReset: VoidFunction;
  saveModalState: ReturnType<typeof useOverlayState>;
}

const HeaderContent: FC<HeaderContentProps> = ({
  table,
  searchParams,
  setSearchParams,
  loading = false,
  handleSearch,
  handleReset,
  saveModalState
}) => {
  // 回车事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return (
    <Card.Header className="flex justify-between items-start w-full flex-col sm:flex-row sm:items-center gap-2">
      <Card.Title className="flex items-center gap-2 flex-wrap">
        <SearchField
          aria-label='分类名称'
          variant='secondary'
          value={searchParams.name}
          onChange={value => setSearchParams({ name: value })}
          onKeyDown={handleKeyDown}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-50" placeholder="分类名称" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <Button isPending={loading} size='sm' onPress={handleSearch}>
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size='sm' /> : <Magnifier />}
              查询
            </>
          )}
        </Button>
        <Button variant="secondary" size='sm' onPress={handleReset} isDisabled={loading}>
          <ArrowRotateLeft />
          重置
        </Button>
        <Button variant="outline" size='sm' onPress={() => saveModalState.open()}>
          <Plus />
          新增
        </Button>
      </Card.Title>
      <ColumnsVisibility table={table} />
    </Card.Header>
  );
}
export default HeaderContent;