import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { themeSettings } from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/app/Dashboard';
import Pantry from './pages/app/Pantry';
import Recipes from './pages/app/Recipes';
import RecipeForm from './pages/app/RecipeForm';
import RecipeDetail from './pages/app/RecipeDetail';
import Grocery from './pages/app/Grocery';
import Settings from './pages/app/Settings';

import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();

const theme = createTheme(themeSettings);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                <Route path="/app" element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="pantry" element={<Pantry />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="recipes/new" element={<RecipeForm />} />
                    <Route path="recipes/:id" element={<RecipeDetail />} />
                    <Route path="recipes/:id/edit" element={<RecipeForm />} />
                    <Route path="grocery" element={<Grocery />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
