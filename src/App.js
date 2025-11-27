import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import AnalysisDetails from "./pages/AnalysisDetails";
import Login from "./pages/Login";
import Main from "./pages/MainScreen";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas (somente se não estiver logado) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas privadas (somente se estiver logado) */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />

        <Route
          path="/analysis/results/:id"
          element={
            <PrivateRoute>
              <AnalysisDetails />
            </PrivateRoute>
          }
        />

        {/* Página inicial redireciona corretamente */}
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </BrowserRouter>
  );
}
