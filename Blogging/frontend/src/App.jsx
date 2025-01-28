import React  from 'react'
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicLayout from "./layouts/PublicLayout";
import Page404 from "./pages/Page404";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 


function App() {

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Signup />}/>
        <Route path="login" element={<Login />}/>

      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout/> }>
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
