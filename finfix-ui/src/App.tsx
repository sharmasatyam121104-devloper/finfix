import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import OpenRoute from "./components/OpenRoute"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<OpenRoute/>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App