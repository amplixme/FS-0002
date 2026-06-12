import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Categorias from "./pages/Categorias";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import "./App.css";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sileo";


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
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


            {/* ── Edición de perfil (ruta protegida) — va ANTES de /perfil/:id
                para que React Router no resuelva "editar" como un :id ── */}
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


            {/* ── Perfil público ── */}
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-center" theme="dark" />
    </ErrorBoundary>
  );
}

export default App;
