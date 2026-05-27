/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { PATHS } from './paths';
import MainLayout from '../components/layout/MainLayout';

// High-performance dynamic code-splitting for feature modules
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const BookingPage = lazy(() => import('../features/booking/pages/BookingPage'));
const MembersPage = lazy(() => import('../features/members/pages/MembersPage'));
const ShopPage = lazy(() => import('../features/shop/pages/ShopPage'));

/**
 * Global Routing Registry
 * Using React Router modern browser router config, establishing nested layouts
 * and native lazy chunk split configurations.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: PATHS.DASHBOARD,
        element: <DashboardPage />
      },
      {
        path: PATHS.BOOKING,
        element: <BookingPage />
      },
      {
        path: PATHS.MEMBERS,
        element: <MembersPage />
      },
      {
        path: PATHS.SHOP,
        element: <ShopPage />
      },
      {
        path: PATHS.NOT_FOUND,
        element: <Navigate to={PATHS.HOME} replace />
      }
    ]
  }
]);
