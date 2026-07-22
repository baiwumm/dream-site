'use client'
import { useProgress } from '@bprogress/next';
import { type FC, useEffect } from 'react';

import { setProgressInstance } from '@/lib/progress'

const ProgressBridge: FC = () => {
  const progress = useProgress()

  useEffect(() => {
    setProgressInstance(progress)
  }, [progress])

  return null
}
export default ProgressBridge;