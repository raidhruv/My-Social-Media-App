import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerificationPending from "./pages/VerificationPending";
import VerifyEmail from "./pages/VerifyEmail";
import Post from "./pages/Post";
import PublicRoute from "./components/PublicRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register"element={<PublicRoute><Register /></PublicRoute>}/>
        <Route path="/login"element={<PublicRoute><Login /></PublicRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/profile/:username" element={<Profile/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/verification-pending" element={<VerificationPending />}/>
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/post/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;