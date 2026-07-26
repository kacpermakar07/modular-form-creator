import { useState } from 'react'
import styled from 'styled-components'
import { Button, Card } from '../design-system'
import { ModuleProgressCard } from '../components/ModuleProgressCard'
import { useResourceContext } from '../hooks/useResourceContext'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/getErrorMessage'

export function ResourceOverviewPage() {
  const workspace = useResourceContext()
  const { showToast } = useToast()
  const [provisionError, setProvisionError] = useState<string | undefined>()
  const [submitError, setSubmitError] = useState<string | undefined>()

  if (!workspace.resource) {
    return null
  }

  const { resource } = workspace
  const isDraft = resource.status === 'draft'

  async function handleProvision() {
    setProvisionError(undefined)
    try {
      await workspace.provision()
      showToast('Resource provisioned')
    } catch (error) {
      setProvisionError(getErrorMessage(error))
    }
  }

  async function handleSubmitChanges() {
    setSubmitError(undefined)
    try {
      await workspace.submitBufferedChanges()
      showToast('Changes submitted')
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    }
  }

  return (
    <>
      <Modules>
        <ModuleProgressCard
          title="Basic Info"
          description="Owner, contact, and priority details for this resource."
          isComplete={workspace.isBasicInfoComplete}
          to="basic-info"
        />
        <ModuleProgressCard
          title="Project Details"
          description="Budget, category, and team members involved."
          isComplete={workspace.isProjectDetailsComplete}
          to="project-details"
          disabledReason={
            isDraft && !workspace.isBasicInfoComplete
              ? 'Complete Basic Info first to unlock this module.'
              : undefined
          }
        />
      </Modules>

      {workspace.isBuffered ? (
        <Card variant="elevated">
          <SectionTitle>Unsaved changes</SectionTitle>
          <SectionText>
            This resource is completed, so your edits are held locally until you submit
            them. If you leave or refresh the page before submitting, these changes are
            lost.
          </SectionText>
          {submitError ? <ErrorText>{submitError}</ErrorText> : null}
          <Actions>
            <Button
              variant="ghost"
              onClick={workspace.discardBufferedChanges}
              disabled={workspace.isSubmittingChanges}
            >
              Discard changes
            </Button>
            <Button
              onClick={handleSubmitChanges}
              disabled={workspace.isSubmittingChanges}
            >
              {workspace.isSubmittingChanges ? 'Submitting…' : 'Submit changes'}
            </Button>
          </Actions>
        </Card>
      ) : null}

      {isDraft ? (
        <Card variant="outline">
          <SectionTitle>Provisioning</SectionTitle>
          <SectionText>
            Provisioning marks this resource as completed. It is allowed only once both
            modules above are complete, and cannot be undone.
          </SectionText>
          {provisionError ? <ErrorText>{provisionError}</ErrorText> : null}
          <Actions>
            <Button
              onClick={handleProvision}
              disabled={!workspace.canProvision || workspace.isProvisioning}
            >
              {workspace.isProvisioning ? 'Provisioning…' : 'Provision resource'}
            </Button>
          </Actions>
          {!workspace.canProvision ? (
            <HelperText>Both modules must be complete before provisioning.</HelperText>
          ) : null}
        </Card>
      ) : null}
    </>
  )
}

const Modules = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: 1.15rem;
`

const SectionText = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const HelperText = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-family: ${({ theme }) => theme.typography.body};
  font-size: 0.9rem;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`
