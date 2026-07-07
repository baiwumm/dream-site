'use client';
import { CircleXmarkFill, Picture, Xmark } from '@gravity-ui/icons';
import { Alert, Button, cn, Description, Surface, toast, useOverlayState } from "@heroui/react";
import Image from "next/image";
import { type FC, useEffect, useMemo, useState } from 'react';

import CropLogoModal from './crop-logo-modal'

import { type FileWithPreview, formatBytes, useFileUpload } from '@/hooks/use-file-upload';

type LogoUploadProps = {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

const LogoUpload: FC<LogoUploadProps> = ({
  maxSize = 1 * 1024 * 1024, // 1MB
  className,
  onFileChange,
  defaultAvatar,
}) => {
  const [innerFile, setInnerFile] = useState<FileWithPreview | null>(null);
  const cropModalState = useOverlayState();
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [
    { isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      const file = files[0];
      if (!file?.preview) return;
      setCropImage(file.preview);
      cropModalState.open()
    },
    onError: (errors) => {
      if (errors?.length) {
        toast.danger(errors[0], {
          timeout: 2000,
          indicator: <CircleXmarkFill />,
        });
      }
    }
  });

  const previewUrl = useMemo(() => innerFile?.preview ?? defaultAvatar, [innerFile, defaultAvatar])

  // ✅ 副作用阶段再通知父组件
  useEffect(() => {
    if (innerFile) {
      onFileChange?.(innerFile);
    }
  }, [innerFile, onFileChange]);

  return (
    <>
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="relative">
          <div
            className={cn(
              'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/20',
              previewUrl && 'border-solid',
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input {...getInputProps()} className="sr-only" />

            {previewUrl ? (
              <Image src={previewUrl} alt="Logo" fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Picture className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Remove Button - only show when file is uploaded */}
          {innerFile && (
            <Button
              size="sm"
              variant="outline"
              isIconOnly
              onPress={() => setInnerFile(null)}
              className="absolute inset-e-0 top-0 size-6"
              aria-label="删除 Logo"
            >
              <Xmark />
            </Button>
          )}
        </div>

        {/* Upload Instructions */}
        <Description className="text-center">
          请上传小于 {formatBytes(maxSize)} 的图片
        </Description>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Surface className="w-full rounded-3xl p-4" variant="secondary">
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>上传失败</Alert.Title>
                <Alert.Description>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert.Description>
              </Alert.Content>
            </Alert>
          </Surface>
        )}
      </div>
      <CropLogoModal state={cropModalState} image={cropImage} setInnerFile={setInnerFile} />
    </>
  );
}
export default LogoUpload;