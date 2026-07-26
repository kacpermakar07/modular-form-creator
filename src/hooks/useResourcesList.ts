import { useQuery } from '@tanstack/react-query'
import { listResources } from '../api/resourcesApi'
import type { ListResourcesParams } from '../types/resource'

const DEFAULT_PARAMS: Required<
  Pick<ListResourcesParams, 'page' | 'pageSize' | 'sortOrder'>
> = {
  page: 1,
  pageSize: 10,
  sortOrder: 'desc',
}

export function useResourcesList(params: ListResourcesParams) {
  const resolvedParams: ListResourcesParams = { ...DEFAULT_PARAMS, ...params }

  return useQuery({
    queryKey: ['resources', resolvedParams],
    queryFn: () => listResources(resolvedParams),
    placeholderData: (previousData) => previousData,
  })
}
