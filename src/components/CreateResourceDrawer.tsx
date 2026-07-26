import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { Button, Drawer, Input } from '../design-system'
import { createResource } from '../api/resourcesApi'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/getErrorMessage'

interface CreateResourceDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateResourceDrawer({ isOpen, onClose }: CreateResourceDrawerProps) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [resourceName, setResourceName] = useState('')
  const [error, setError] = useState<string | undefined>()

  const createMutation = useMutation({
    mutationFn: (name: string) => createResource(name),
    onSuccess: (resource) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      setResourceName('')
      setError(undefined)
      onClose()
      showToast(`Resource "${resource.name}" created`)
    },
    onError: (mutationError) => setError(getErrorMessage(mutationError)),
  })

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = resourceName.trim()
    if (!trimmed) {
      setError('Resource name is required')
      return
    }
    createMutation.mutate(trimmed)
  }

  function handleClose() {
    setResourceName('')
    setError(undefined)
    onClose()
  }

  return (
    <Drawer title="Create resource" isOpen={isOpen} onClose={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Resource name"
          placeholder="e.g. Q3 Onboarding"
          value={resourceName}
          onChange={(event) => setResourceName(event.target.value)}
          error={error}
          disabled={createMutation.isPending}
          autoFocus
        />
        <Actions>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create resource'}
          </Button>
        </Actions>
      </Form>
    </Drawer>
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
