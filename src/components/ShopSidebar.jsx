import { Package, ScanLine, History, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react'

const ShopSidebar = ({ tab, setTab, user, onLogout }) => {
  const links = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'distribute', label: 'Verify & Distribute', icon: ScanLine },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
  ]

  return (
    <aside className="no-print w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Shop Portal</p>
        <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              tab === id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
      <button type="button" onClick={onLogout} className="m-4 flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  )
}

export default ShopSidebar
