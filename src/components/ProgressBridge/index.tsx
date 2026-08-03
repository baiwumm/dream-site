'use client'
import { useProgress } from '@bprogress/next'
import { useEffect } from 'react'

import { setProgressInstance } from '@/lib/progress'

import type { FC } from 'react'

const ProgressBridge: FC = () => {
  const progress = useProgress()

  useEffect(() => {
    setProgressInstance(progress)
  }, [progress])

  return null
}
export default ProgressBridge
