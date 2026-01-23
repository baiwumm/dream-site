/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 16:01:46
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 18:10:16
 * @Description: 管理后台
 */
"use client"
import { type FC, useState } from 'react';

import Categorys from './components/categorys'
import Websites from './components/websites'

import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/components/animate/tabs';
import { ADMIN_TABS } from '@/enums';

const Admin: FC = () => {
  // 分类列表
  const [categorysList, setCategorysList] = useState<App.Category[]>([]);
  console.log('categorysList', categorysList)
  return (
    <Tabs defaultValue={ADMIN_TABS.CATEGOTYS}>
      <TabsList className="w-full">
        <TabsTrigger value={ADMIN_TABS.CATEGOTYS}>{ADMIN_TABS.label(ADMIN_TABS.CATEGOTYS)}</TabsTrigger>
        <TabsTrigger value={ADMIN_TABS.WEBSITES}>{ADMIN_TABS.label(ADMIN_TABS.WEBSITES)}</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value={ADMIN_TABS.CATEGOTYS}>
          <Categorys categorysList={categorysList} setCategorysList={setCategorysList} />
        </TabsContent>
        <TabsContent value={ADMIN_TABS.WEBSITES}>
          <Websites />
        </TabsContent>
      </TabsContents>
    </Tabs>
  )
}
export default Admin;