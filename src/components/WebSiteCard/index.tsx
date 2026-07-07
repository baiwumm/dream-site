/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-05 14:08:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 15:55:57
 * @Description: 站点卡片
 */
"use client";
import { BookmarkFill, CircleInfo, PinFill, ThumbsUpFill } from '@gravity-ui/icons';
import { Card, Chip, cn, Description, Tooltip } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import { type FC, memo } from 'react';

import { generateLogoUrl } from '@/lib/utils';

type WebsiteCardProps = {
  data: App.Website;
  handleClick: (id: string) => Promise<void>;
}

const WebsiteCard: FC<WebsiteCardProps> = memo(function WebsiteCard({ data, handleClick }) {
  const { id, name, desc, vpn, logo, tags, pinned, recommend, url, commonlyUsed } = data || {};
  return (
    <Link href={url} target='_blank'>
      <Card
        className={cn("h-full transition-transform duration-300 hover:-translate-y-1.5 justify-between")}
        onClick={() => handleClick(id)}
      >
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            {logo ? (
              <div className="size-10 relative">
                <Image
                  src={generateLogoUrl(logo)}
                  alt={name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="text-base font-bold">{name}</div>
                {vpn ? (
                  <Tooltip delay={0}>
                    <Tooltip.Trigger aria-label="VPN">
                      <CircleInfo className="text-muted" />
                    </Tooltip.Trigger>
                    <Tooltip.Content showArrow>
                      <Tooltip.Arrow />
                      访问需要开启 VPN 服务
                    </Tooltip.Content>
                  </Tooltip>
                ) : null}
              </div>
              {tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Chip key={tag} variant='soft' className="text-[10px]/4">{tag}</Chip>
                  ))}
                </div>
              ) : null}
            </div>
          </Card.Title>
          {desc ? (
            <Card.Description className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1">{desc}</Card.Description>
          ) : null}
        </Card.Header>
        <Card.Footer className="flex justify-end">
          <div className='flex items-center gap-2 text-xs text-muted'>
            {/* 置顶 */}
            {pinned ? (
              <div className="flex items-center gap-0.5">
                <PinFill className="size-3" />
                <Description>置顶</Description>
              </div>
            ) : null}
            {/* 推荐 */}
            {recommend ? (
              <div className="flex items-center gap-0.5">
                <ThumbsUpFill className="size-3" />
                <Description>推荐</Description>
              </div>
            ) : null}
            {/* 常用 */}
            {commonlyUsed ? (
              <div className="flex items-center gap-0.5">
                <BookmarkFill className="size-3" />
                <Description>常用</Description>
              </div>
            ) : null}
          </div>
        </Card.Footer>
      </Card>
    </Link>
  )
})
export default WebsiteCard;