import styled from 'styled-components'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>

      {description ? <Description>{description}</Description> : null}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Title = styled.p`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  font-size: 0.9rem;
  margin: 0;
`
