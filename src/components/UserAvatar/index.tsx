/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 15:44:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-22 17:02:37
 * @Description: 用户头像
 */
import { useRouter } from '@bprogress/next/app';
import { CircleAlert, IdCard, LogOut, User } from 'lucide-react';
import { type FC, type MouseEvent, useState } from 'react';

import { RippleButton } from "@/components/animate-ui/components/buttons/ripple"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator, AvatarStatus } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useControlledState } from '@/hooks/use-controlled-state';
import { useSupabaseUser } from '@/hooks/use-supabase-user';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

const UserAvatar: FC = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  // 获取登录用户信息
  const { user, loading } = useSupabaseUser();
  console.log('user', user)
  // 注销 Loading
  const [logoutLoading, setLogoutLoading] = useState(false);
  // 退出确认弹窗
  // const [isOpen, setIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useControlledState({
    value: false,
  });
  // 用户名称
  const name = user?.user_metadata.name || user?.user_metadata.user_name || user?.email?.slice(0, 1);
  // 用户头像
  const avatar = user?.user_metadata.avatar_url as string;

  // 退出登录
  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ⚠️ 阻止 AlertDialogAction 默认关闭行为
    setLogoutLoading(true);
    try {
      // 登出
      await supabase.auth.signOut().then(() => {
        setIsOpen(false);
        // 返回首页
        router.push('/');
      })
    } finally {
      setLogoutLoading(false);
    }
  }

  return loading ? (
    <Spinner variant='circle' className="size-4" />
  ) : user ? (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 w-full">
            <Avatar className="size-8">
              <AvatarImage alt="在线用户" src={avatar} />
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
              <AvatarIndicator className="-end-1.5 -bottom-1.5">
                <AvatarStatus variant="online" className="size-2.5" />
              </AvatarIndicator>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage alt="在线用户" src={avatar} />
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2 min-w-0">
                <p className="font-medium text-sm leading-none">{name}</p>
                <p className="text-muted-foreground text-xs leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/admin')}>
            <IdCard />
            <span>管理后台</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)} variant="destructive">
            <LogOut />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* 确认弹窗 */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <CircleAlert className="size-5 text-blue-500" />
              <AlertDialogTitle>温馨提示</AlertDialogTitle>
            </div>
            <AlertDialogDescription>确定要退出登录吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={logoutLoading}>
              {logoutLoading ? <Spinner /> : null}
              {logoutLoading ? '正在退出...' : '确认'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <RippleButton variant="outline" radius="full" mode="icon" size='sm' onClick={() => router.push('/login')}>
          <User />
        </RippleButton>
      </TooltipTrigger>
      <TooltipContent>登录</TooltipContent>
    </Tooltip>
  )
}
export default UserAvatar;