import { z } from 'zod'
import { PROJECT_CATEGORY_VALUES, TEAM_MEMBER_VALUES } from '../constants/resourceOptions'
import type { ProjectDetails } from '../types/resource'

const NAME_PATTERN = /^[A-Za-z0-9 -]+$/
const INTEGER_PATTERN = /^\d+$/

export const projectDetailsSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, 'Project name is required')
    .max(255, 'Project name must be at most 255 characters long')
    .regex(
      NAME_PATTERN,
      'Project name can contain only letters, numbers, spaces, and hyphens',
    ),
  budget: z
    .string()
    .trim()
    .min(1, 'Budget is required')
    .regex(INTEGER_PATTERN, 'Budget must contain only integers'),
  category: z.enum(
    PROJECT_CATEGORY_VALUES,
    'Category must be one of: internal, external, vendor',
  ),
  options: z
    .array(z.enum(TEAM_MEMBER_VALUES))
    .min(1, 'At least one team member is required'),
})

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>

/**
 * The domain ProjectDetails allows an empty `category` (not yet selected on a
 * fresh draft); the form type requires the validated enum. Zod re-validates on
 * every submit, so seeding the form with the as-is domain value is safe at runtime.
 */
export function toProjectDetailsFormValues(
  projectDetails: ProjectDetails,
): ProjectDetailsFormValues {
  return projectDetails as ProjectDetailsFormValues
}
