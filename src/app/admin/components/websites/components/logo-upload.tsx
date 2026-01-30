'use client';
import { Picture, Xmark } from '@gravity-ui/icons';
import { Alert, Button, cn } from "@heroui/react";
import Image from "next/image";
import { type FC, useEffect, useState } from 'react';

import { type FileWithPreview, formatBytes, useFileUpload } from '@/hooks/use-file-upload';

type LogoUploadProps = {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

const LogoUpload: FC<LogoUploadProps> = ({
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  onFileChange,
  defaultAvatar,
}) => {
  const [innerFile, setInnerFile] = useState<FileWithPreview | null>(null);
  const [
    { files, isDragging, errors },
    { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      // ✅ 只更新 LogoUpload 自己的 state
      setInnerFile(files[0] ?? null);
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  // ✅ 副作用阶段再通知父组件
  useEffect(() => {
    onFileChange?.(innerFile);
  }, [innerFile, onFileChange]);

  return (
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
            <div className="flex h-full w-full items-center justify-center">
              <Picture className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {currentFile && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            className="size-6 absolute end-0 top-0 rounded-full"
            aria-label="删除 Logo"
          >
            <Xmark className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center text-xs text-muted-foreground">
        请上传小于 {formatBytes(maxSize)} 的图片
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert status="danger" className="mt-5">
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
      )}
    </div>
  );
}
export default LogoUpload;