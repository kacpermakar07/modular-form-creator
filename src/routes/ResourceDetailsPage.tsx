import styled from 'styled-components'
import { Card } from '../design-system'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useResourceContext } from '../hooks/useResourceContext'

export function ResourceDetailsPage() {
  const workspace = useResourceContext()

  if (!workspace.resource || !workspace.basicInfo || !workspace.projectDetails) {
    return null
  }

  const { resource, basicInfo, projectDetails } = workspace

  return (
    <>
      <PageHeader
        title="Details"
        subtitle="Read-only summary of both modules."
        actions={<StatusBadge status={resource.status} />}
      />

      {workspace.isBuffered ? (
        <Card variant="elevated">
          <Notice>
            Showing unsaved local edits. Submit them from the overview page to persist.
          </Notice>
        </Card>
      ) : null}

      <Card variant="outline">
        <SectionTitle>Basic Info</SectionTitle>
        <DefinitionList>
          <Row>
            <Term>Resource name</Term>
            <Value>{basicInfo.resourceName || '—'}</Value>
          </Row>
          <Row>
            <Term>Owner</Term>
            <Value>{basicInfo.owner || '—'}</Value>
          </Row>
          <Row>
            <Term>Email</Term>
            <Value>{basicInfo.email || '—'}</Value>
          </Row>
          <Row>
            <Term>Description</Term>
            <Value>{basicInfo.description || '—'}</Value>
          </Row>
          <Row>
            <Term>Priority</Term>
            <Value>{basicInfo.priority || '—'}</Value>
          </Row>
        </DefinitionList>
      </Card>

      <Card variant="outline">
        <SectionTitle>Project Details</SectionTitle>
        <DefinitionList>
          <Row>
            <Term>Project name</Term>
            <Value>{projectDetails.projectName || '—'}</Value>
          </Row>
          <Row>
            <Term>Budget</Term>
            <Value>{projectDetails.budget || '—'}</Value>
          </Row>
          <Row>
            <Term>Category</Term>
            <Value>{projectDetails.category || '—'}</Value>
          </Row>
          <Row>
            <Term>Team members</Term>
            <Value>
              {projectDetails.options.length > 0
                ? projectDetails.options.join(', ')
                : '—'}
            </Value>
          </Row>
        </DefinitionList>
      </Card>
    </>
  )
}

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: 1.15rem;
`

const DefinitionList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`

const Term = styled.dt`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`

const Value = styled.dd`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
  word-break: break-word;
`

const Notice = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`
