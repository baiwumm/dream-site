import { useProgress } from '@bprogress/next'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  request,
} from '@/lib/request'

import type { IResponse } from '@/types'

type RequestPayload = Record<string, unknown> | FormData

interface RunFunction<T> {
  (
    data?: RequestPayload,
  ): Promise<IResponse<T>>

  (
    id: string | number,
    data?: RequestPayload,
  ): Promise<IResponse<T>>
}

interface UseRequestOptions<T> {

  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'

  params?: Record<string, unknown>

  manual?: boolean

  onSuccess?: (
    result: IResponse<T>,
  ) => void

  onError?: (
    error: unknown,
  ) => void

  onFinally?: () => void
}

export default function useRequest<
  T = unknown,
>(
  url: string,
  options: UseRequestOptions<T> = {},
) {
  const {
    method = 'GET',
    manual = false,
    onSuccess,
    onError,
    onFinally,
  } = options
  const { start, stop } = useProgress()
  const [data, setData]
    = useState<T>()

  const [loading, setLoading]
    = useState(false)

  const [error, setError]
    = useState<unknown>()

  const run = useCallback(
    (async (
      idOrData?: string | number | RequestPayload,
      body?: RequestPayload,
    ) => {
      try {
        start()
        setLoading(true)

        setError(undefined)

        let requestUrl = url

        let params:
          Record<string, unknown>
          | undefined

        let requestBody: RequestPayload | undefined

        switch (method) {
          case 'GET':

            params
              = idOrData as Record<string, unknown>

            break

          case 'POST':

            requestBody
              = idOrData as RequestPayload

            break

          case 'PUT':

            requestUrl
              = url.includes(':id')
                ? url.replace(':id', String(idOrData))
                : `${url}/${idOrData}`

            requestBody
              = body

            break

          case 'DELETE':

            requestUrl
              = `${url}/${idOrData}`

            break
        }

        const result
          = await request<T>(
            requestUrl,
            {
              method,
              params,
              body:
                requestBody instanceof FormData
                  ? requestBody
                  : requestBody
                    ? JSON.stringify(requestBody)
                    : undefined,
            },
          )

        setData(result.data)

        onSuccess?.(
          result,
        )

        return result
      }
      catch (err) {
        setError(err)

        onError?.(err)

        throw err
      }
      finally {
        stop()
        setLoading(false)

        onFinally?.()
      }
    }) as RunFunction<T>,
    [
      url,
      method,
      onSuccess,
      onError,
      onFinally,
      start,
      stop,
    ],
  )

  useEffect(() => {
    if (!manual) {
      run()
    }
  }, [
    manual,
    run,
  ])

  return {
    data,
    loading,
    error,
    run,
  }
}
