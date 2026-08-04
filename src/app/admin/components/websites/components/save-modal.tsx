'use client'
import { Check, CircleCheckFill, Globe, Xmark } from '@gravity-ui/icons'
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  NumberField,
  Select,
  Spinner,
  Surface,
  Switch,
  SwitchGroup,
  TextArea,
  TextField,
  toast,

} from '@heroui/react'
import { useRequest } from 'ahooks'
import { useRef, useState } from 'react'

import TagInputs from '@/components/ui/tag-inputs'
import { generateLogoUrl, get, RESPONSE } from '@/lib/utils'
import { addWebsite, updateWebsite, uploadLogo } from '@/services/websites'

import LogoUpload from './logo-upload'

import type { FileWithPreview } from '@/hooks/use-file-upload'
import type { Category, Website, WebsiteSaveParams } from '@/types'
import type { UseOverlayStateReturn } from '@heroui/react'
import type { Dispatch, FC, FormEvent, SetStateAction } from 'react'

const SwitchOptions: { name: string, label: string }[] = [
  { name: 'pinned', label: '置顶' },
  { name: 'vpn', label: 'VPN' },
  { name: 'recommend', label: '推荐' },
  { name: 'commonlyUsed', label: '常用' },
]

interface SaveModalProps {
  state: UseOverlayStateReturn
  initialValues: Website | null
  handleRefresh: VoidFunction
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
  categorysList: Category[]
  onClose?: VoidFunction
}

const SaveModal: FC<SaveModalProps> = ({
  state,
  initialValues,
  handleRefresh,
  tags = [],
  setTags,
  categorysList = [],
  onClose,
}) => {
  // 表单实例
  const formRef = useRef<HTMLFormElement>(null)
  const actionText = initialValues ? '编辑' : '新增'
  // Logo 链接
  const logoUrl = initialValues?.logo ? generateLogoUrl(initialValues.logo) : undefined
  // Logo
  const [logoFile, setLogoFile] = useState<FileWithPreview['file'] | null>(null)

  // 上传成功回调
  const onSuccess = () => {
    state.close()
    toast.success('提交成功', {
      timeout: 2000,
      indicator: <CircleCheckFill />,
    })
    handleRefresh?.()
  }

  // 上传 Logo
  const { loading: uploadLoading, run: fetchUploadLogo } = useRequest(uploadLogo, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        onSuccess()
      }
    },
  })

  // 保存表单
  const { loading, run } = useRequest(initialValues?.id ? updateWebsite : addWebsite, {
    manual: true,
    onSuccess: ({ code, data }) => {
      if (code === RESPONSE.SUCCESS) {
        if (data?.id && logoFile) {
          const formData = new FormData()
          formData.append('file', logoFile as File)
          fetchUploadLogo({ id: data.id, formData })
        }
        else {
          onSuccess()
        }
      }
    },
  })

  // url
  const validateUrl = (value: string) => {
    if (!value) {
      return '请输入网站链接'
    }

    let url: URL
    try {
      url = new URL(value)
    }
    catch {
      return '请输入合法的 URL'
    }

    if (url.protocol !== 'https:') {
      return '网站链接必须以 https:// 开头'
    }

    const hostname = url.hostname

    // 允许 IP（可选）
    const isIP
      = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
        || /^\[[0-9a-f:]+\]$/i.test(hostname) // IPv6

    // 至少包含一个点（example.com）
    const hasDot = hostname.includes('.')

    if (!hasDot && !isIP) {
      return '请输入有效的域名（如 https://example.com）'
    }

    return null
  }

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data: WebsiteSaveParams = {
      id: initialValues?.id,

      // string
      category_id: formData.get('category_id') as string,
      name: formData.get('name') as string,
      desc: (formData.get('desc') as string) ?? '',
      url: formData.get('url') as string,
      logo: (logoFile ? null : initialValues?.logo) ?? null,

      // number
      sort: Number(formData.get('sort')),

      // boolean（checkbox 选中才会存在）
      pinned: formData.has('pinned'),
      vpn: formData.has('vpn'),
      recommend: formData.has('recommend'),
      commonlyUsed: formData.has('commonlyUsed'),

      tags,
    }
    // 新增必须上传 Logo
    if (!initialValues && !logoFile) {
      toast.danger('请上传网站logo', {
        timeout: 2000,
        indicator: <Xmark />,
      })
      return
    }
    run({ ...data, id: initialValues?.id, tags })
  }
  return (
    <Modal.Backdrop
      isDismissable={false}
      isKeyboardDismissDisabled
      isOpen={state.isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          formRef?.current?.reset()
          setTags([])
          setLogoFile(null)
          onClose?.()
        }
        state.setOpen(isOpen)
      }}
    >
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Globe className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{`${actionText}网站`}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="py-4 px-1">
            <Surface variant="default">
              <Form ref={formRef} id="category-form" onSubmit={onSubmit} className="flex flex-col gap-4">
                <Select
                  aria-label="所属分类"
                  name="category_id"
                  variant="secondary"
                  isRequired
                  defaultValue={initialValues?.category_id ?? ''}
                  placeholder="请选择所属分类"
                >
                  <Label>所属分类</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {categorysList?.map(({ id, name }) => (
                        <ListBox.Item key={id} id={id} textValue={name}>
                          {name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <TextField
                  name="name"
                  isRequired
                  defaultValue={initialValues?.name ?? ''}
                  maxLength={100}
                  minLength={1}
                  validate={(value) => {
                    if (!value) {
                      return '请输入网站名称'
                    }
                    return null
                  }}
                >
                  <Label>网站名称</Label>
                  <Input aria-label="网站名称" variant="secondary" fullWidth placeholder="请输入网站名称" />
                  <FieldError />
                </TextField>
                <TextField
                  name="url"
                  isRequired
                  defaultValue={initialValues?.url ?? ''}
                  minLength={1}
                  validate={validateUrl}
                >
                  <Label>网站链接</Label>
                  <Input aria-label="网站链接" variant="secondary" fullWidth placeholder="请输入网站链接" />
                  <FieldError />
                </TextField>
                <div className="flex flex-col gap-1">
                  <Label isRequired htmlFor="logo">Logo</Label>
                  <LogoUpload defaultAvatar={logoUrl} onFileChange={value => setLogoFile(value?.file || null)} />
                </div>
                <TagInputs value={tags} onChange={setTags} />
                <TextField name="desc" defaultValue={initialValues?.desc ?? ''} maxLength={500}>
                  <Label>网站描述</Label>
                  <TextArea aria-label="网站描述" variant="secondary" fullWidth placeholder="请输入网站描述" rows={3} />
                </TextField>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="tags">网站属性</Label>
                  <SwitchGroup orientation="horizontal" className="overflow-x-auto">
                    {SwitchOptions.map(({ name, label }) => (
                      <Switch key={name} name={name} defaultSelected={get(initialValues, name, false)} value="on">
                        {({ isSelected }) => (
                          <Switch.Content>
                            <Switch.Control>
                              <Switch.Thumb>
                                <Switch.Icon>
                                  {isSelected
                                    ? (
                                        <Check className="size-3 text-inherit opacity-100" />
                                      )
                                    : (
                                        <Xmark className="size-3 text-inherit opacity-70" />
                                      )}
                                </Switch.Icon>
                              </Switch.Thumb>
                            </Switch.Control>
                            {label}
                          </Switch.Content>
                        )}
                      </Switch>
                    ))}
                  </SwitchGroup>
                </div>
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
            <Button variant="outline" isDisabled={loading || uploadLoading} slot="close">
              取消
            </Button>
            <Button type="submit" isPending={loading || uploadLoading} form="category-form">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {loading ? '正在提交...' : uploadLoading ? '正在上传 Logo...' : '确定'}
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
