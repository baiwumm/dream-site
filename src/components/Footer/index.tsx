/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-06 17:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-06 18:15:57
 * @Description: 底部版权
 */
import { Chip, cn, Description, Link, Separator } from "@heroui/react";
import dayjs from 'dayjs';
import Image from 'next/image';
import { type FC, type ReactNode } from 'react';

import { ShimmeringText } from '@/components/ShimmeringText';
import pkg from '#/package.json';

type Social = {
  icon?: ReactNode;
  image?: string;
  url: string;
  label: string;
}

// 备案信息
const IcpLinks: Social[] = [
  {
    image: '/icp.png',
    url: 'https://beian.miit.gov.cn/#/Integrated/index',
    label: process.env.NEXT_PUBLIC_ICP!
  },
  {
    image: '/gongan.png',
    url: 'https://beian.mps.gov.cn/#/query/webSearch',
    label: process.env.NEXT_PUBLIC_GUAN_ICP!
  },
]

const Footer: FC = () => {
  return (
    <footer className="mx-auto w-full container! px-6 py-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-2" id="footer">
      <div className="flex items-center justify-center gap-3 justify-self-center sm:justify-self-start">
        <div className="flex items-center gap-2">
          <div className="size-5 relative">
            <Image src="/logo.svg" fill alt="Logo" />
          </div>
          <ShimmeringText
            text={process.env.NEXT_PUBLIC_APP_NAME!}
            className="text-sm font-black"
            duration={1.5}
            repeatDelay={1}
            color="var(--accent)"
            shimmerColor="var(--accent-foreground)"
          />
        </div>
        <Separator className="h-4 self-center" orientation="vertical" />
        <Chip variant='soft' color='success' size='sm' className="px-2 py-0.5 text-[10px]">
          <div
            data-slot="status-indicator"
            className={cn(
              "relative flex size-2 shrink-0 rounded-full bg-success",
              "before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-inherit",
              "after:absolute after:inset-0.5 after:rounded-full after:bg-inherit"
            )}
          />
          <Chip.Label>服务状态正常</Chip.Label>
        </Chip>
      </div>
      <Description className="justify-self-center">
        &copy; {dayjs().year()} {" "}
        <a href={pkg.author.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          {process.env.NEXT_PUBLIC_COPYRIGHT}
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
            <Image src={image!} alt={label} width={14} height={14} />
            <Description className="hover:text-accent transition-colors">
              {label}
            </Description>
          </Link>
        ))}
      </div>
    </footer>
  )
}
export default Footer;