"use client"
import { Check, PencilToSquare, TrashBin, Xmark } from '@gravity-ui/icons';
import { Button, Chip, Link, Switch } from "@heroui/react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from 'dayjs';
import Image from 'next/image';

import { generateLogoUrl } from '@/lib/utils';

type ColumnsProps = {
  handleEdit: (row: App.Website) => void;
  handleDel: (row: App.Website) => void;
  page: number;
  pageSize: number;
}

export const getColumns = ({ handleEdit, handleDel, page = 1, pageSize = 10 }: ColumnsProps): ColumnDef<App.Website>[] => {
  return [
    {
      accessorKey: "index",
      header: '序号',
      cell: ({ row }) => <Chip className="rounded-full">{(page - 1) * pageSize + row.index + 1}</Chip>
    },
    {
      accessorKey: "name",
      header: '网站名称',
      cell: ({ getValue, row }) => (
        <Link href={row.original.url} target='_blank'>
          {getValue<string>()}
          <Link.Icon />
        </Link>
      )
    },
    {
      accessorKey: "desc",
      header: '网站描述'
    },
    {
      accessorKey: "logo",
      header: 'Logo',
      cell: ({ getValue, row }) => {
        const url = getValue<string>();
        if (url) {
          return (
            <div className="flex justify-center">
              <Image src={generateLogoUrl(url)} width={32} height={32} alt={row.original.name} />
            </div>
          )
        }
        return '--'
      }
    },
    {
      accessorKey: "tags",
      header: '标签',
      cell: ({ getValue }) => {
        const tags = getValue<string[]>();
        return tags?.length ? (
          <div className="flex justify-center items-center gap-1">
            {getValue<string[]>().map(tag => (
              <Chip key={tag} color="accent" variant='soft' className="rounded-full">{tag}</Chip>
            ))}
          </div>
        ) : '--'
      }
    },
    {
      accessorKey: "category",
      header: '所属分类',
      cell: ({ row }) => <Chip color='success' variant='soft' className="rounded-full">{row.original.category.name}</Chip>
    },
    {
      accessorKey: "visitCount",
      header: '访问次数',
      cell: ({ getValue }) => <Chip color="accent" variant='secondary' className="rounded-full">{getValue<number>()}</Chip>
    },
    {
      accessorKey: "sort",
      header: '排序',
      cell: ({ getValue }) => <Chip color="warning" variant='soft' className="rounded-full">{getValue<number>()}</Chip>
    },
    ...[
      { accessorKey: "pinned", header: '置顶' },
      { accessorKey: "vpn", header: 'VPN' },
      { accessorKey: "recommend", header: '推荐' },
      { accessorKey: "commonlyUsed", header: '常用' }
    ].map<ColumnDef<App.Website>>(({ accessorKey, header }) => ({
      accessorKey,
      header,
      cell: ({ getValue }) => (
        <Switch isSelected={getValue<boolean>()} isReadOnly>
          {({ isSelected }) => (
            <Switch.Control>
              <Switch.Thumb>
                <Switch.Icon>
                  {isSelected ? (
                    <Check className="size-3 text-inherit opacity-100" />
                  ) : (
                    <Xmark className="size-3 text-inherit opacity-70" />
                  )}
                </Switch.Icon>
              </Switch.Thumb>
            </Switch.Control>
          )}
        </Switch>
      )
    })),
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
          <Button size='sm' variant='ghost' className="text-xs" onPress={() => handleEdit(row.original)}>
            <PencilToSquare />
            修改
          </Button>
          <Button
            size='sm'
            variant="ghost"
            className="text-xs text-danger hover:bg-danger-soft"
            onPress={() => handleDel(row.original)}
          >
            <TrashBin />
            删除
          </Button>
        </div>
      )
    }
  ]
}