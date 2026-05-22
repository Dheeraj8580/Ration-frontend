import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, FileText, Home, Info, Phone, ChevronDown, Download, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TrackApplicationModal from './TrackApplicationModal'

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()

  const servicesRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userType = user?.role || 'user'

  const baseNavLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ]

  const authNavLinks = isLoggedIn
    ? userType === 'admin'
      ? [
          { name: 'Dashboard', path: '/admin', icon: FileText },
        ]
      : [
          { name: 'Dashboard', path: '/dashboard', icon: FileText },
          { name: 'Apply', path: '/apply', icon: FileText },
        ]
    : []

  const navLinks = isLoggedIn ? [...baseNavLinks, ...authNavLinks] : baseNavLinks;

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                  DIGITAL RATION
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">CARD SYSTEM</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-4 lg:gap-6 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-md border border-primary-200'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 hover:shadow-sm hover:border hover:border-slate-200'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isServicesOpen || isActive('/digital-ration-card') || isActive('/status')
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-md border border-primary-200'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 hover:shadow-sm hover:border hover:border-slate-200'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div 
                  className="absolute left-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 py-3 z-50 transition-all duration-300 origin-top-left border border-slate-100"
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link
                    to="/digital-ration-card"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 rounded-lg mx-2"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    Download E-Ration Card
                  </Link>
                  <button
                    type="button"
                    className="w-[calc(100%-1rem)] flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 rounded-lg mx-2 text-left"
                    onClick={() => {
                      setIsServicesOpen(false)
                      setIsTrackModalOpen(true)
                    }}
                  >
                    <Search className="w-4 h-4 mr-3" />
                    Track Application Status
                  </button>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="flex items-center pl-4 lg:pl-6 border-l border-slate-200 relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">
                    {user?.name || (userType === 'admin' ? 'Admin' : 'User')}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-2">
                      <p className="text-sm font-medium text-slate-900">{user?.name || (userType === 'admin' ? 'Administrator' : 'User')}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Mobile Services Section */}
            <div className="border-t border-slate-100 my-2 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Services</p>
              <Link
                to="/digital-ration-card"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download E-Ration Card</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsTrackModalOpen(true)
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors text-left"
              >
                <Search className="w-5 h-5" />
                <span>Track Application Status</span>
              </button>
            </div>

            {isLoggedIn ? (
              <div className="border-t border-slate-200 mt-4 pt-4 pb-2">
                <div className="flex items-center px-4 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left text-danger-600 hover:bg-danger-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 space-y-2 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <TrackApplicationModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </nav>
  )
}

export default Navbar
