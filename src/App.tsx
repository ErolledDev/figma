import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';

export const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/dashboard/*" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};