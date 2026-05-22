import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import ApplicationForm from './pages/ApplicationForm'
import ApplicationStatus from './pages/ApplicationStatus'
import AdminDashboard from './pages/AdminDashboard'
import DigitalRationCard from './pages/DigitalRationCard'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import ShopRegister from './pages/shop/ShopRegister'
import ShopPending from './pages/shop/ShopPending'
import ShopDashboard from './pages/shop/ShopDashboard'
import UserQuota from './pages/user/UserQuota'
import UserComplaints from './pages/user/UserComplaints'
import AdminManage from './pages/admin/AdminManage'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-shop" element={<ShopRegister />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute requiredRole="user">
              <ApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route path="/status" element={<ApplicationStatus />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/manage"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminManage />
            </ProtectedRoute>
          }
        />
        <Route path="/shop/pending" element={<ShopPending />} />
        <Route
          path="/shop"
          element={
            <ProtectedRoute requiredRole="shop_owner">
              <ShopDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quota"
          element={
            <ProtectedRoute requiredRole="user">
              <UserQuota />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute requiredRole="user">
              <UserComplaints />
            </ProtectedRoute>
          }
        />
        <Route path="/digital-ration-card" element={<DigitalRationCard />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
