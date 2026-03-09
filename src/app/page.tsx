/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 17:11:14
 * @Description: 首页
 */
"use client";
import { useRequest } from 'ahooks';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import AlertContent from '@/components/AlertContent';
import BlurFade from '@/components/BlurFade';
import LoadingContent from '@/components/LoadingContent';
import WebsiteCard from '@/components/WebSiteCard';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { get } from '@/lib/utils';
import { getCategorysList } from '@/services/categorys';

export default function Home() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const { data = [] as App.Category[], loading, error, run } = useRequest(
    async (params) =>
      get(await getCategorysList(params), 'data.list', []),
    {
      defaultParams: [{ pageIndex: 0, pageSize: 999 }],
    }
  );

  const reload = () => {
    run({ pageIndex: 0, pageSize: 999 });
  };

  const goAdmin = () => {
    router.push('/admin');
  };

  const handleClick = useCallback(async (id: string) => {
    await supabase.rpc("increment_visit_count", {
      row_id: id,
    });
  }, [supabase]);

  if (loading) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <LoadingContent text='正在加载，请稍后...' />
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map(({ id, name, websites }, index) => {
        return (
          <BlurFade key={id} inView delay={index * 0.04} className="flex flex-col gap-2">
            <h1 className="text-xl font-black">{name}</h1>
            {websites?.length ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
                {websites.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { y: 20, opacity: 0, filter: 'blur(6px)' },
                      visible: { y: 0, opacity: 1, filter: 'none' }
                    }}
                    transition={{
                      delay: 0.04 * idx,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    {/* 👇 传入预计算好的颜色 */}
                    <WebsiteCard data={item} handleClick={handleClick} />
                  </motion.div>
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

