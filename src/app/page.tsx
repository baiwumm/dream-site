/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-30 15:57:09
 * @Description: 首页
 */
"use client";
import { CircleInfo } from '@gravity-ui/icons';
import { Card, Chip, cn, Link, Spinner, Tooltip } from '@heroui/react';
import { useRequest } from 'ahooks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type CSSProperties } from 'react';

import AlertContent from '@/components/AlertContent';
import BlurFade from '@/components/BlurFade';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { get } from '@/lib/utils';
import { getCategorysList } from '@/services/categorys';

export default function Home() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  // 请求站点数据
  const { data = [], loading, error, run } = useRequest(async (params) => get(await getCategorysList(params), 'data.list', []), {
    defaultParams: [{ pageIndex: 0, pageSize: 999 }]
  });

  // 重新请求
  const reload = () => {
    run({ pageIndex: 0, pageSize: 999 });
  };

  // 跳转后台
  const goAdmin = () => {
    router.push('/admin');
  };

  // 跳转回调
  const handleClick = async (id: string) => {
    await supabase.rpc("increment_visit_count", {
      row_id: id,
    });
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <div className="flex flex-col gap-2 items-center">
          <Spinner />
          <span className="text-xs text-muted font-bold">正在加载，请稍后...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <AlertContent
          status="danger"
          title="请求失败"
          description="服务暂时不可用，请稍后重试。"
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reload}
        />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <AlertContent
          status="accent"
          title="暂无分类数据"
          description="当前还没有任何分类，请前往后台进行添加。"
          actionText="添加分类"
          buttonAction={goAdmin}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {(data as App.Category[]).map(({ id, name, websites }, index) => {
        return (
          <BlurFade key={id} inView delay={index * 0.04} className="flex flex-col gap-2">
            <h1 className="text-xl font-black">{name}</h1>
            {websites?.length ?
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
                {websites.map(({ id, name, desc, vpn, logo, tags, pinned, recommend, url, logoAccent, commonlyUsed }, index) => {
                  const logoUrl = logo ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!}/${logo}` : null;
                  return (
                    <BlurFade key={id} inView delay={index * 0.04}>
                      <Card
                        className={cn("flex flex-col h-full relative overflow-hidden shadow-lg rounded-4xl transition-all duration-300 hover:-translate-y-1.5 animated-border animate-fade after:border-(--logo-border-color)")}
                        onMouseEnter={(e) => {
                          e.currentTarget.classList.add('hovered');
                        }}
                        style={
                          {
                            '--logo-border-color': logoAccent ? logoAccent.replace('rgba(', 'rgb(').replace(')', ' , 0.85)') : `color-mix(in oklab, var(--color-accent) 85%, transparent)`
                          } as CSSProperties
                        }
                      >
                        <Card.Header>
                          <Card.Title className="flex items-center gap-2">
                            {logoUrl ? (
                              <Image src={logoUrl} width={40} height={40} alt={name} />
                            ) : null}
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Link href={url} target='_blank' className="no-underline text-lg font-bold truncate transition ease-in duration-300 cursor-pointer relative after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-accent/30 after:transition-all after:duration-500 hover:translate-x-1 hover:after:w-full" onPress={() => handleClick(id)}>
                                  {name}
                                  <Link.Icon />
                                </Link>
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
                    </BlurFade>
                  )
                })}
              </div>
              : (
                <div className="flex justify-center p-4">
                  <AlertContent
                    status="accent"
                    title="暂无网站数据"
                    description="该分类还没有任何网站，请前往后台进行添加。"
                    actionText="添加网站"
                    buttonAction={goAdmin}
                  />
                </div>
              )}
          </BlurFade>
        )
      })}
    </div>
  )
}

