import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';

export const App = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          session ? <Navigate to="/dashboard" replace /> : <AuthPage />
        } 
      />
      <Route 
        path="/dashboard/*" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          session ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
        } 
      />
    </Routes>
  );
};