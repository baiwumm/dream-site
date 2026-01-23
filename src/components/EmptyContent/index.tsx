/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-12-11 14:06:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 16:07:14
 * @Description: 空数据
 */
import { Inbox } from "lucide-react";
import { type FC } from 'react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/empty';

const EmptyContent: FC = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyDescription>暂无数据</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
export default EmptyContent;