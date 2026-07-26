import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { RouteErrorBoundary } from './RouteErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/resources" replace />,
      },
      {
        path: 'resources',
        lazy: () =>
          import('./ResourcesListPage').then((m) => ({ Component: m.ResourcesListPage })),
      },
      {
        path: 'resources/:resourceId',
        lazy: () =>
          import('./ResourceLayout').then((m) => ({ Component: m.ResourceLayout })),
        children: [
          {
            index: true,
            lazy: () =>
              import('./ResourceOverviewPage').then((m) => ({
                Component: m.ResourceOverviewPage,
              })),
          },
          {
            path: 'details',
            lazy: () =>
              import('./ResourceDetailsPage').then((m) => ({
                Component: m.ResourceDetailsPage,
              })),
          },
          {
            path: 'basic-info',
            lazy: () =>
              import('./BasicInfoPage').then((m) => ({ Component: m.BasicInfoPage })),
          },
          {
            path: 'project-details',
            lazy: () =>
              import('./ProjectDetailsPage').then((m) => ({
                Component: m.ProjectDetailsPage,
              })),
          },
        ],
      },
      {
        path: '*',
        lazy: () => import('./NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
      },
    ],
  },
])
