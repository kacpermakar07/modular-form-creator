export type ResourceStatus = 'draft' | 'completed'

export type ResourcePriority = 'low' | 'medium' | 'high'

export type ProjectCategory = 'internal' | 'external' | 'vendor'

export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: ResourcePriority | ''
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: ProjectCategory | ''
  options: string[]
}

export interface Resource {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ListResourcesParams {
  page?: number
  pageSize?: number
  status?: ResourceStatus
  name?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ListResourcesResponse {
  items: Resource[]
  pagination: Pagination
}

export interface ReplaceResourcePayload {
  name: string
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
}
