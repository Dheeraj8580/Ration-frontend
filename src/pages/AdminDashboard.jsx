import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Bell,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  ShieldCheck
} from 'lucide-react'

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') || 'all'

  const {
    user: adminUser,
    fetchAllUsers,
    deleteUser,
    updateCardType,
    fetchApplications,
    fetchAdminStats,
    approveApplication,
    rejectApplication,
    fetchShopOwners,
    approveShopOwner,
    rejectShopOwner,
  } = useAuth()

  const [activeTab, setActiveTab] = useState(tabParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [applications, setApplications] = useState([])
  const [isAppsLoading, setIsAppsLoading] = useState(true)
  const [adminStats, setAdminStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [showNotifications, setShowNotifications] = useState(false)
  
  const [shopOwners, setShopOwners] = useState([])
  const [isShopsLoading, setIsShopsLoading] = useState(false)
  useEffect(() => {
    setActiveTab(tabParam)
    setCurrentPage(1)
  }, [tabParam])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setCurrentPage(1)
    setSearchParams({ tab: tabId })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const loadApplications = useCallback(async () => {
    setIsAppsLoading(true)
    const statusParam = ['all', 'users'].includes(activeTab) ? undefined : activeTab
    const result = await fetchApplications({ status: statusParam, search: searchQuery })
    if (result.success) {
      setApplications(result.applications || [])
    }
    setIsAppsLoading(false)
  }, [activeTab, searchQuery, fetchApplications])

  const loadStats = useCallback(async () => {
    const result = await fetchAdminStats()
    if (result.success) setAdminStats(result.stats)
  }, [fetchAdminStats])

  useEffect(() => {
    if (!['users'].includes(activeTab)) {
      loadApplications()
      loadStats()
    }
  }, [activeTab, loadApplications, loadStats])

  const stats = [
    { title: 'Total Applications', value: String(adminStats.total), change: 'Live', changeType: 'positive', icon: FileText, color: 'bg-primary-100 text-primary-600' },
    { title: 'Approved', value: String(adminStats.approved), change: 'Live', changeType: 'positive', icon: CheckCircle, color: 'bg-success-100 text-success-600' },
    { title: 'Pending Review', value: String(adminStats.pending), change: 'Live', changeType: 'negative', icon: Clock, color: 'bg-warning-100 text-warning-600' },
    { title: 'Rejected', value: String(adminStats.rejected), change: 'Live', changeType: 'negative', icon: XCircle, color: 'bg-danger-100 text-danger-600' },
  ]

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all' || activeTab === 'users') return true
    return app.status === activeTab
  })

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleViewApplication = (app) => {
    setSelectedApplication(app)
    setRejectReason('')
    setShowModal(true)
  }

  const handleApprove = async (applicationId) => {
    const result = await approveApplication(applicationId, selectedApplication?.rationCardType)
    if (result.success) {
      setShowModal(false)
      setSelectedApplication(null)
      loadApplications()
      loadStats()
    } else {
      alert(result.error || 'Approve failed')
    }
  }

  const handleReject = async (applicationId) => {
    const reason = rejectReason.trim() || window.prompt('Enter rejection reason:')
    if (!reason) return
    const result = await rejectApplication(applicationId, reason)
    if (result.success) {
      setShowModal(false)
      setSelectedApplication(null)
      setRejectReason('')
      loadApplications()
      loadStats()
    } else {
      alert(result.error || 'Reject failed')
    }
  }

  const [users, setUsers] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)

  // Fetch users when on users tab
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab])

  const loadUsers = async () => {
    setIsUsersLoading(true)
    const result = await fetchAllUsers()
    if (result.success) {
      setUsers(result.users)
    }
    setIsUsersLoading(false)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(userId)
      if (result.success) {
        loadUsers()
      } else {
        alert(result.error || 'Failed to delete user')
      }
    }
  }

  const handleUpdateCard = async (userId, newType) => {
    const result = await updateCardType(userId, newType)
    if (result.success) {
      loadUsers()
    } else {
      alert(result.error || 'Failed to update card type')
    }
  }

  useEffect(() => {
    if (activeTab === 'shops') {
      loadShopOwners()
    }
  }, [activeTab])

  const loadShopOwners = async () => {
    setIsShopsLoading(true)
    const result = await fetchShopOwners()
    if (result.success) {
      setShopOwners(result.shopOwners || [])
    }
    setIsShopsLoading(false)
  }

  const handleApproveShop = async (id) => {
    if (window.confirm('Approve this shop owner?')) {
      const result = await approveShopOwner(id)
      if (result.success) loadShopOwners()
      else alert(result.error || 'Failed to approve shop owner')
    }
  }

  const handleRejectShop = async (id) => {
    const reason = window.prompt('Enter rejection reason:')
    if (!reason) return
    const result = await rejectShopOwner(id, reason)
    if (result.success) loadShopOwners()
    else alert(result.error || 'Failed to reject shop owner')
  }

  const tabs = [
    { id: 'all', label: 'All', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
    { id: 'users', label: 'Users', count: users.length },
    { id: 'shops', label: 'Shop Verification', count: shopOwners.length },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between pl-16 pr-6 sm:px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Manage applications and monitor system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 z-50 py-2 sm:-right-0 -right-4">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">2 New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-success-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">System is Online</p>
                            <p className="text-xs text-slate-500 mt-0.5">All services are running normally without any interruptions.</p>
                            <p className="text-xs text-slate-400 mt-1">Just now</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">New Applications</p>
                            <p className="text-xs text-slate-500 mt-0.5">You have new pending citizen applications to review.</p>
                            <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 border-t border-slate-100 text-center bg-slate-50 rounded-b-xl">
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-bold"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">{adminUser?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">{adminUser?.email || 'Department Officer'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Dashboard Overview - Only show on application tabs */}
            {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'processing' || activeTab === 'approved' || activeTab === 'rejected') && (
              <>
                {/* Admin Overview Banner */}
                {activeTab === 'all' && (
                  <section className="relative overflow-hidden bg-slate-900 rounded-[2rem] text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent"></div>
                    <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="max-w-xl">
                        <div className="inline-flex items-center px-3 py-1 bg-success-500/20 text-success-400 rounded-full text-xs font-bold mb-4 border border-success-500/30">
                          <span className="w-2 h-2 bg-success-500 rounded-full mr-2 animate-pulse"></span>
                          SYSTEM ONLINE
                        </div>
                        <h2 className="text-3xl font-bold mb-3">Administrative Overview</h2>
                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                          Monitor application processing, verify citizen documents, and ensure
                          smooth ration distribution across all regions. The system is currently
                          operating at peak efficiency.
                        </p>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-2xl font-bold">99.9%</p>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Uptime</p>
                          </div>
                          <div className="w-px h-10 bg-slate-800"></div>
                          <div>
                            <p className="text-2xl font-bold">2.4k</p>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Processed</p>
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:block w-80">
                        <img
                          src="/images/admin_stats.png"
                          alt="Admin Illustration"
                          className="w-full h-auto rounded-3xl drop-shadow-[0_0_30px_rgba(37,99,235,0.3)] transform hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} padding="normal" className="hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                          <div className={`flex items-center mt-2 text-sm ${stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                            }`}>
                            {stat.changeType === 'positive' ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {stat.change} from last month
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Charts Row - Only show on 'all' tab */}
                {activeTab === 'all' && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card title="Application Trends" subtitle="Monthly statistics" icon={BarChart3}>
                      <div className="h-64 flex items-end justify-around space-x-2 px-4">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                          <div key={month} className="flex flex-col items-center flex-1 h-full">
                            <div
                              className="w-8 bg-primary-500 rounded-t-lg hover:bg-primary-600 transition-all duration-500 shadow-[0_-4px_12px_rgba(59,130,246,0.2)]"
                              style={{ height: `${[45, 62, 55, 78, 85, 92][index]}%` }}
                            />
                            <span className="text-xs font-bold text-slate-400 mt-3">{month}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card title="Status Distribution" subtitle="Application by status" icon={PieChart}>
                      <div className="h-64 flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="20"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="20"
                              strokeDasharray="251.2"
                              strokeDashoffset="50"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="20"
                              strokeDasharray="251.2"
                              strokeDashoffset="180"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="20"
                              strokeDasharray="251.2"
                              strokeDashoffset="220"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-900">2,456</span>
                            <span className="text-sm text-slate-500">Total</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-success-500 mr-2" />
                          <span className="text-sm text-slate-600">Approved</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-warning-500 mr-2" />
                          <span className="text-sm text-slate-600">Pending</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-danger-500 mr-2" />
                          <span className="text-sm text-slate-600">Rejected</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Applications Table */}
                <Card>
                  {/* Table Header */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
                        <p className="text-sm text-slate-500">Review and manage citizen applications</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </button>
                      </div>
                    </div>

                    {/* Tabs & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
                        {tabs.filter(t => !['users', 'settings', 'shops'].includes(t.id)).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            {tab.label}
                            {tab.count !== undefined && (
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'bg-slate-200 text-slate-600'
                                }`}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Application ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {isAppsLoading ? (
                          <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading applications...</td></tr>
                        ) : paginatedApplications.length === 0 ? (
                          <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No applications found</td></tr>
                        ) : paginatedApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-slate-900">{app.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-primary-600">
                                    {app.applicant.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{app.applicant}</p>
                                  <p className="text-xs text-slate-500">{app.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-slate-600">{app.type}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-slate-600">{app.submittedDate}</span>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={app.status} size="sm" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {app.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(app.id)}
                                      className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                                      title="Approve"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleReject(app.id)}
                                      className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                      title="Reject"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleViewApplication(app)}
                                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Showing <span className="font-medium">{filteredApplications.length === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredApplications.length)}</span> of <span className="font-medium">{filteredApplications.length}</span> results
                    </p>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === i + 1 
                              ? 'bg-primary-600 text-white shadow-sm' 
                              : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Users Tab Content */}
            {activeTab === 'users' && (
              <Card>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">User Management</h3>
                    <p className="text-sm text-slate-500">Manage registered citizens and staff</p>
                  </div>
                  <Button icon={Users} onClick={loadUsers}>Refresh List</Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Email/Mobile</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Aadhaar</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Income</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Card No.</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {isUsersLoading ? (
                        <tr><td colSpan="7" className="p-12 text-center text-slate-500">Loading users...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="7" className="p-12 text-center text-slate-500">No users found</td></tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                              {user.email}<br/>{user.mobile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.aadhaarNumber || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">₹{user.annualIncome?.toLocaleString() || '0'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-600 font-bold">{user.rationCardNumber || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                user.rationCardType === 'Antyodaya' ? 'bg-rose-100 text-rose-700' :
                                user.rationCardType === 'BPL' ? 'bg-amber-100 text-amber-700' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {user.rationCardType}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-danger-600 hover:text-danger-700 p-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Shop Verification Tab Content */}
            {activeTab === 'shops' && (
              <Card>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Shop Verification</h3>
                    <p className="text-sm text-slate-500">Approve or reject shop owner applications</p>
                  </div>
                  <Button icon={ShieldCheck} onClick={loadShopOwners}>Refresh List</Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Owner Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Shop Info</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {isShopsLoading ? (
                        <tr><td colSpan="5" className="p-12 text-center text-slate-500">Loading shop owners...</td></tr>
                      ) : shopOwners.length === 0 ? (
                        <tr><td colSpan="5" className="p-12 text-center text-slate-500">No shop owners found</td></tr>
                      ) : (
                        shopOwners.map((owner) => (
                          <tr key={owner._id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{owner.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                              {owner.email}<br/>{owner.mobile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {owner.shopId ? (owner.shopId.shopCode || owner.shopId.name || 'Shop Assigned') : 'No Shop'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                owner.shopOwnerStatus === 'Approved' ? 'bg-success-100 text-success-700' :
                                owner.shopOwnerStatus === 'Rejected' ? 'bg-danger-100 text-danger-700' :
                                'bg-warning-100 text-warning-700'
                              }`}>
                                {owner.shopOwnerStatus || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                              {owner.shopOwnerStatus !== 'Approved' && (
                                <button 
                                  onClick={() => handleApproveShop(owner._id)}
                                  className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {owner.shopOwnerStatus !== 'Rejected' && (
                                <button 
                                  onClick={() => handleRejectShop(owner._id)}
                                  className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

          </div>
        </main>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Application ID</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedApplication.id}</p>
                </div>
                <StatusBadge status={selectedApplication.status} />
              </div>

              {/* Applicant Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Applicant Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium text-slate-900">{selectedApplication.applicant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Aadhaar</p>
                      <p className="font-medium text-slate-900">{selectedApplication.aadhaar}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Application Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Application Type</p>
                      <p className="font-medium text-slate-900">{selectedApplication.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Submitted Date</p>
                      <p className="font-medium text-slate-900">{selectedApplication.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-slate-900">{selectedApplication.address}</p>
                    </div>
                    {selectedApplication.fatherName && (
                      <div>
                        <p className="text-sm text-slate-500">Father&apos;s Name</p>
                        <p className="font-medium text-slate-900">{selectedApplication.fatherName}</p>
                      </div>
                    )}
                    {selectedApplication.motherName && (
                      <div>
                        <p className="text-sm text-slate-500">Mother&apos;s Name</p>
                        <p className="font-medium text-slate-900">{selectedApplication.motherName}</p>
                      </div>
                    )}
                    {selectedApplication.maritalStatus && (
                      <div>
                        <p className="text-sm text-slate-500">Marital Status</p>
                        <p className="font-medium text-slate-900 capitalize">{selectedApplication.maritalStatus}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedApplication.familyMembers?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Family Members</h3>
                  <div className="space-y-2">
                    {selectedApplication.familyMembers.map((m, i) => (
                      <div key={i} className="flex flex-wrap gap-4 text-sm bg-slate-50 p-3 rounded-lg">
                        <span className="font-medium text-slate-900">{m.name}</span>
                        <span className="text-slate-500 capitalize">{m.relation}</span>
                        {m.age && <span className="text-slate-500">Age: {m.age}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Submitted Documents</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedApplication.documents && Object.keys(selectedApplication.documents).length > 0 ? (
                    Object.entries(selectedApplication.documents).map(([key, value]) => {
                      if (!value) return null
                      const labelMap = {
                        idProof: 'Identity Proof (Aadhaar/PAN)',
                        addressProof: 'Address Proof (Utility Bill)',
                        incomeProof: 'Income Certificate'
                      }
                      const fileUrl = value.startsWith('http') 
                        ? value 
                        : `${import.meta.env.VITE_API_URL}/${value.replace(/\\/g, '/').replace(/^\/+/, '')}`

                      return (
                        <div key={key} className="flex items-center px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
                          <FileText className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-sm text-slate-700 font-medium mr-4">{labelMap[key] || key}</span>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-semibold hover:underline"
                          >
                            View File
                          </a>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-500 italic">No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedApplication.rejectionReason && (
                <div className="p-4 bg-danger-50 rounded-xl">
                  <p className="font-medium text-danger-700 mb-1">Rejection Reason</p>
                  <p className="text-sm text-danger-600">{selectedApplication.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Rejection reason (if rejecting)</label>
                    <textarea
                      className="mt-1 w-full border border-slate-300 rounded-lg p-3 text-sm"
                      rows={2}
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="success"
                      className="w-full sm:flex-1"
                      onClick={() => handleApprove(selectedApplication.id)}
                      icon={Check}
                    >
                      Approve Application
                    </Button>
                    <Button
                      variant="danger"
                      className="w-full sm:flex-1"
                      onClick={() => handleReject(selectedApplication.id)}
                      icon={X}
                    >
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
