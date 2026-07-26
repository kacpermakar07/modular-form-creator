import type { SelectOption } from '../design-system'

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export const PROJECT_CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const

export const TEAM_MEMBER_VALUES = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

const PRIORITY_LABELS: Record<(typeof PRIORITY_VALUES)[number], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PROJECT_CATEGORY_LABELS: Record<(typeof PROJECT_CATEGORY_VALUES)[number], string> =
  {
    internal: 'Internal',
    external: 'External',
    vendor: 'Vendor',
  }

export const PRIORITY_OPTIONS: SelectOption[] = PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))

export const PROJECT_CATEGORY_OPTIONS: SelectOption[] = PROJECT_CATEGORY_VALUES.map(
  (value) => ({
    value,
    label: PROJECT_CATEGORY_LABELS[value],
  }),
)
