import { useRouter } from '@bprogress/next/app'
import { ArrowRightFromSquare, GearDot, Person } from '@gravity-ui/icons'
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Description,
  Dropdown,
  Label,
  Separator,
  Spinner,
  useOverlayState,
} from '@heroui/react'
import { useState } from 'react'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'

import type { User } from '@supabase/supabase-js'
import type { FC, Key } from 'react'

interface UserMenuProps {
  user: User
}

const UserMenu: FC<UserMenuProps> = ({ user }) => {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const alertState = useOverlayState()
  const [logoutLoading, setLogoutLoading] = useState(false)
  // 用户名称
  const name = user?.user_metadata.name || user?.user_metadata.user_name || user?.email?.slice(0, 1)
  // 用户头像
  const avatar = user?.user_metadata.avatar_url as string

  // 点击菜单回调
  const onClickMenu = (key: Key) => {
    switch (key) {
      case 'admin':
        router.push('/admin')
        break
      case 'logout':
        alertState.open()
        break
    }
  }

  // 退出登录
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      // 登出
      await supabase.auth.signOut().then(() => {
        alertState.close()
        // 返回首页
        router.push('/login')
      })
    }
    finally {
      setLogoutLoading(false)
    }
  }
  return (
    <>
      <Dropdown>
        <Dropdown.Trigger>
          <Badge.Anchor>
            <Avatar size="sm">
              <Avatar.Image alt="在线用户" src={avatar} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <Badge color="success" size="sm" placement="bottom-right" className="min-h-2.5 min-w-2.5" />
          </Badge.Anchor>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <div className="flex items-center gap-3 p-3">
            <Avatar size="sm">
              <Avatar.Image alt="在线用户" src={avatar} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0">
              <p className="font-black">{name}</p>
              <Description className="truncate">
                {user?.email}
              </Description>
            </div>
          </div>
          <Separator />
          <Dropdown.Menu onAction={onClickMenu} className="font-normal">
            <Dropdown.Item id="admin" textValue="Admin">
              <GearDot className="size-4 shrink-0 text-muted" />
              <Label>管理后台</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" variant="danger" textValue="Logout">
              <ArrowRightFromSquare className="size-4 shrink-0 text-danger" />
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
              <Button variant="tertiary" slot="close">
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
  )
}
export default UserMenu
