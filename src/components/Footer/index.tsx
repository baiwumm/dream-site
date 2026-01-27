/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-06 17:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 16:15:57
 * @Description: 底部版权
 */
import { Separator } from "@heroui/react";
import dayjs from 'dayjs';
import Image from 'next/image';
import { type FC, type ReactNode } from 'react';

import { ShimmeringText } from '@/components/ShimmeringText';
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
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
    <footer className="flex w-full flex-col backdrop-blur-sm" id="footer">
      <Separator />
      <div className="mx-auto w-full container! px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Image src='/logo.svg' width={20} height={20} alt="Logo" />
              <ShimmeringText
                text={process.env.NEXT_PUBLIC_APP_NAME!}
                className="text-sm font-black"
                duration={1.5}
                repeatDelay={1}
                color="var(--accent)"
                shimmerColor="var(--accent-foreground)"
              />
            </div>
            <Separator className="h-4" orientation="vertical" />
            <Status variant="success" className="text-[10px]">
              <StatusIndicator />
              <StatusLabel>服务状态正常</StatusLabel>
            </Status>
          </div>
          <p className="text-center text-xs text-muted">
            &copy; {dayjs().year()} {" "}
            <a
              href={pkg.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {process.env.NEXT_PUBLIC_COPYRIGHT}
            </a>
            . All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center text-xs text-muted">
          {IcpLinks.map(({ image, url, label }) => (
            <div key={url} className="flex items-center gap-1">
              <Image src={image!} alt={label} width={14} height={14} />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
export default Footer;