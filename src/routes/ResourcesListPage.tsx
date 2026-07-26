import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, IconButton, Input, Select } from '../design-system'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { CreateResourceDrawer } from '../components/CreateResourceDrawer'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { deleteResource } from '../api/resourcesApi'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useResourcesList } from '../hooks/useResourcesList'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/getErrorMessage'
import type { Resource, ResourceStatus } from '../types/resource'

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
]

export function ResourcesListPage() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ResourceStatus | ''>('')
  const [nameFilter, setNameFilter] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const debouncedName = useDebouncedValue(nameFilter, 300)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Resource | null>(null)

  const resourcesQuery = useResourcesList({
    page,
    pageSize: 10,
    status: status || undefined,
    name: debouncedName || undefined,
    sortOrder,
  })

  const deleteMutation = useMutation({
    mutationFn: (resourceId: number) => deleteResource(resourceId),
    onSuccess: (resource) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      setPendingDelete(null)
      showToast(`Resource "${resource.name}" deleted`)
    },
  })

  function handleNameFilterChange(value: string) {
    setNameFilter(value)
    setPage(1)
  }

  function handleStatusChange(value: ResourceStatus | '') {
    setStatus(value)
    setPage(1)
  }

  function handleSortOrderChange(value: 'asc' | 'desc') {
    setSortOrder(value)
    setPage(1)
  }

  const resources = resourcesQuery.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Resources"
        subtitle="Create, track, and complete resources through the module workflow."
        actions={<Button onClick={() => setIsCreateOpen(true)}>+ Create resource</Button>}
      />

      <Card variant="outline">
        <Filters>
          <Input
            label="Search by name"
            placeholder="Search…"
            value={nameFilter}
            onChange={(event) => handleNameFilterChange(event.target.value)}
          />

          <Select
            label="Status"
            options={STATUS_FILTER_OPTIONS}
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value as ResourceStatus | '')
            }
          />

          <Select
            label="Sort"
            options={SORT_OPTIONS}
            value={sortOrder}
            onChange={(event) =>
              handleSortOrderChange(event.target.value as 'asc' | 'desc')
            }
          />
        </Filters>
      </Card>

      {resourcesQuery.isLoading ? <LoadingState label="Loading resources…" /> : null}

      {resourcesQuery.isError ? (
        <ErrorState
          message={getErrorMessage(resourcesQuery.error)}
          onRetry={() => resourcesQuery.refetch()}
        />
      ) : null}

      {resourcesQuery.isSuccess && resources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="Create your first resource using the button above."
        />
      ) : null}

      {resources.length > 0 ? (
        <List>
          {resources.map((resource) => (
            <ResourceRow key={resource.resourceId} variant="outline">
              <RowMain>
                <RowLink to={`/resources/${resource.resourceId}`}>
                  {resource.name}
                </RowLink>

                <StatusBadge status={resource.status} />
              </RowMain>

              <IconButton
                type="button"
                variant="ghost"
                aria-label={`Delete ${resource.name}`}
                onClick={() => setPendingDelete(resource)}
              >
                🗑
              </IconButton>
            </ResourceRow>
          ))}
        </List>
      ) : null}

      {resourcesQuery.data ? (
        <Pagination
          page={resourcesQuery.data.pagination.page}
          totalPages={resourcesQuery.data.pagination.totalPages}
          onPageChange={setPage}
        />
      ) : null}

      <CreateResourceDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <ConfirmDialog
        title="Delete resource"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        isOpen={Boolean(pendingDelete)}
        isConfirming={deleteMutation.isPending}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete.resourceId)
          }
        }}
      />
    </>
  )
}

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 180px;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ResourceRow = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const RowMain = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const RowLink = styled(Link)`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`
