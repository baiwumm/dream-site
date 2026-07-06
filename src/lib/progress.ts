import type { ProgressContextValue } from '@bprogress/next'

let progressInstance: ProgressContextValue | null = null

export const setProgressInstance = (instance: ProgressContextValue) => {
  progressInstance = instance
}

export const getProgress = () => progressInstance