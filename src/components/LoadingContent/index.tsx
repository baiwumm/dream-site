/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-09 16:17:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 16:59:52
 * @Description: Loading
 */
import { Description, Spinner } from "@heroui/react";
import { type FC } from 'react';

type LoadingContentProps = {
  text?: string;
}

const LoadingContent: FC<LoadingContentProps> = ({ text = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Spinner />
      <Description className="font-black">{text}</Description>
    </div>
  )
}
export default LoadingContent;