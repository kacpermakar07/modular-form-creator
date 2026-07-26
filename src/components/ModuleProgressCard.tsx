import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../design-system'

interface ModuleProgressCardProps {
  title: string
  description: string
  isComplete: boolean
  to: string
  disabledReason?: string
}

export function ModuleProgressCard({
  title,
  description,
  isComplete,
  to,
  disabledReason,
}: ModuleProgressCardProps) {
  return (
    <StyledCard variant="outline">
      <Header>
        <Title>{title}</Title>

        <Badge variant={isComplete ? 'success' : 'neutral'}>
          {isComplete ? 'Complete' : 'Incomplete'}
        </Badge>
      </Header>

      <Description>{description}</Description>

      {disabledReason ? (
        <Locked>{disabledReason}</Locked>
      ) : (
        <StyledLink to={to}>
          {isComplete ? 'Review module' : 'Continue module'} →
        </StyledLink>
      )}
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  margin: 0;
`

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
  font-size: 0.9rem;
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Locked = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
  font-style: italic;
`
