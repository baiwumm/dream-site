/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 17:57:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-05 15:04:06
 * @Description: 顶部导航
 */
'use client'
import { HouseFill, LogoGithub } from '@gravity-ui/icons'
import { Button, Tooltip } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

import { ShimmeringText } from '@/components/ShimmeringText'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import TimeAndLunar from '@/components/TimeAndLunar'
import UserAvatar from '@/components/UserAvatar'
import pkg from '#/package.json'

import type { FC, ReactNode } from 'react'

interface Social {
  name: string
  url: string
  icon: ReactNode
}

const socials: Social[] = [
  {
    name: 'GitHub',
    url: pkg.git.url,
    icon: <LogoGithub />,
  },
]

const Header: FC = () => {
  return (
    <header className="shrink-0 sticky top-0 p-4 z-20 backdrop-blur-sm container mx-auto flex justify-between items-center">
      {/* 左侧 Logo */}
      <Link href="/">
        <div className="flex gap-2 items-center justify-self-start">
          <div className="size-8 relative">
            <Image alt="Logo" fill src="/logo.svg" className="object-contain dark:hidden" />
            <Image alt="Logo" fill src="/logo-dark.svg" className="hidden object-contain dark:block" />
          </div>
          <ShimmeringText
            color="var(--foreground)"
            duration={1.5}
            repeatDelay={1}
            shimmerColor="var(--background)"
            text={process.env.NEXT_PUBLIC_APP_NAME!}
            className="text-xl font-black"
          />
        </div>
      </Link>
      <TimeAndLunar />
      {/* 右侧区域 */}
      <div className="flex items-center gap-2 justify-self-end">
        <ThemeSwitcher />
        {socials.map(({ name, url, icon }) => (
          <Tooltip key={name} delay={0}>
            <Tooltip.Trigger>
              <Link aria-label={name} href={url} target="_blank">
                <Button size="sm" variant="ghost" isIconOnly>
                  {icon}
                </Button>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content offset={8} placement="bottom" showArrow>
              <Tooltip.Arrow />
              {name}
            </Tooltip.Content>
          </Tooltip>
        ))}
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <Link aria-label="主页" href={pkg.author.url} target="_blank">
              <Button size="sm" variant="ghost" isIconOnly>
                <HouseFill />
              </Button>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Content offset={8} placement="bottom" showArrow>
            <Tooltip.Arrow />
            个人主页
          </Tooltip.Content>
        </Tooltip>
        {/* 登录用户信息 */}
        <UserAvatar />
      </div>
    </header>
  )
}
export default Header
