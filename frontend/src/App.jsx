import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerificationPending from "./pages/VerificationPending";
import VerifyEmail from "./pages/VerifyEmail";
import Post from "./pages/Post";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/profile/:username" element={<Profile/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
        <Route path="/verification-pending" element={<VerificationPending />}/>
        <Route path="/verify-email/:token" element={<VerifyEmail />}/>
        <Route path="/post/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;