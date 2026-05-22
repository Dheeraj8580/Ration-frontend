import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCurrentUser } from '../hooks/useCurrentUser'
import LoadingSpinner from '../components/LoadingSpinner'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Input from '../components/Input'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
  Camera,
  Lock,
  LogOut,
  ArrowLeft,
} from 'lucide-react'



const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
    <div className="px-6 sm:px-8 py-2 pb-6">{children}</div>
  </div>
)

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm'

const mapUserToProfile = (u) => ({
  fullName: u?.name || '',
  email: u?.email || '',
  phone: u?.mobile || '',
  aadhaar: u?.aadhaarNumber || '',
  dateOfBirth: u?.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : '',
  gender: '—',
  fatherName: '—',
  motherName: '—',
  maritalStatus: '—',
  rationCardType: u?.rationCardType || '—',
  rationCardNumber: u?.rationCardNumber || '—',
  occupation: u?.occupation || '—',
  annualIncome: u?.annualIncome != null ? `₹${Number(u.annualIncome).toLocaleString('en-IN')}` : '—',
  address: {
    street: u?.address || '',
    city: u?.district || '',
    district: u?.district || '',
    state: u?.state || '',
    pincode: '—',
  },
  memberSince: u?.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : '—',
  lastLogin: 'Current session',
  accountStatus: 'Active',
})

const Profile = () => {
  const navigate = useNavigate();
  const { logout, userId } = useAuth();
  const { user, loading } = useCurrentUser(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)

  const [userData, setUserData] = useState(() => mapUserToProfile(null))
  const [formData, setFormData] = useState({ ...userData })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      const mapped = mapUserToProfile(user)
      setUserData(mapped)
      if (!isEditing) setFormData(mapped)
    }
  }, [user, isEditing])

  const handleEdit = () => { setFormData({ ...userData }); setIsEditing(true) }
  const handleCancel = () => { setIsEditing(false); setErrors({}) }

  const handleSave = () => {
    const newErrors = {}
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Enter valid 10-digit phone number'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setUserData({ ...formData })
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                <p className="text-xs text-slate-500">Manage your personal information</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="primary" size="sm" onClick={handleEdit} icon={Edit2}>Edit Profile</Button>
                  <Button variant="danger" size="sm" onClick={handleLogout} icon={LogOut}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={handleCancel} icon={X}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} icon={Save}>Save Changes</Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            {showSuccess && (
              <div className="p-4 bg-success-50 border border-success-200 rounded-xl flex items-center gap-3 shadow-sm">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <p className="text-sm font-medium text-success-800">Profile updated successfully!</p>
              </div>
            )}

            {/* Top Banner - Avatar & Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-center md:items-stretch">
              <div className="p-8 flex flex-col items-center justify-center md:border-r border-slate-100 bg-slate-50/50 w-full md:w-1/3">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{userData.fullName}</h2>
                <p className="text-sm text-slate-500 mb-3">{userData.email}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-50 text-success-700 border border-success-200 rounded-full text-xs font-bold uppercase tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {userData.accountStatus}
                </span>
              </div>
              <div className="p-8 w-full md:w-2/3 flex flex-col justify-center bg-white">
                <div className="grid grid-cols-2 gap-6 text-center divide-x divide-slate-100">
                  <div>
                    <p className="text-3xl font-black text-slate-900 mb-1">1</p>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Ration Card</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900 mb-1">3</p>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Applications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid - Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Forms) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Personal Information */}
                <SectionCard title="Personal Information" icon={User}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                      {isEditing ? (
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Aadhaar Number</label>
                      <div className="flex items-center gap-2 py-2">
                        <p className="text-sm font-mono font-bold text-slate-900">{userData.aadhaar}</p>
                        <span className="px-2 py-0.5 bg-success-50 text-success-700 border border-success-200 rounded text-xs font-bold">Verified</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
                      {isEditing ? (
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">
                          {new Date(userData.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                      {isEditing ? (
                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.gender}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Father's Name</label>
                      {isEditing ? (
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.fatherName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Mother's Name</label>
                      {isEditing ? (
                        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.motherName}</p>
                      )}
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Marital Status</label>
                      {isEditing ? (
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputCls}>
                          <option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                        </select>
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.maritalStatus}</p>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* Contact Information */}
                <SectionCard title="Contact Information" icon={Mail}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                      <div className="flex items-center gap-2 py-2">
                        <p className="text-sm font-bold text-slate-900">{userData.email}</p>
                        <span className="px-2 py-0.5 bg-success-50 text-success-700 border border-success-200 rounded text-xs font-bold">Verified</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                      {isEditing ? (
                        <div>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} className={`${inputCls} ${errors.phone ? 'border-danger-400 focus:ring-danger-500' : ''}`} />
                          {errors.phone && <p className="text-xs text-danger-600 mt-1">{errors.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.phone}</p>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* Address Information */}
                <SectionCard title="Address" icon={MapPin}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Street Address</label>
                      {isEditing ? (
                        <textarea name="address.street" value={formData.address.street} onChange={handleChange} rows={2} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.address.street}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">City</label>
                      {isEditing ? (
                        <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.address.city}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
                      {isEditing ? (
                        <input type="text" name="address.district" value={formData.address.district} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.address.district}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">State</label>
                      {isEditing ? (
                        <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.address.state}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Pincode</label>
                      {isEditing ? (
                        <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleChange} className={inputCls} />
                      ) : (
                        <p className="text-sm font-bold text-slate-900 py-2 border-b border-transparent">{userData.address.pincode}</p>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* Right Column (Side Cards) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Security */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800">Security</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Password</p>
                        <p className="text-xs text-slate-500">Updated 3 months ago</p>
                      </div>
                    </div>
                    <button onClick={() => setShowPasswordModal(true)} className="text-sm text-primary-600 font-bold hover:text-primary-700 transition-colors">
                      Change
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800">Activity</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Member Since</span>
                      <span className="text-sm font-bold text-slate-900">{userData.memberSince}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Last Login</span>
                      <span className="text-sm font-bold text-slate-900">{userData.lastLogin}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Current Password" type="password" placeholder="Enter current password" maxLength={6} />
              <Input label="New Password" type="password" placeholder="Enter new password" maxLength={6} />
              <Input label="Confirm New Password" type="password" placeholder="Confirm new password" maxLength={6} />
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={() => setShowPasswordModal(false)}>Update Password</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
