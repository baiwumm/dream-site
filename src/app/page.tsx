/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-05 15:23:18
 * @Description: 首页
 */
"use client";
import { Spinner } from '@heroui/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react'; // 👈 新增

import AlertContent from '@/components/AlertContent';
import BlurFade from '@/components/BlurFade';
import WebsiteCard from '@/components/WebSiteCard';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { get } from '@/lib/utils';
import { getCategorysList } from '@/services/categorys';

// 预计算 logoColor 的函数
const computeLogoColor = (logoAccent: string | null | undefined): string => {
  if (logoAccent) {
    // 安全处理 rgba -> rgb + opacity
    return logoAccent
      .replace(/^rgba\(/, 'rgb(')
      .replace(/\)$/, ', 0.85)');
  }

  return 'var(--computed-logo-color-fallback)';
};

export default function Home() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getCategorysList(params), 'data.list', []),
    {
      defaultParams: [{ pageIndex: 0, pageSize: 999 }],
    }
  );

  // 用 useMemo 预处理数据，避免每次 render 重新计算
  const processedData = useMemo(() => {
    return (data as App.Category[]).map((category) => ({
      ...category,
      websites: category.websites?.map((site) => ({
        ...site,
        computedLogoColor: computeLogoColor(site.logoAccent),
      })),
    }));
  }, [data]);

  const reload = () => {
    run({ pageIndex: 0, pageSize: 999 });
  };

  const goAdmin = () => {
    router.push('/admin');
  };

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
    );
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

  if (!processedData.length) {
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {processedData.map(({ id, name, websites }, index) => {
        return (
          <BlurFade key={id} inView delay={index * 0.04} className="flex flex-col gap-2">
            <h1 className="text-xl font-black">{name}</h1>
            {websites?.length ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
                {websites.map((item, idx) => (
                  <BlurFade key={item.id} inView delay={idx * 0.04}>
                    {/* 👇 传入预计算好的颜色 */}
                    <WebsiteCard
                      data={item}
                      logoColor={item.computedLogoColor!}
                      handleClick={handleClick}
                    />
                  </BlurFade>
                ))}
              </div>
            ) : (
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
        );
      })}
    </div>
  );
}

