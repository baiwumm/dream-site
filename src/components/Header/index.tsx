/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 17:57:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-06 10:08:48
 * @Description: 顶部导航
 */
"use client"
import { HouseFill, LogoGithub } from '@gravity-ui/icons';
import { Button, Tooltip } from '@heroui/react';
import Image from 'next/image';
import Link from "next/link";
import { type FC, type ReactNode } from 'react';

import { ShimmeringText } from '@/components/ShimmeringText';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import UserAvatar from '@/components/UserAvatar';
import pkg from '#/package.json';

type Social = {
  name: string;
  url: string;
  icon: ReactNode;
}

const socials: Social[] = [
  {
    name: "GitHub",
    url: pkg.git.url,
    icon: <LogoGithub />
  }
]

const Header: FC = () => {
  return (
    <header className="sticky top-0 p-4 z-20 backdrop-blur-sm container mx-auto flex justify-between items-center" id="header">
      {/* 左侧 Logo */}
      <Link href="/">
        <div className="flex gap-2 items-center">
          <Image src='/logo.svg' width={30} height={30} alt="Logo" />
          <ShimmeringText
            text={process.env.NEXT_PUBLIC_APP_NAME!}
            className="text-xl font-black"
            duration={1.5}
            repeatDelay={1}
            color="var(--accent)"
            shimmerColor="var(--accent-foreground)"
          />
        </div>
      </Link>
      {/* 右侧区域 */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {socials.map(({ name, url, icon }) => (
          <Tooltip key={name} delay={0}>
            <Link href={url} aria-label={name} target="_blank">
              <Button variant="ghost" isIconOnly size='sm'>
                {icon}
              </Button>
            </Link>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              {name}
            </Tooltip.Content>
          </Tooltip>
        ))}
        <Tooltip>
          <Link href={pkg.author.url} aria-label="主页" target="_blank">
            <Button variant="ghost" isIconOnly size='sm'>
              <HouseFill />
            </Button>
          </Link>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            个人主页
          </Tooltip.Content>
        </Tooltip>
        {/* 登录用户信息 */}
        <UserAvatar />
      </div>
    </header >
  )
}
export default Header;