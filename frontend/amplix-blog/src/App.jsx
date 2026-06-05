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
import "./App.css";

function App() {
  return (
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

