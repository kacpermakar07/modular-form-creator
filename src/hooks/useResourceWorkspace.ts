import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getResource,
  provisionResource,
  replaceResource,
  updateBasicInfo,
  updateProjectDetails,
} from '../api/resourcesApi'
import {
  canAccessProjectDetails,
  canProvision,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from '../schemas/resourceRules'
import type { BasicInfo, ProjectDetails, Resource } from '../types/resource'

interface CompletedBuffer {
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
}

export interface ResourceWorkspace {
  resource?: Resource
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
  basicInfo?: BasicInfo
  projectDetails?: ProjectDetails
  isBuffered: boolean
  isBasicInfoComplete: boolean
  isProjectDetailsComplete: boolean
  canAccessProjectDetails: boolean
  canProvision: boolean
  isSavingBasicInfo: boolean
  isSavingProjectDetails: boolean
  isSubmittingChanges: boolean
  isProvisioning: boolean
  saveBasicInfo: (data: BasicInfo) => Promise<void>
  saveProjectDetails: (data: ProjectDetails) => Promise<void>
  submitBufferedChanges: () => Promise<void>
  discardBufferedChanges: () => void
  provision: () => Promise<void>
}

/**
 * Owns a single resource plus the completed-resource edit buffer: for a draft
 * resource, module saves PATCH the backend immediately; for a completed resource,
 * edits are held in local state only and persisted together via PUT on explicit submit.
 */
export function useResourceWorkspace(resourceId: string): ResourceWorkspace {
  const queryClient = useQueryClient()
  const queryKey = ['resource', resourceId]

  const resourceQuery = useQuery({
    queryKey,
    queryFn: () => getResource(resourceId),
  })

  const [buffer, setBuffer] = useState<CompletedBuffer>({})

  // Reset the buffer synchronously during render (not in an effect) when the
  // resource changes, so a direct navigation between two resources never
  // leaks one resource's unsaved edits into another's.
  const [bufferedResourceId, setBufferedResourceId] = useState(resourceId)
  if (bufferedResourceId !== resourceId) {
    setBufferedResourceId(resourceId)
    setBuffer({})
  }

  const resource = resourceQuery.data
  const isCompleted = resource?.status === 'completed'

  function updateCache(next: Resource) {
    queryClient.setQueryData(queryKey, next)
    queryClient.invalidateQueries({ queryKey: ['resources'] })
  }

  const basicInfoMutation = useMutation({
    mutationFn: (data: BasicInfo) => updateBasicInfo(resourceId, data),
    onSuccess: updateCache,
  })

  const projectDetailsMutation = useMutation({
    mutationFn: (data: ProjectDetails) => updateProjectDetails(resourceId, data),
    onSuccess: updateCache,
  })

  const replaceMutation = useMutation({
    mutationFn: () => {
      if (!resource) {
        throw new Error('Resource not loaded yet')
      }
      return replaceResource(resourceId, {
        name: resource.name,
        basicInfo: buffer.basicInfo ?? resource.basicInfo,
        projectDetails: buffer.projectDetails ?? resource.projectDetails,
      })
    },
    onSuccess: (next) => {
      updateCache(next)
      setBuffer({})
    },
  })

  const provisionMutation = useMutation({
    mutationFn: () => provisionResource(resourceId),
    onSuccess: updateCache,
  })

  async function saveBasicInfo(data: BasicInfo) {
    if (isCompleted) {
      setBuffer((prev) => ({ ...prev, basicInfo: data }))
      return
    }
    await basicInfoMutation.mutateAsync(data)
  }

  async function saveProjectDetails(data: ProjectDetails) {
    if (isCompleted) {
      setBuffer((prev) => ({ ...prev, projectDetails: data }))
      return
    }
    await projectDetailsMutation.mutateAsync(data)
  }

  async function submitBufferedChanges() {
    await replaceMutation.mutateAsync()
  }

  function discardBufferedChanges() {
    setBuffer({})
  }

  async function provision() {
    await provisionMutation.mutateAsync()
  }

  return {
    resource,
    isLoading: resourceQuery.isLoading,
    isError: resourceQuery.isError,
    error: resourceQuery.error,
    refetch: resourceQuery.refetch,
    basicInfo: buffer.basicInfo ?? resource?.basicInfo,
    projectDetails: buffer.projectDetails ?? resource?.projectDetails,
    isBuffered: Boolean(buffer.basicInfo ?? buffer.projectDetails),
    isBasicInfoComplete: resource ? isBasicInfoComplete(resource.basicInfo) : false,
    isProjectDetailsComplete: resource
      ? isProjectDetailsComplete(resource.projectDetails)
      : false,
    canAccessProjectDetails: resource ? canAccessProjectDetails(resource) : false,
    canProvision: resource ? canProvision(resource) : false,
    isSavingBasicInfo: basicInfoMutation.isPending,
    isSavingProjectDetails: projectDetailsMutation.isPending,
    isSubmittingChanges: replaceMutation.isPending,
    isProvisioning: provisionMutation.isPending,
    saveBasicInfo,
    saveProjectDetails,
    submitBufferedChanges,
    discardBufferedChanges,
    provision,
  }
}
