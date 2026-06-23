import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sileo";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const Categorias = lazy(() => import("./pages/Categorias"));
const EditPost = lazy(() => import("./pages/EditPost"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Admin = lazy(() => import("./pages/Admin"));
const Nosotros = lazy(() => import("./pages/Nosotros"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatePost />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categorias"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Categorias />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EditPost />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <Layout>
                    <PostDetail />
                  </Layout>
                }
              />
              <Route
                path="/perfil/editar"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EditProfile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil/:id"
                element={
                  <Layout>
                    <UserProfile />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/nosotros"
                element={
                  <Layout>
                    <Nosotros />
                  </Layout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-center" theme={theme} />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
