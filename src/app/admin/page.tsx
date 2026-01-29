/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 16:01:46
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-28 14:50:11
 * @Description: 管理后台
 */
"use client"
import { Folder, Globe } from "@gravity-ui/icons";
import { Tabs } from "@heroui/react";
import { type FC, useState } from 'react';

import Categorys from './components/categorys'
import Websites from './components/websites'

import { ADMIN_TABS } from '@/enums';

const Admin: FC = () => {
  // 分类列表
  const [categorysList, setCategorysList] = useState<App.Category[]>([]);
  return (
    <Tabs>
      <Tabs.ListContainer>
        <Tabs.List aria-label="后台管理">
          <Tabs.Tab id={ADMIN_TABS.CATEGOTYS} className="flex items-center gap-1">
            <Folder />
            {ADMIN_TABS.label(ADMIN_TABS.CATEGOTYS)}
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id={ADMIN_TABS.WEBSITES} className="flex items-center gap-1">
            <Globe />
            {ADMIN_TABS.label(ADMIN_TABS.WEBSITES)}
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id={ADMIN_TABS.CATEGOTYS}>
        <Categorys categorysList={categorysList} setCategorysList={setCategorysList} />
      </Tabs.Panel>
      <Tabs.Panel id={ADMIN_TABS.WEBSITES}>
        <Websites categorysList={categorysList} />
      </Tabs.Panel>
    </Tabs>
  )
}
export default Admin;