"use client";
import { Check, CircleCheckFill, Globe, Xmark } from "@gravity-ui/icons";
import {
  Button,
  Description,
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
  TextArea,
  TextField,
  toast,
  type UseOverlayStateReturn
} from "@heroui/react";
import { useRequest } from "ahooks";
import { type Dispatch, type FC, type FormEvent, Fragment, type SetStateAction, useEffect, useRef } from 'react';

import LogoUpload from './logo-upload';

import TagInputs from "@/components/ui/tag-inputs";
import { RESPONSE } from '@/enums';
import { type FileWithPreview } from '@/hooks/use-file-upload';
import { generateLogoUrl, get } from '@/lib/utils'
import { addWebsite, updateWebsite, uploadLogo } from '@/services/websites';

const SwitchOptions: { name: string, label: string }[] = [
  { name: 'pinned', label: '置顶' },
  { name: 'vpn', label: 'VPN' },
  { name: 'recommend', label: '推荐' },
  { name: 'commonlyUsed', label: '常用' }
]

type SaveModalProps = {
  state: UseOverlayStateReturn;
  initialValues: App.Website | null;
  handleRefresh: VoidFunction;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  categorysList: App.Category[];
  logoFile: FileWithPreview['file'] | null;
  setLogoFile: Dispatch<SetStateAction<FileWithPreview['file'] | null>>;
}

const SaveModal: FC<SaveModalProps> = ({
  state,
  initialValues,
  handleRefresh,
  tags = [],
  setTags,
  categorysList = [],
  logoFile,
  setLogoFile
}) => {
  // 表单实例
  const formRef = useRef<HTMLFormElement>(null);
  const actionText = initialValues ? '编辑' : '新增';
  // Logo 链接
  const logoUrl = initialValues?.logo ? generateLogoUrl(initialValues.logo) : undefined;

  // 上传成功回调
  const onSuccess = () => {
    state.close();
    toast.success("提交成功", {
      timeout: 2000,
      indicator: <CircleCheckFill />,
    });
    handleRefresh?.();
  }

  // 上传 Logo
  const { loading: uploadLoading, run: fetchUploadLogo } = useRequest(uploadLogo, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        onSuccess();
      }
    },
  });

  // 保存表单
  const { loading, run } = useRequest(initialValues?.id ? updateWebsite : addWebsite, {
    manual: true,
    onSuccess: ({ code, data }) => {
      if (code === RESPONSE.SUCCESS) {
        if (data?.id && logoFile) {
          const formData = new FormData();
          formData.append('file', logoFile as File);
          fetchUploadLogo({ id: data.id, formData })
        } else {
          onSuccess();
        }
      }
    },
  });

  // url
  const validateUrl = (value: string) => {
    if (!value) {
      return "请输入网站链接";
    }

    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return "请输入合法的 URL";
    }

    if (url.protocol !== "https:") {
      return "网站链接必须以 https:// 开头";
    }

    const hostname = url.hostname;

    // 允许 IP（可选）
    const isIP =
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
      /^\[[0-9a-fA-F:]+\]$/.test(hostname); // IPv6

    // 至少包含一个点（example.com）
    const hasDot = hostname.includes(".");

    if (!hasDot && !isIP) {
      return "请输入有效的域名（如 https://example.com）";
    }

    return null;
  }

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Partial<App.CategorySaveParams> = {};
    formData.forEach((value, key) => {
      if (key === 'sort') {
        data[key] = Number(value);
      }
      else {
        data[key] = value;
      }
    });
    SwitchOptions.map(item => item.name).forEach(key => {
      data[key] = data[key] === 'on';
    })
    // 新增必须上传 Logo
    if (!initialValues && !logoFile) {
      toast.danger("请上传网站logo", {
        timeout: 2000,
        indicator: <Xmark />,
      });
      return
    }
    run({ ...data, id: initialValues?.id, tags });
  };

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset();
      setTags([]);
      setLogoFile(null);
    }
  }, [state.isOpen, setTags, setLogoFile]);
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
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
              <Form ref={formRef} id="category-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
                <Select
                  name='category_id'
                  isRequired
                  aria-label='所属分类'
                  placeholder="请选择所属分类"
                  variant='secondary'
                  defaultValue={initialValues?.category_id ?? ""}
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
                  isRequired
                  name="name"
                  minLength={1}
                  maxLength={100}
                  defaultValue={initialValues?.name ?? ""}
                  validate={(value) => {
                    if (!value) {
                      return "请输入网站名称";
                    }
                    return null;
                  }}
                >
                  <Label>网站名称</Label>
                  <Input aria-label="网站名称" fullWidth variant="secondary" placeholder="请输入网站名称" />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  name="url"
                  minLength={1}
                  defaultValue={initialValues?.url ?? ""}
                  validate={validateUrl}
                >
                  <Label>网站链接</Label>
                  <Input aria-label="网站链接" fullWidth variant="secondary" placeholder="请输入网站链接" />
                  <FieldError />
                </TextField>
                <div className="flex flex-col gap-1">
                  <Label isRequired htmlFor="logo">Logo</Label>
                  <LogoUpload defaultAvatar={logoUrl} onFileChange={(value) => setLogoFile(value?.file || null)} />
                </div>
                <TextField name="logoAccent" defaultValue={initialValues?.logoAccent ?? ""}>
                  <Label>Logo 主色</Label>
                  <Input aria-label="Logo 主色" fullWidth variant="secondary" placeholder="请输入 Logo 主色" />
                  <Description>用于显示边框动画，不设置默认主题色。</Description>
                </TextField>
                <TagInputs value={tags} onChange={setTags} />
                <TextField name="desc" maxLength={500} defaultValue={initialValues?.desc ?? ""}>
                  <Label>网站描述</Label>
                  <TextArea aria-label="网站描述" fullWidth variant="secondary" rows={3} placeholder="请输入网站描述" />
                </TextField>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="tags">网站属性</Label>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {SwitchOptions.map(({ name, label }) => (
                      <Switch key={name} name={name} defaultSelected={get(initialValues, name, false)} value="on">
                        {({ isSelected }) => (
                          <>
                            <Label className="text-sm">{label}</Label>
                            <Switch.Control>
                              <Switch.Thumb>
                                <Switch.Icon>
                                  {isSelected ? (
                                    <Check className="size-3 text-inherit opacity-100" />
                                  ) : (
                                    <Xmark className="size-3 text-inherit opacity-70" />
                                  )}
                                </Switch.Icon>
                              </Switch.Thumb>
                            </Switch.Control>
                          </>
                        )}
                      </Switch>
                    ))}
                  </div>
                </div>
                <NumberField
                  isRequired
                  validate={(value) => {
                    if (!value) {
                      return "请输入排序";
                    }
                    return null;
                  }}
                  maxValue={99}
                  minValue={1}
                  name="sort"
                  defaultValue={initialValues?.sort ?? 1}
                  variant="secondary"
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
            <Button slot="close" variant="outline" isDisabled={loading || uploadLoading}>
              取消
            </Button>
            <Button type="submit" form="category-form" isPending={loading || uploadLoading}>
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {loading ? "正在提交..." : uploadLoading ? '正在上传 Logo...' : "确定"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default SaveModal;