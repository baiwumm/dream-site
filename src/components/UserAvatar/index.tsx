/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 15:44:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 14:04:47
 * @Description: 用户头像
 */
import { useRouter } from '@bprogress/next/app';
import { ArrowRightFromSquare, GearDot, Person } from '@gravity-ui/icons';
import { AlertDialog, Avatar, Button, Dropdown, Label, Separator, Spinner, Tooltip, useOverlayState } from '@heroui/react';
import { type FC, type Key, useState } from 'react';

import { useSupabaseUser } from '@/hooks/use-supabase-user';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const UserAvatar: FC = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  // 获取登录用户信息
  const { user, loading } = useSupabaseUser();
  // 注销 Loading
  const [logoutLoading, setLogoutLoading] = useState(false);
  // 退出确认弹窗
  const [open, setOpen] = useState(false);
  const alertState = useOverlayState();
  // 用户名称
  const name = user?.user_metadata.name || user?.user_metadata.user_name || user?.email?.slice(0, 1);
  // 用户头像
  const avatar = user?.user_metadata.avatar_url as string;

  // 点击菜单回调
  const onClickMenu = (key: Key) => {
    switch (key) {
      case 'admin':
        router.push('/admin');
        break;
      case 'logout':
        setOpen(false);
        setTimeout(() => {
          alertState.open();
        }, 500)
        break;
    }
  }

  // 退出登录
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // 登出
      await supabase.auth.signOut().then(() => {
        alertState.close();
        // 返回首页
        router.push('/login');
      })
    } finally {
      setLogoutLoading(false);
    }
  }

  return loading ? (
    <Spinner size='sm' />
  ) : user ? (
    <>
      <Dropdown isOpen={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <div className="relative">
            <Avatar className="size-8">
              <Avatar.Image alt="在线用户" src={avatar} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 size-2 rounded-full bg-green-500 ring-2 ring-background" />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <div className="flex items-center gap-3 p-3">
            <Avatar size="sm">
              <Avatar.Image alt="在线用户" src={avatar} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col space-y-2 min-w-0">
              <p className="font-medium text-sm leading-none">{name}</p>
              <p className="text-muted-foreground text-xs leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                {user?.email}
              </p>
            </div>
          </div>
          <Separator />
          <Dropdown.Menu className="font-normal" onAction={onClickMenu}>
            <Dropdown.Item id="admin" textValue="Admin">
              <GearDot className="size-4 shrink-0 text-muted" />
              <Label>管理后台</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Logout" variant="danger">
              <ArrowRightFromSquare className="size-4 shrink-0 text-muted" />
              <Label>退出登录</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {/* 确认弹窗 */}
      <AlertDialog.Backdrop isOpen={alertState.isOpen} onOpenChange={alertState.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>温馨提示</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              确定要退出登录吗？
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                取消
              </Button>
              <Button variant="danger" isPending={logoutLoading} onPress={() => handleLogout()}>
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    {isPending ? '正在退出...' : '确认注销'}
                  </>
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  ) : (
    <Tooltip>
      <Button variant="outline" isIconOnly size='sm' className="rounded-full" onClick={() => router.push('/login')}>
        <Person />
      </Button>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        登录
      </Tooltip.Content>
    </Tooltip>
  )
}
export default UserAvatar;