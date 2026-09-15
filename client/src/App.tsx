import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingState } from './components/ui/LoadingState';
import { RootLayout } from './layouts/RootLayout';

// Pages are code-split so the first paint only ships what the route needs.
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const PropertiesPage = lazy(() => import('./pages/properties/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('./pages/properties/PropertyDetailsPage'));
const RoommatesPage = lazy(() => import('./pages/roommates/RoommatesPage'));
const StudentDashboardPage = lazy(() => import('./pages/dashboard/StudentDashboardPage'));
const SavedPropertiesPage = lazy(() => import('./pages/dashboard/SavedPropertiesPage'));
const RequestsPage = lazy(() => import('./pages/dashboard/RequestsPage'));
const MessagesPage = lazy(() => import('./pages/dashboard/MessagesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OwnerDashboardPage = lazy(() => import('./pages/owner/OwnerDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <LoadingState message="Loading page…" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailsPage />} />
          <Route path="roommates" element={<RoommatesPage />} />

          {/* Signed in */}
          <Route
            path="messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Student */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="saved"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <SavedPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="requests"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <RequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Owner / admin */}
          <Route
            path="owner"
            element={
              <ProtectedRoute roles={['OWNER']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
