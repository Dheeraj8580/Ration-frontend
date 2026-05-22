import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Clock,
  User,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ userType = 'user' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Apply for Card', path: '/apply', icon: FileText },
    { name: 'Monthly Quota', path: '/quota', icon: FileText },
    { name: 'Track Status', path: '/status', icon: Clock },
    { name: 'My Ration Card', path: '/digital-ration-card', icon: CreditCard },
    { name: 'Complaints', path: '/complaints', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'System Manage', path: '/admin/manage', icon: Settings },
    { name: 'All Applications', path: '/admin', icon: FileText, query: 'all' },
    { name: 'Pending', path: '/admin', icon: Clock, query: 'pending' },
    { name: 'Approved', path: '/admin', icon: CheckCircle, query: 'approved' },
    { name: 'Rejected', path: '/admin', icon: XCircle, query: 'rejected' },
    { name: 'Users', path: '/admin', icon: Users, query: 'users' },
  ]

  const links = userType === 'admin' ? adminLinks : userLinks
  
  const isActive = (path, query) => {
    if (query) {
      const params = new URLSearchParams(location.search)
      return location.pathname === path && params.get('tab') === query
    }
    return location.pathname === path && !location.search
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Hamburger Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="no-print fixed top-4 left-4 z-40 lg:hidden p-3 rounded-2xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none hover:bg-slate-50 group active:scale-95 animate-fade-in"
      >
        <Menu className="w-5 h-5 text-slate-700 group-hover:text-primary-600 transition-colors" />
      </button>

      {/* Backdrop overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="no-print fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`no-print w-72 flex-shrink-0 bg-white border-r border-slate-200 h-screen fixed inset-y-0 left-0 lg:sticky lg:top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button inside Sidebar on Mobile */}
        <button
          onClick={() => setIsOpen(false)}
          type="button"
          className="absolute top-5 right-5 lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Section */}
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 ${
              userType === 'admin' 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-200' 
                : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-200'
            }`}>
              {userType === 'admin' ? <ShieldCheck className="w-7 h-7 text-white" /> : <FileText className="w-7 h-7 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                {userType === 'admin' ? 'ADMIN' : 'RATION'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {userType === 'admin' ? 'Management' : 'Digital Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.query ? `${link.path}?tab=${link.query}` : link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                  isActive(link.path, link.query)
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                }`}
              >
                <link.icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive(link.path, link.query) ? 'text-primary-400' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Separator */}
          <div className="my-8 px-4">
            <div className="h-px bg-slate-100 w-full"></div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-300 group mt-4 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-3xl p-5 flex items-center space-x-4 border border-slate-100">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-200">
                <User className={`w-6 h-6 ${userType === 'admin' ? 'text-amber-600' : 'text-primary-600'}`} />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.name || (userType === 'admin' ? 'Admin' : 'User')}
              </p>
              <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-tighter">
                {user?.email || 'authenticated'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
