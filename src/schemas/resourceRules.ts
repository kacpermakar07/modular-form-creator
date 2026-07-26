import { basicInfoSchema } from './basicInfoSchema'
import { projectDetailsSchema } from './projectDetailsSchema'
import type { BasicInfo, ProjectDetails, Resource } from '../types/resource'

export function isBasicInfoComplete(basicInfo: BasicInfo): boolean {
  return basicInfoSchema.safeParse(basicInfo).success
}

export function isProjectDetailsComplete(projectDetails: ProjectDetails): boolean {
  return projectDetailsSchema.safeParse(projectDetails).success
}

export function canAccessProjectDetails(resource: Resource): boolean {
  return resource.status === 'completed' || isBasicInfoComplete(resource.basicInfo)
}

export function canProvision(resource: Resource): boolean {
  return (
    resource.status === 'draft' &&
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}
