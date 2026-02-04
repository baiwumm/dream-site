/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 17:57:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-04 09:10:27
 * @Description: 顶部导航
 */
"use client"
import { House } from '@gravity-ui/icons';
import { Button, Tooltip } from '@heroui/react';
import Image from 'next/image';
import Link from "next/link";
import { type FC, type ReactNode } from 'react';

import { ShimmeringText } from '@/components/ShimmeringText';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import UserAvatar from '@/components/UserAvatar';
import { GithubIcon } from '@/lib/icons';
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
    icon: <GithubIcon />
  }
]

const Header: FC = () => {
  return (
    <header className="sticky top-0 border-b border-default h-15 z-20 backdrop-blur-sm" id="header">
      <div className="flex justify-between items-center container mx-auto h-full px-4">
        {/* 左侧 Logo */}
        <Link href="/">
          <div className="flex gap-2 items-center">
            <Image src='/logo.svg' width={36} height={36} alt="Logo" />
            <ShimmeringText
              text={process.env.NEXT_PUBLIC_APP_NAME!}
              className="text-2xl font-black hidden sm:block"
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
                <Button variant="outline" isIconOnly size='sm' className="rounded-full">
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
              <Button variant="outline" isIconOnly size='sm' className="rounded-full">
                <House />
              </Button>
            </Link>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              博客
            </Tooltip.Content>
          </Tooltip>
          {/* 登录用户信息 */}
          <UserAvatar />
        </div>
      </div>
    </header >
  )
}
export default Header;