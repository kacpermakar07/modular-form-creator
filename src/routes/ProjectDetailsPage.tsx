import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Button, Card, CheckboxGroup, Input, Select } from '../design-system'
import { PageHeader } from '../components/PageHeader'
import {
  PROJECT_CATEGORY_OPTIONS,
  TEAM_MEMBER_VALUES,
} from '../constants/resourceOptions'
import { useResourceContext } from '../hooks/useResourceContext'
import { useToast } from '../hooks/useToast'
import {
  projectDetailsSchema,
  toProjectDetailsFormValues,
  type ProjectDetailsFormValues,
} from '../schemas/projectDetailsSchema'
import { getErrorMessage } from '../utils/getErrorMessage'

const CATEGORY_SELECT_OPTIONS = [
  { value: '', label: 'Select category' },
  ...PROJECT_CATEGORY_OPTIONS,
]

export function ProjectDetailsPage() {
  const workspace = useResourceContext()
  const { showToast } = useToast()
  const projectDetails = workspace.projectDetails

  const form = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: projectDetails && toProjectDetailsFormValues(projectDetails),
  })

  useEffect(() => {
    if (projectDetails) {
      form.reset(toProjectDetailsFormValues(projectDetails))
    }
  }, [projectDetails, form])

  if (!workspace.resource) {
    return null
  }

  if (!workspace.canAccessProjectDetails) {
    return (
      <>
        <PageHeader title="Project Details" />

        <Card variant="outline">
          <LockedText>
            Complete Basic Info first — Project Details unlocks once every Basic Info
            field is filled in.
          </LockedText>
        </Card>
      </>
    )
  }

  if (!projectDetails) {
    return null
  }

  const isCompleted = workspace.resource.status === 'completed'

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await workspace.saveProjectDetails(values)
      form.reset(values)

      if (!isCompleted) {
        showToast('Project Details saved')
      }
    } catch (error) {
      form.setError('root', { message: getErrorMessage(error) })
    }
  })

  return (
    <>
      <PageHeader
        title="Project Details"
        subtitle={
          isCompleted
            ? 'This resource is completed — changes are held locally until submitted from the overview page.'
            : 'Fill in the project scope to finish this module.'
        }
      />

      <Card variant="outline">
        <Form onSubmit={onSubmit}>
          <Input
            label="Project name"
            placeholder="e.g. Internal Portal Revamp"
            error={form.formState.errors.projectName?.message}
            {...form.register('projectName')}
          />

          <Input
            label="Budget"
            inputMode="numeric"
            placeholder="e.g. 15000"
            error={form.formState.errors.budget?.message}
            {...form.register('budget')}
          />

          <Select
            label="Category"
            options={CATEGORY_SELECT_OPTIONS}
            error={form.formState.errors.category?.message}
            {...form.register('category')}
          />

          <Controller
            control={form.control}
            name="options"
            render={({ field }) => (
              <CheckboxGroup
                label="Team members"
                options={[...TEAM_MEMBER_VALUES]}
                value={field.value ?? []}
                onChange={field.onChange}
                error={form.formState.errors.options?.message}
              />
            )}
          />

          {form.formState.errors.root ? (
            <ErrorText>{form.formState.errors.root.message}</ErrorText>
          ) : null}

          <Actions>
            <Button
              type="submit"
              disabled={workspace.isSavingProjectDetails || !form.formState.isDirty}
            >
              {workspace.isSavingProjectDetails ? 'Saving…' : 'Save Project Details'}
            </Button>
          </Actions>
        </Form>
      </Card>
    </>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-family: ${({ theme }) => theme.typography.body};
  font-size: 0.9rem;
  margin: 0;
`

const LockedText = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`
