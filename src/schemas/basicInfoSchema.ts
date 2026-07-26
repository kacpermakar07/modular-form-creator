import { z } from 'zod'
import { PRIORITY_VALUES } from '../constants/resourceOptions'
import type { BasicInfo } from '../types/resource'

const NAME_PATTERN = /^[A-Za-z0-9 -]+$/
const OWNER_PATTERN = /^[A-Za-z ]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const basicInfoSchema = z.object({
  resourceName: z
    .string()
    .trim()
    .min(1, 'Resource name is required')
    .max(255, 'Resource name must be at most 255 characters long')
    .regex(
      NAME_PATTERN,
      'Resource name can contain only letters, numbers, spaces, and hyphens',
    ),
  owner: z
    .string()
    .trim()
    .min(1, 'Owner is required')
    .max(255, 'Owner must be at most 255 characters long')
    .regex(OWNER_PATTERN, 'Owner can contain only letters and spaces'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(EMAIL_PATTERN, 'Email must be a valid email format'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters long'),
  priority: z.enum(PRIORITY_VALUES, 'Priority must be one of: low, medium, high'),
})

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>

/**
 * The domain BasicInfo allows an empty `priority` (not yet selected on a fresh
 * draft); the form type requires the validated enum. Zod re-validates on every
 * submit, so seeding the form with the as-is domain value is safe at runtime.
 */
export function toBasicInfoFormValues(basicInfo: BasicInfo): BasicInfoFormValues {
  return basicInfo as BasicInfoFormValues
}
