import type { ProgressContextValue } from '@bprogress/next'

let progressInstance: ProgressContextValue | null = null

export function setProgressInstance(instance: ProgressContextValue) {
  progressInstance = instance
}

export const getProgress = () => progressInstance
