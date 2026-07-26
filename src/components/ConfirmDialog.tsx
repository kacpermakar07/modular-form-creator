import styled from 'styled-components'
import { Button, Drawer } from '../design-system'

interface ConfirmDialogProps {
  title: string
  message: string
  isOpen: boolean
  isConfirming?: boolean
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  isOpen,
  isConfirming = false,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Drawer title={title} isOpen={isOpen} onClose={onCancel}>
      <Message>{message}</Message>
      <Actions>
        <Button variant="ghost" onClick={onCancel} disabled={isConfirming}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isConfirming}>
          {confirmLabel}
        </Button>
      </Actions>
    </Drawer>
  )
}

const Message = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.ink};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`
