/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-30 09:49:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-30 09:56:56
 * @Description: 提示框占位
 */
import { Alert, Button } from '@heroui/react'

import type { AlertProps, ButtonVariants } from '@heroui/react'
import type { FC, ReactNode } from 'react'

interface AlertContentProps {
  status: AlertProps['status']
  title: ReactNode
  description: ReactNode
  actionText: ReactNode
  buttonVariant?: ButtonVariants['variant']
  buttonAction?: () => void
  className?: string
}

const AlertContent: FC<AlertContentProps> = ({
  status,
  title,
  description,
  actionText,
  buttonVariant = 'primary',
  buttonAction,
  className = 'max-w-lg shadow-lg',
}) => {
  return (
    <Alert status={status} className={className}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description className="text-xs">
          {description}
        </Alert.Description>
        <Button size="sm" variant={buttonVariant} onPress={buttonAction} className="mt-2 sm:hidden">
          {actionText}
        </Button>
      </Alert.Content>
      <Button size="sm" variant={buttonVariant} onPress={buttonAction} className="hidden sm:block">
        {actionText}
      </Button>
    </Alert>
  )
}
export default AlertContent
