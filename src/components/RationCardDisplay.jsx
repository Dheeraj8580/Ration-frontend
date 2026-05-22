import {
  User,
  MapPin,
  Briefcase,
  IndianRupee,
  Users,
  Calendar,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { getUploadUrl } from '../utils/uploadUrl'

const CARD_CONFIG = {
  APL: {
    bg: 'from-emerald-500 to-teal-700',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  BPL: {
    bg: 'from-amber-400 to-orange-600',
    lightBg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  Antyodaya: {
    bg: 'from-rose-500 to-red-700',
    lightBg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
}

const formatDate = (value) => {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-IN')
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 mt-0.5">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</h4>
      <p className="text-sm font-black text-slate-800">{value || 'N/A'}</p>
    </div>
  </div>
)

const RationCardDisplay = ({ user, id = 'ration-card-print' }) => {
  if (!user) return null

  const config = CARD_CONFIG[user.rationCardType] || CARD_CONFIG.APL
  const photoUrl = getUploadUrl(user.profilePhoto)

  return (
    <div
      id={id}
      className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-slate-300 print:rounded-none"
    >
      <div className={`bg-gradient-to-r ${config.bg} p-6 sm:p-8 text-white relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-white p-3 rounded-2xl shadow-xl">
              <ShieldCheck className="w-10 h-10 text-primary-600" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">Smart Digital Ration Card</h1>
              <p className="text-white/80 font-bold tracking-widest text-xs uppercase mt-1">
                Government of India • Ministry of Food & Public Distribution
              </p>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <span className="text-xs font-black uppercase tracking-widest">Digital ID Verified</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="w-48 h-48 bg-slate-100 rounded-[3rem] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={80} strokeWidth={1} className="text-slate-300" />
                )}
              </div>
              <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full shadow-lg whitespace-nowrap bg-gradient-to-r ${config.bg} text-white text-sm font-black uppercase tracking-wider`}
              >
                {user.rationCardType || 'APL'} Card
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
              <QRCodeSVG value={user.rationCardNumber || 'N/A'} size={120} />
              <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Verification QR</p>
            </div>

            <div className={`p-4 rounded-2xl ${config.lightBg} border ${config.border} w-full text-left`}>
              <h4 className={`text-xs font-black uppercase tracking-widest ${config.text} mb-1`}>Card Number</h4>
              <p className="text-xl font-black tracking-tight text-slate-900">{user.rationCardNumber || '—'}</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Citizen Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              <DetailItem icon={User} label="Full Name" value={user.name} />
              <DetailItem icon={Calendar} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
              <DetailItem icon={CreditCard} label="Aadhaar Number" value={user.aadhaarNumber} />
              <DetailItem icon={Users} label="Family Members" value={String(user.familyMembersCount || '1')} />
              <DetailItem icon={Briefcase} label="Occupation" value={user.occupation} />
              <DetailItem
                icon={IndianRupee}
                label="Annual Income"
                value={`₹${(user.annualIncome ?? 0).toLocaleString('en-IN')}`}
              />
              <DetailItem icon={MapPin} label="District" value={user.district} />
              <DetailItem icon={MapPin} label="State" value={user.state} />
            </div>
            <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Permanent Address</h4>
              <p className="text-sm font-bold leading-relaxed">{user.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 sm:px-12 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Generated On: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Digitally Signed by Food Authority
          </span>
        </div>
      </div>
    </div>
  )
}

export default RationCardDisplay
