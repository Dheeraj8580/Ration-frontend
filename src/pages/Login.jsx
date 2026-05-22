import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, AlertCircle, ShieldCheck, User, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DEFAULT_ADMIN_EMAIL = 'dheerajk.jk@gmail.com'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { authenticateUser } = useAuth()

  const [activeRole, setActiveRole] = useState('user') // 'user' | 'admin' | 'shop_owner'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setLoginError('')
  }

  const switchRole = (role) => {
    setActiveRole(role)
    setLoginError('')
    setErrors({})
    if (role === 'admin') {
      setFormData({
        email: DEFAULT_ADMIN_EMAIL,
        password: 'Ration',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setLoginError('')

    const result = await authenticateUser(formData.email, formData.password, activeRole)
    setIsLoading(false)

    if (!result.success) {
      setLoginError(result.error)
      return
    }

    const loggedInUser = result.user
    let defaultPath = '/dashboard'
    if (activeRole === 'admin') defaultPath = '/admin'
    else if (activeRole === 'shop_owner') {
      defaultPath =
        loggedInUser?.shopOwnerStatus === 'Approved' ? '/shop' : '/shop/pending'
    }
    const from = location.state?.from?.pathname
    const target =
      from &&
      ((activeRole === 'shop_owner' && from.startsWith('/shop')) ||
        (activeRole === 'admin' && from.startsWith('/admin')) ||
        (activeRole === 'user' && !from.startsWith('/admin') && !from.startsWith('/shop')))
        ? from
        : defaultPath
    navigate(target, { replace: true })
  }

  const isAdminMode = activeRole === 'admin'
  const isShopMode = activeRole === 'shop_owner'

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: isAdminMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c1830 100%)'
        : isShopMode
          ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)'
          : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)'
    }}>

      {/* Back Button */}
      <div className="relative z-10 p-6">
        <Link
          to="/"
          className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
            isAdminMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">

          {/* Role Toggle */}
          <div className={`relative flex rounded-2xl p-1.5 mb-6 shadow-lg ${
            isAdminMode ? 'bg-slate-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
          }`}>
            <button type="button" onClick={() => switchRole('user')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 ${activeRole === 'user' ? 'bg-primary-600 text-white' : 'text-slate-500'}`}>
              <User className="w-3.5 h-3.5" /> User
            </button>
            <button type="button" onClick={() => switchRole('shop_owner')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 ${isShopMode ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
              <Store className="w-3.5 h-3.5" /> Shop
            </button>
            <button type="button" onClick={() => switchRole('admin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 ${isAdminMode ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>

          {/* Card */}
          <div className={`rounded-3xl p-8 shadow-2xl border transition-all duration-500 ${
            isAdminMode
              ? 'bg-slate-800/90 backdrop-blur-xl border-slate-700/50'
              : isShopMode
                ? 'bg-white/95 backdrop-blur-xl border-emerald-200/60'
                : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
          }`}>

            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${
                isAdminMode
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
                  : isShopMode
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
              }`}>
                {isAdminMode ? (
                  <ShieldCheck className="w-10 h-10 text-white" />
                ) : isShopMode ? (
                  <Store className="w-10 h-10 text-white" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>

              <h1 className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                isAdminMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isAdminMode ? 'Admin Login' : isShopMode ? 'Shop Owner Login' : 'Welcome Back'}
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isAdminMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isAdminMode
                  ? 'Authorized personnel only'
                  : isShopMode
                    ? 'Sign in to manage stock and distribute ration'
                    : 'Sign in to access your ration card portal'}
              </p>

              {isAdminMode && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-amber-400 text-xs font-medium">Secure Admin Access</span>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {loginError && (
              <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${
                isAdminMode
                  ? 'bg-red-900/30 border-red-700/50 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{loginError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isAdminMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isAdminMode ? 'text-slate-400' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all duration-200 ${
                      isAdminMode
                        ? 'bg-slate-700/60 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                    } ${errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isAdminMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all duration-200 ${
                      isAdminMode
                        ? 'bg-slate-700/60 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                    } ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${
                  isAdminMode
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:-translate-y-0.5'
                    : isShopMode
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)] hover:-translate-y-0.5'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    {isAdminMode ? <ShieldCheck className="w-4 h-4" /> : isShopMode ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {isAdminMode ? 'Access Admin Dashboard' : isShopMode ? 'Open Shop Portal' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            {!isAdminMode && (
              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Create one now
                </Link>
              </p>
            )}

            {isAdminMode && (
              <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
                <p>Default admin: <strong className="text-slate-300">dheerajk.jk@gmail.com</strong> / <strong className="text-slate-300">Ration</strong></p>
                <p>Alternate: admin@gov.in / Admin@123</p>
              </div>
            )}
          </div>

          {isShopMode && (
            <p className="text-center mt-4 text-sm text-slate-600">
              New ration shop?{' '}
              <Link to="/register-shop" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Register your shop
              </Link>
            </p>
          )}

          <p className={`text-center mt-5 text-sm ${isAdminMode ? 'text-slate-500' : 'text-slate-500'}`}>
            Need help?{' '}
            <Link to="/contact" className={`font-medium transition-colors ${
              isAdminMode ? 'text-amber-400 hover:text-amber-300' : 'text-primary-600 hover:text-primary-700'
            }`}>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login