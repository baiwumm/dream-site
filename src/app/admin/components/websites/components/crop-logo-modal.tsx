/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-07-07 16:40:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 17:48:24
 * @Description: Logo 裁剪弹窗
 */
'use client'
import { Crop } from '@gravity-ui/icons';
import { Button, Modal, type UseOverlayStateReturn } from "@heroui/react"
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop'

import { type FileWithPreview } from '@/hooks/use-file-upload';
import { getCroppedImg } from '@/lib/crop-image'

const MIN_ZOOM = 1
const MAX_ZOOM = 5
const ZOOM_STEP = 0.1

type CropLogoModalProps = {
  state: UseOverlayStateReturn;
  image: string | null
  setInnerFile: Dispatch<SetStateAction<FileWithPreview | null>>
}

const CropLogoModal: FC<CropLogoModalProps> = ({ state, image, setInnerFile }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  /**
   * @description: 裁剪完成
   */
  function onCropComplete(_: Area, croppedPixels: Area) {
    setCroppedAreaPixels(croppedPixels)
  }

  /**
   * @description: 确认裁剪
   */
  const handleCropConfirm = async () => {
    if (!image || !croppedAreaPixels) return;
    const file = await getCroppedImg(
      image,
      croppedAreaPixels
    );
    const preview = URL.createObjectURL(file);
    const newFile: FileWithPreview = {
      id: crypto.randomUUID(),
      file,
      preview,
    };
    setInnerFile(newFile);
    state.close();
  };

  const onReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Crop className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Logo 裁剪</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="py-4 px-1">
            <div className="relative h-100">
              {image && (
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  minZoom={MIN_ZOOM}
                  maxZoom={MAX_ZOOM}
                  zoomSpeed={ZOOM_STEP}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onRotationChange={setRotation}
                  onZoomChange={setZoom}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="outline">取消</Button>
            <Button variant='tertiary' onPress={onReset}>重置</Button>
            <Button onPress={handleCropConfirm}>确认</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default CropLogoModal;