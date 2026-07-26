import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Button, Card, Input } from '../design-system'
import { FormInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { PageHeader } from '../components/PageHeader'
import { PRIORITY_OPTIONS } from '../constants/resourceOptions'
import { useResourceContext } from '../hooks/useResourceContext'
import { useToast } from '../hooks/useToast'
import {
  basicInfoSchema,
  toBasicInfoFormValues,
  type BasicInfoFormValues,
} from '../schemas/basicInfoSchema'
import { getErrorMessage } from '../utils/getErrorMessage'

const PRIORITY_SELECT_OPTIONS = [
  { value: '', label: 'Select priority' },
  ...PRIORITY_OPTIONS,
]

export function BasicInfoPage() {
  const workspace = useResourceContext()
  const { showToast } = useToast()
  const basicInfo = workspace.basicInfo

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: basicInfo && toBasicInfoFormValues(basicInfo),
  })

  useEffect(() => {
    if (basicInfo) {
      form.reset(toBasicInfoFormValues(basicInfo))
    }
  }, [basicInfo, form])

  if (!basicInfo) {
    return null
  }

  const isCompleted = workspace.resource?.status === 'completed'

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = { ...values, resourceName: basicInfo.resourceName }

    try {
      await workspace.saveBasicInfo(payload)
      form.reset(payload)

      if (!isCompleted) {
        showToast('Basic Info saved')
      }
    } catch (error) {
      form.setError('root', { message: getErrorMessage(error) })
    }
  })

  return (
    <>
      <PageHeader
        title="Basic Info"
        subtitle={
          isCompleted
            ? 'This resource is completed — changes are held locally until submitted from the overview page.'
            : 'Complete every field to unlock Project Details.'
        }
      />

      <Card variant="outline">
        <Form onSubmit={onSubmit}>
          <Input label="Resource name" value={basicInfo.resourceName} state="locked" />

          <FormInput form={form} name="owner" label="Owner" placeholder="Full name" />

          <FormInput
            form={form}
            name="email"
            type="email"
            label="Email"
            placeholder="owner@example.com"
          />

          <FormInput
            form={form}
            name="description"
            label="Description"
            multiline
            rows={4}
            placeholder="What is this resource for?"
          />

          <FormSelect
            form={form}
            name="priority"
            label="Priority"
            options={PRIORITY_SELECT_OPTIONS}
          />

          {form.formState.errors.root ? (
            <ErrorText>{form.formState.errors.root.message}</ErrorText>
          ) : null}

          <Actions>
            <Button
              type="submit"
              disabled={workspace.isSavingBasicInfo || !form.formState.isDirty}
            >
              {workspace.isSavingBasicInfo ? 'Saving…' : 'Save Basic Info'}
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
