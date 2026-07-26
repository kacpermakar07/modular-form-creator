import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../design-system'

const MODULE_LOAD_ERROR_PATTERN =
  /dynamically imported module|error loading dynamically imported module|importing a module script failed/i

interface RouteErrorDetails {
  title: string
  message: string
}

function isModuleLoadError(error: unknown): boolean {
  return error instanceof Error && MODULE_LOAD_ERROR_PATTERN.test(error.message)
}

function describeRouteError(error: unknown): RouteErrorDetails {
  if (isModuleLoadError(error)) {
    return {
      title: 'Connection problem',
      message:
        "We couldn't load part of the app — this usually means the connection dropped. Check you're online and try again.",
    }
  }

  if (isRouteErrorResponse(error)) {
    return {
      title: 'Something went wrong',
      message: `${error.status} ${error.statusText}`,
    }
  }

  if (error instanceof Error) {
    return { title: 'Something went wrong', message: error.message }
  }

  return { title: 'Something went wrong', message: 'Something went wrong.' }
}

export function RouteErrorBoundary() {
  const error = useRouteError()
  const { title, message } = describeRouteError(error)

  return (
    <Wrapper>
      <Title>{title}</Title>

      <Description>{message}</Description>

      <Actions>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reload page
        </Button>

        <Button onClick={() => window.location.assign('/resources')}>
          Back to resources
        </Button>
      </Actions>
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
  color: ${({ theme }) => theme.colors.warning};
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`
