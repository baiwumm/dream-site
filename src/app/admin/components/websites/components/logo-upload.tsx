'use client';
import { Person, Xmark } from '@gravity-ui/icons';
import { Alert, Button, cn } from "@heroui/react";
import Image from "next/image";
import { type FC } from 'react';

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
  const [
    { files, isDragging, errors },
    { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
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
              <Person className="size-6 text-muted-foreground" />
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
      <div className="text-center space-y-0.5 text-xs text-muted-foreground">
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