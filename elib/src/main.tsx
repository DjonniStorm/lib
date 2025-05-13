import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import { MainPage } from './components/pages/MainPage.tsx';
import { CertificatesPage } from './components/pages/CertificatesPage.tsx';
import { RegisterPage } from './components/pages/RegisterPage.tsx';
import { LoginPage } from './components/pages/LoginPage.tsx';
import { UserPage } from './components/pages/UserPage.tsx';
import { BookPage } from './components/pages/BookPage.tsx';

const AdminPage = lazy(() => import('./components/pages/AdminPage.tsx'));

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/certificates',
        element: <CertificatesPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/user',
        element: <UserPage />,
      },
      {
        path: '/book',
        element: <BookPage />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
    ],
    errorElement: (
      <div>
        Error...
        <img src="https://c.tenor.com/m4Gn7YI8y4YAAAAC/tenor.gif" />
      </div>
    ),
  },
] as const);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
