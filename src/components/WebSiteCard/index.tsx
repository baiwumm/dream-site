/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-05 14:08:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 15:42:42
 * @Description: 站点卡片
 */
"use client";
import { CircleInfo } from '@gravity-ui/icons';
import { Card, Chip, cn, Tooltip } from '@heroui/react';
import Image from 'next/image';
import { type CSSProperties, type FC, memo, useCallback } from 'react';

import { generateLogoUrl } from '@/lib/utils';

type WebsiteCardProps = {
  data: App.Website;
  handleClick: (id: string) => Promise<void>;
}

const WebsiteCard: FC<WebsiteCardProps> = memo(function WebsiteCard({ data, handleClick }) {
  const { id, name, desc, vpn, logo, tags, pinned, recommend, url, commonlyUsed, logoAccent } = data || {};

  const handleLinkPress = useCallback(() => {
    handleClick(id);
    window.open(url)
  }, [handleClick, id, url]);
  return (
    <Card
      className={cn("flex flex-col h-full relative overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1.5 animated-border animate-fade cursor-pointer after:border-[var(--logo-border-color)]")}
      onMouseEnter={(e) => {
        e.currentTarget.classList.add('hovered');
      }}
      style={{
        "--logo-border-color": logoAccent || "var(--accent)"
      } as CSSProperties}
      onClick={handleLinkPress}
    >
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          {logo ? (
            <Image src={generateLogoUrl(logo)} width={40} height={40} alt={name} />
          ) : null}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold">{name}</div>
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
                  <Chip key={tag} variant='soft' className="rounded-full text-[10px]/4">{tag}</Chip>
                ))}
              </div>
            ) : null}
          </div>
        </Card.Title>
        {desc ? (
          <Card.Description className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1">{desc}</Card.Description>
        ) : null}
      </Card.Header>
      <div className="absolute right-2 top-2 flex gap-1">
        {/* 置顶标签 */}
        {pinned ? (
          <Chip color="success" variant='soft' className="rounded-full text-[10px]/4">置顶</Chip>
        ) : null}
        {/* 是否推荐 */}
        {recommend ? (
          <Chip color="warning" variant='soft' className="rounded-full text-[10px]/4">推荐</Chip>
        ) : null}
        {/* 是否常用 */}
        {commonlyUsed ? (
          <Chip variant='soft' className="rounded-full text-[10px]/4 text-blue-500 bg-blue-100 dark:bg-blue-200">常用</Chip>
        ) : null}
      </div>
    </Card>
  )
})
export default WebsiteCard;