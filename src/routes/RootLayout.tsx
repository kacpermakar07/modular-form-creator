import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'

export function RootLayout() {
  return (
    <Shell>
      <Header>
        <BrandLink to="/resources">Resources Manager</BrandLink>
      </Header>

      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const BrandLink = styled(Link)`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.inkStrong};
  text-decoration: none;
`

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`
