import { useCallback, useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { ToastContext, type ToastVariant } from '../context/ToastContext'

interface ToastMessage {
  id: number
  variant: ToastVariant
  message: string
}

const TOAST_DURATION_MS = 3000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now()

    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, TOAST_DURATION_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastStack>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} $variant={toast.variant} role="status">
            {toast.message}
          </ToastItem>
        ))}
      </ToastStack>
    </ToastContext.Provider>
  )
}

const ToastStack = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1000;
`

const ToastItem = styled.div<{ $variant: ToastVariant }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.raised};
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme, $variant }) =>
    $variant === 'success' ? theme.colors.success : theme.colors.warning};
  min-width: 220px;
`
