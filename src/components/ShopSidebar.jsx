import { useState } from 'react'
import { Package, ScanLine, History, MessageSquare, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

const ShopSidebar = ({ tab, setTab, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'distribute', label: 'Verify & Distribute', icon: ScanLine },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
  ]

  return (
    <>
      {/* Floating Hamburger Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="no-print fixed top-4 left-4 z-40 lg:hidden p-3 rounded-2xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none hover:bg-slate-50 group active:scale-95 animate-fade-in"
      >
        <Menu className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors" />
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
        className={`no-print w-64 bg-white border-r border-slate-200 h-screen fixed inset-y-0 left-0 lg:sticky lg:top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
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

        <div className="p-6 border-b">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Shop Portal</p>
          <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                tab === id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <button 
          type="button" 
          onClick={() => {
            setIsOpen(false)
            onLogout()
          }} 
          className="m-4 flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm p-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
    </>
  )
}

export default ShopSidebar
