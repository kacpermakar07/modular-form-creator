import { useOutletContext } from 'react-router-dom'
import type { ResourceWorkspace } from './useResourceWorkspace'

export function useResourceContext(): ResourceWorkspace {
  return useOutletContext<ResourceWorkspace>()
}
