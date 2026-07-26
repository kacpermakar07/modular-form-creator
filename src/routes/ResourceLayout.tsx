import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../design-system'
import { ApiError } from '../api/ApiError'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useResourceWorkspace } from '../hooks/useResourceWorkspace'
import { getErrorMessage } from '../utils/getErrorMessage'

const NAV_ITEMS: Array<{ to: string; label: string; end?: boolean }> = [
  { to: '', label: 'Overview', end: true },
  { to: 'basic-info', label: 'Basic Info' },
  { to: 'project-details', label: 'Project Details' },
  { to: 'details', label: 'Details' },
]

export function ResourceLayout() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const workspace = useResourceWorkspace(resourceId ?? '')

  if (workspace.isLoading) {
    return <LoadingState label="Loading resource…" />
  }

  if (workspace.isError || !workspace.resource) {
    const isNotFound =
      workspace.error instanceof ApiError && workspace.error.status === 404

    return (
      <ErrorState
        message={isNotFound ? 'Resource not found.' : getErrorMessage(workspace.error)}
        onRetry={isNotFound ? undefined : workspace.refetch}
      />
    )
  }

  const { resource } = workspace

  return (
    <>
      <BackLink to="/resources">← Back to resources</BackLink>

      <PageHeader
        title={resource.name}
        subtitle={`Resource #${resource.resourceId}`}
        actions={<StatusBadge status={resource.status} />}
      />

      <Nav>
        {NAV_ITEMS.map((item) => (
          <NavTab key={item.label} to={item.to} end={item.end}>
            {item.label}
          </NavTab>
        ))}
      </Nav>

      <Outlet context={workspace} />
    </>
  )
}

const BackLink = styled(Link)`
  align-self: flex-start;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-family: ${({ theme }) => theme.typography.body};
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Nav = styled(Card).attrs({ variant: 'outline' })`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const NavTab = styled(NavLink)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-weight: 600;

  &.active {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`
