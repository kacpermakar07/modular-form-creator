import { ApiError } from './ApiError'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

type QueryValue = string | number | boolean | undefined

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(path, BASE_URL)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function request<TResponse>(
  path: string,
  init?: RequestInit & { query?: Record<string, QueryValue> },
): Promise<TResponse> {
  const { query, ...requestInit } = init ?? {}
  const response = await fetch(buildUrl(path, query), {
    ...requestInit,
    headers: {
      'Content-Type': 'application/json',
      ...requestInit.headers,
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await response.json() : undefined

  if (!response.ok) {
    const message =
      (body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : undefined) ?? `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, body?.details)
  }

  return body as TResponse
}

export const httpClient = {
  get<TResponse>(path: string, query?: object) {
    return request<TResponse>(path, {
      method: 'GET',
      query: query as Record<string, QueryValue>,
    })
  },
  post<TResponse>(path: string, data?: unknown) {
    return request<TResponse>(path, { method: 'POST', body: JSON.stringify(data) })
  },
  patch<TResponse>(path: string, data?: unknown) {
    return request<TResponse>(path, { method: 'PATCH', body: JSON.stringify(data) })
  },
  put<TResponse>(path: string, data?: unknown) {
    return request<TResponse>(path, { method: 'PUT', body: JSON.stringify(data) })
  },
  delete<TResponse>(path: string) {
    return request<TResponse>(path, { method: 'DELETE' })
  },
}
