import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button } from '../design-system'

export function NotFoundPage() {
  return (
    <Wrapper>
      <Title>Page not found</Title>
      <Description>The page you're looking for doesn't exist.</Description>
      <StyledLink to="/resources">
        <Button variant="secondary">Back to resources</Button>
      </StyledLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  margin: 0;
`

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`
