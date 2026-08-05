/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-06 17:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-05 15:25:26
 * @Description: 底部版权
 */
import { Chip, cn, Description, Link, Separator } from '@heroui/react'
import Image from 'next/image'

import { ShimmeringText } from '@/components/ShimmeringText'
import pkg from '#/package.json'

import type { FC, ReactNode } from 'react'

const CURRENT_YEAR = new Date().getFullYear()

interface Social {
  icon?: ReactNode
  image?: string
  url: string
  label: string
}

// 备案信息
const IcpLinks: Social[] = [
  {
    image: '/icp.png',
    url: 'https://beian.miit.gov.cn/#/Integrated/index',
    label: process.env.NEXT_PUBLIC_ICP!,
  },
  {
    image: '/gongan.png',
    url: 'https://beian.mps.gov.cn/#/query/webSearch',
    label: process.env.NEXT_PUBLIC_GUAN_ICP!,
  },
]

const Footer: FC = () => {
  return (
    <footer className="shrink-0 mx-auto w-full container! px-6 py-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
      <div className="flex items-center justify-center gap-3 justify-self-center sm:justify-self-start">
        <div className="flex items-center gap-2">
          <div className="size-5 relative">
            <Image alt="Logo" fill src="/logo.svg" className="object-contain dark:hidden" />
            <Image alt="Logo" fill src="/logo-dark.svg" className="hidden object-contain dark:block" />
          </div>
          <ShimmeringText
            color="var(--foreground)"
            duration={1.5}
            repeatDelay={1}
            shimmerColor="var(--background)"
            text={process.env.NEXT_PUBLIC_APP_NAME!}
            className="text-sm font-black"
          />
        </div>
        <Separator orientation="vertical" className="h-4 self-center" />
        <Chip color="success" size="sm" variant="soft" className="px-2 py-0.5 text-[10px]">
          <div
            data-slot="status-indicator"
            className={cn(
              'relative flex size-2 shrink-0 rounded-full bg-success',
              'before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-inherit',
              'after:absolute after:inset-0.5 after:rounded-full after:bg-inherit',
            )}
          />
          <Chip.Label>服务状态正常</Chip.Label>
        </Chip>
      </div>
      <Description className="justify-self-center">
        &copy;
        {' '}
        {CURRENT_YEAR}
        {' '}
        {' '}
        <a href={pkg.author.url} rel="noopener noreferrer" target="_blank" className="hover:text-accent transition-colors">
          {process.env.NEXT_PUBLIC_AUTHOR_NAME}
        </a>
        . All rights reserved.
      </Description>
      <div className="flex gap-2 items-center flex-col sm:flex-row justify-self-center sm:justify-self-end">
        {IcpLinks.map(({ image, url, label }) => (
          <Link
            key={url}
            href={url}
            target="_blank"
            className="flex gap-1 items-center no-underline"
          >
            <Image alt={label} height={14} src={image!} width={14} />
            <Description className="hover:text-accent transition-colors">
              {label}
            </Description>
          </Link>
        ))}
      </div>
    </footer>
  )
}
export default Footer
