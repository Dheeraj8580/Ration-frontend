import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useCurrentUser } from '../hooks/useCurrentUser'
import {
  Bell,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  User,
  Calendar,
  ChevronRight,
  QrCode,
  MapPin,
  X,
  IndianRupee,
  Users,
} from 'lucide-react'

const cardTypeConfig = {
  APL: { label: 'APL', subtitle: 'Above Poverty Line', color: 'bg-green-100 text-green-600' },
  BPL: { label: 'BPL', subtitle: 'Below Poverty Line', color: 'bg-amber-100 text-amber-600' },
  Antyodaya: { label: 'Antyodaya (AAY)', subtitle: 'Priority Household', color: 'bg-pink-100 text-pink-600' },
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { userId, isLoading: authLoading } = useAuth()
  const { user, loading: userLoading } = useCurrentUser(userId)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const loading = authLoading || userLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <p className="text-slate-600">Unable to load your profile. Please <Link to="/login" className="text-primary-600 font-semibold">login again</Link>.</p>
      </div>
    )
  }

  const typeInfo = cardTypeConfig[user.rationCardType] || cardTypeConfig.APL
  const appStatus = (user.applicationStatus || '').toLowerCase()
  const hasCard = appStatus === 'approved' && !!user.rationCardNumber
  const isPending = appStatus === 'pending'
  const isRejected = appStatus === 'rejected'
  const needsApplication = appStatus === 'notsubmitted' || isRejected

  const stats = [
    {
      title: 'Card Type',
      value: typeInfo.label,
      subtitle: typeInfo.subtitle,
      icon: FileText,
      color: typeInfo.color,
    },
    {
      title: 'My Location',
      value: user.district || '—',
      subtitle: user.state ? `${user.state}, India` : 'India',
      icon: MapPin,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Annual Income',
      value: user.annualIncome != null ? `₹${Number(user.annualIncome).toLocaleString('en-IN')}` : '—',
      subtitle: user.occupation || 'Occupation',
      icon: IndianRupee,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Family Members',
      value: user.familyMembersCount ?? '—',
      subtitle: 'Registered on card',
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
    },
  ]

  const notifications = [
    {
      id: 1,
      title: 'Welcome to Digital Ration Portal',
      message: `Hello ${user.name}, your ${user.rationCardType} ration card is registered.`,
      time: 'Just now',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Card Number',
      message: hasCard ? `Your ration card number: ${user.rationCardNumber}` : 'Complete registration to get your card number.',
      time: formatDate(user.createdAt),
      type: 'info',
      read: true,
    },
  ]

  const userApplicationData = {
    id: user.rationCardNumber || `APP-${user.id?.slice(-6) || 'NEW'}`,
    type: `Digital Ration Card - ${user.rationCardType}`,
    date: formatDate(user.createdAt),
    status: isRejected ? 'rejected' : hasCard ? 'approved' : 'pending',
    rejectionReason: user.rejectionReason,
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between pl-16 pr-6 sm:px-8 py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  onBlur={() => setTimeout(() => setIsNotificationOpen(false), 200)}
                  className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white" />
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                          <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/profile"
                className="flex items-center space-x-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">Citizen</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <section className="relative overflow-hidden bg-gradient-to-r from-primary-700 to-primary-600 rounded-[2rem] text-white shadow-xl shadow-primary-100">
              <div className="relative px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold mb-3">Welcome back, {user.name}!</h2>
                  <p className="text-primary-100 text-lg mb-6 leading-relaxed">
                    {isRejected
                      ? `Your application was rejected. Reason: ${user.rejectionReason || 'Contact support.'}`
                      : hasCard
                      ? `Your ${user.rationCardType} digital ration card (${user.rationCardNumber}) is active.`
                      : isPending
                      ? 'Your application is pending admin approval. You will be notified once reviewed.'
                      : needsApplication
                        ? 'Complete the Apply for Card form with documents and family details. Your card is created only after admin approval.'
                        : 'Your application is under admin review.'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/digital-ration-card"
                      className="px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all flex items-center gap-2"
                    >
                      <QrCode className="w-5 h-5" />
                      View Digital Card
                    </Link>
                    <Link
                      to="/profile"
                      className="px-6 py-3 bg-primary-500/40 backdrop-blur-sm border border-white/20 font-bold rounded-xl hover:bg-primary-500/60 transition-all"
                    >
                      My Profile
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} padding="normal" className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        {stat.subtitle && <p className="text-xs text-slate-400 mt-1">{stat.subtitle}</p>}
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <Card title="My Application" subtitle="Your ration card registration" icon={FileText}>
                {isRejected && user.rejectionReason && (
                  <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    <strong>Rejected:</strong> {user.rejectionReason}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl gap-4">
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-base sm:text-lg">{userApplicationData.type}</p>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1.5 shrink-0" />
                        Registered on {userApplicationData.date}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Aadhaar: {user.aadhaarNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <StatusBadge status={userApplicationData.status} size="md" />
                    <Link
                      to="/status"
                      className="p-3 bg-white text-primary-600 hover:text-white hover:bg-primary-600 rounded-xl transition-all shadow-sm border border-slate-200"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <Card title="Account Details" subtitle="Fetched from your logged-in account" icon={User}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Mobile:</strong> {user.mobile}</p>
                  <p><strong>Occupation:</strong> {user.occupation}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                  <p><strong>Card No:</strong> {user.rationCardNumber || 'Pending'}</p>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
