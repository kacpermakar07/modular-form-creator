import { httpClient } from './httpClient'
import type {
  BasicInfo,
  ListResourcesParams,
  ListResourcesResponse,
  ProjectDetails,
  ReplaceResourcePayload,
  Resource,
} from '../types/resource'

export function listResources(params: ListResourcesParams) {
  return httpClient.get<ListResourcesResponse>('/api/resources', params)
}

export function getResource(resourceId: number | string) {
  return httpClient.get<Resource>(`/api/resources/${resourceId}`)
}

export function createResource(resourceName: string) {
  return httpClient.post<Resource>('/api/resources', { resourceName })
}

export function updateBasicInfo(resourceId: number | string, data: BasicInfo) {
  return httpClient.patch<Resource>(`/api/resources/${resourceId}/basic-info`, data)
}

export function updateProjectDetails(resourceId: number | string, data: ProjectDetails) {
  return httpClient.patch<Resource>(`/api/resources/${resourceId}/project-details`, data)
}

export function provisionResource(resourceId: number | string) {
  return httpClient.patch<Resource>(`/api/resources/${resourceId}/provisioning`)
}

export function replaceResource(
  resourceId: number | string,
  data: ReplaceResourcePayload,
) {
  return httpClient.put<Resource>(`/api/resources/${resourceId}`, data)
}

export function deleteResource(resourceId: number | string) {
  return httpClient.delete<Resource>(`/api/resources/${resourceId}`)
}
