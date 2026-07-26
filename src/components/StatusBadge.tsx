import { Badge } from '../design-system'
import type { ResourceStatus } from '../types/resource'

interface StatusBadgeProps {
  status: ResourceStatus
}

const STATUS_LABEL: Record<ResourceStatus, string> = {
  draft: 'Draft',
  completed: 'Completed',
}

const STATUS_VARIANT: Record<ResourceStatus, 'warning' | 'success'> = {
  draft: 'warning',
  completed: 'success',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}
