import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  Download,
  MessageSquare,
  Search,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  MapPin
} from 'lucide-react'

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const ApplicationStatus = () => {
  const { isLoggedIn, userId } = useAuth()
  const { user, loading } = useCurrentUser(userId)
  const [searchParams] = useSearchParams()
  const aadhaarParam = searchParams.get('aadhaar')
  const dobParam = searchParams.get('dob')

  const currentUser = {
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
  }

  const submitted = formatDate(user?.createdAt)
  const approved = user?.rationCardNumber ? 'approved' : 'pending'

  const userApplication = user ? {
    id: user.rationCardNumber || `APP-${user.id?.slice(-6)}`,
    type: `Digital Ration Card - ${user.rationCardType}`,
    submittedDate: submitted,
    status: approved,
    stages: [
      {
        title: 'Application Submitted',
        description: 'Your registration has been received by the system.',
        date: submitted,
        time: '—',
        status: 'completed',
        icon: FileText,
      },
      {
        title: 'Profile Verified',
        description: 'Your Aadhaar and personal details are on record.',
        date: submitted,
        time: '—',
        status: 'completed',
        icon: ClipboardCheck,
      },
      {
        title: 'Location Registered',
        description: `${user.district || ''}, ${user.state || ''}`.trim() || 'Address on file',
        date: submitted,
        time: '—',
        status: 'completed',
        icon: MapPin,
      },
      {
        title: user.rationCardNumber ? 'Ration Card Issued' : 'Card Pending',
        description: user.rationCardNumber
          ? `Your card number is ${user.rationCardNumber}`
          : 'Your ration card number will be assigned shortly.',
        date: submitted,
        time: '—',
        status: user.rationCardNumber ? 'completed' : 'pending',
        icon: ShieldCheck,
      },
    ],
  } : null

  let selectedApp = null
  let error = null

  if (loading && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isLoggedIn && userApplication) {
    selectedApp = userApplication
  } else if (aadhaarParam && dobParam) {
    if (aadhaarParam === '123456789012') {
      selectedApp = userApplication
    } else {
      error = "No application found with provided Aadhaar number and Date of Birth."
    }
  } else {
    error = "Please provide an Aadhaar number and Date of Birth to track your application."
  }

  const getStageStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          iconBg: 'bg-success-100 text-success-600',
          lineBg: 'bg-success-500',
          textColor: 'text-slate-900',
          descColor: 'text-slate-600'
        }
      case 'in-progress':
        return {
          iconBg: 'bg-primary-100 text-primary-600',
          lineBg: 'bg-slate-200',
          textColor: 'text-slate-900',
          descColor: 'text-slate-600'
        }
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-400',
          lineBg: 'bg-slate-200',
          textColor: 'text-slate-400',
          descColor: 'text-slate-400'
        }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isLoggedIn && <Navbar />}
      
      <div className="flex-1 flex overflow-hidden">
        {isLoggedIn && <Sidebar userType={user?.role || "user"} />}
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between pl-16 pr-6 sm:px-8 py-5">
              <div className="flex items-center space-x-4">
                <Link
                  to={isLoggedIn ? "/dashboard" : "/"}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Track Application</h1>
                  <p className="text-sm text-slate-500">Real-time status of your request</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {error ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center">
                  <div className="w-24 h-24 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-12 h-12 text-danger-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">No Application Found</h2>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">{error}</p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95"
                  >
                    Go Back Home
                  </Link>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Sidebar - Details & Notes */}
                  <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    {/* Applicant Details */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <h3 className="font-bold text-slate-800">Applicant Details</h3>
                        </div>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                          <p className="text-sm font-bold text-slate-900 mt-1">{currentUser.name}</p>
                        </div>
                        {aadhaarParam && (
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aadhaar Number</label>
                            <p className="text-sm font-mono font-bold text-slate-900 mt-1">XXXX-XXXX-{aadhaarParam.slice(-4)}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <p className="text-sm font-bold text-slate-900 mt-1">{currentUser.email}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                          <p className="text-sm font-bold text-slate-900 mt-1">+91 98765 43210</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">App ID:</span>
                            <span className="font-mono font-bold text-primary-600">{selectedApp.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-warning-600" />
                          </div>
                          <h3 className="font-bold text-slate-800">Important Notes</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {(selectedApp.status === 'approved' ? [
                            "Your ration card is now ready for use",
                            "You can download the digital copy anytime",
                            "Present the digital card at any fair price shop",
                            "Keep your credentials secure for future access"
                          ] : [
                            "Keep your application ID safe for future reference",
                            "You will receive SMS updates at each stage",
                            "Field verification may take 3-5 working days",
                            "Contact support if no update for 7 working days"
                          ]).map((note, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area - Timeline */}
                  <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">Application Progress</h2>
                          <p className="text-sm text-slate-500 mt-1">Status: <span className="font-semibold text-success-600 capitalize">{selectedApp.status}</span></p>
                        </div>
                        <StatusBadge status={selectedApp.status} size="lg" />
                      </div>

                      {/* Vertical Stepper */}
                      <div className="relative pl-4">
                        {/* Connecting Line */}
                        <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100" />
                        
                        <div className="space-y-12">
                          {selectedApp.stages.map((stage, index) => {
                            const style = getStageStyle(stage.status);
                            const Icon = stage.icon;
                            return (
                              <div key={index} className="relative flex gap-8 group">
                                {/* Icon Container */}
                                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${style.iconBg} ring-4 ring-white`}>
                                  <Icon className="w-6 h-6" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className={`text-lg font-bold transition-colors ${style.textColor}`}>
                                        {stage.title}
                                      </h4>
                                      <p className={`text-sm mt-1.5 leading-relaxed max-w-md ${style.descColor}`}>
                                        {stage.description}
                                      </p>
                                    </div>
                                    {stage.date && (
                                      <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stage.date}</p>
                                        <p className="text-xs text-slate-300 mt-0.5">{stage.time}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap gap-4">
                        {selectedApp.status === 'approved' && (
                          <Link
                            to="/digital-ration-card"
                            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95 w-full sm:w-auto"
                          >
                            <Download className="w-5 h-5 mr-3" />
                            Download Ration Card
                          </Link>
                        )}
                        <Link 
                          to="/contact"
                          className="inline-flex items-center justify-center px-8 py-4 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 w-full sm:w-auto"
                        >
                          <MessageSquare className="w-5 h-5 mr-3 text-slate-400" />
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ApplicationStatus
