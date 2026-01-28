"use client";
import { CircleCheckFill, Folder } from "@gravity-ui/icons";
import { Button, FieldError, Form, Input, Label, Modal, NumberField, Spinner, Surface, TextField, toast, type UseOverlayStateReturn } from "@heroui/react";
import { useRequest } from "ahooks";
import { type FC, type FormEvent, useEffect, useRef } from 'react';

import { RESPONSE } from '@/enums';
import { addCategory, updateCategory } from '@/services/categorys';

type SaveModalProps = {
  state: UseOverlayStateReturn;
  initialValues: App.Category | null;
  handleRefresh: VoidFunction;
}

const SaveModal: FC<SaveModalProps> = ({ state, initialValues, handleRefresh }) => {
  // 表单实例
  const formRef = useRef<HTMLFormElement>(null);
  const actionText = initialValues ? '编辑' : '新增';

  // 保存表单
  const { loading, run } = useRequest(initialValues?.id ? updateCategory : addCategory, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        state.close();
        toast.success("提交成功", {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        });
        handleRefresh?.();
      }
    },
  });

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Partial<App.CategorySaveParams> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    run({ ...data, id: initialValues?.id });
  };

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset();
    }
  }, [state.isOpen]);
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
              <Form ref={formRef} id="category-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
                <TextField
                  isRequired
                  name="name"
                  minLength={1}
                  maxLength={100}
                  defaultValue={initialValues?.name ?? ""}
                  validate={(value) => {
                    if (!value) {
                      return "请输入分类名称";
                    }
                    return null;
                  }}
                >
                  <Label>分类名称</Label>
                  <Input aria-label="Name" fullWidth variant="secondary" placeholder="请输入分类名称" />
                  <FieldError />
                </TextField>
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
            <Button slot="close" variant="outline" isDisabled={loading}>
              取消
            </Button>
            <Button type="submit" form="category-form" isPending={loading}>
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? "正在提交..." : "确定"}
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