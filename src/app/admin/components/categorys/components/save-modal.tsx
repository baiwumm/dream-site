'use client'
import { CircleCheckFill, Folder } from '@gravity-ui/icons'
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  NumberField,
  Spinner,
  Surface,
  TextField,
  toast,

} from '@heroui/react'
import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'

import { RESPONSE } from '@/enums'
import { addCategory, updateCategory } from '@/services/categorys'

import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'

interface SaveModalProps {
  state: UseOverlayStateReturn
  initialValues: App.Category | null
  handleRefresh: VoidFunction
  onClose?: VoidFunction
}

const SaveModal: FC<SaveModalProps> = ({ state, initialValues, handleRefresh, onClose }) => {
  // 表单实例
  const formRef = useRef<HTMLFormElement>(null)
  const actionText = initialValues ? '编辑' : '新增'

  // 保存表单
  const { loading, run } = useRequest(initialValues?.id ? updateCategory : addCategory, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        state.close()
        toast.success('提交成功', {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        })
        handleRefresh?.()
      }
    },
  })

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data: App.CategorySaveParams = {
      name: formData.get('name') as string,
      sort: Number(formData.get('sort')),
      id: initialValues?.id,
    }
    run(data)
  }

  useEffect(() => {
    if (!state.isOpen) {
      formRef?.current?.reset()
      onClose?.()
    }
  }, [state.isOpen, onClose])
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Folder className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{`${actionText}分类`}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="py-4 px-1">
            <Surface variant="default">
              <Form ref={formRef} id="category-form" onSubmit={onSubmit} className="flex flex-col gap-4">
                <TextField
                  name="name"
                  isRequired
                  defaultValue={initialValues?.name ?? ''}
                  maxLength={100}
                  minLength={1}
                  validate={(value) => {
                    if (!value) {
                      return '请输入分类名称'
                    }
                    return null
                  }}
                >
                  <Label>分类名称</Label>
                  <Input aria-label="Name" variant="secondary" fullWidth placeholder="请输入分类名称" />
                  <FieldError />
                </TextField>
                <NumberField
                  name="sort"
                  variant="secondary"
                  isRequired
                  defaultValue={initialValues?.sort ?? 1}
                  maxValue={99}
                  minValue={1}
                  validate={(value) => {
                    if (!value) {
                      return '请输入排序'
                    }
                    return null
                  }}
                >
                  <Label>排序</Label>
                  <NumberField.Group>
                    <NumberField.DecrementButton />
                    <NumberField.Input />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>
              </Form>
            </Surface>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" isDisabled={loading} slot="close">
              取消
            </Button>
            <Button type="submit" isPending={loading} form="category-form">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? '正在提交...' : '确定'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default SaveModal
