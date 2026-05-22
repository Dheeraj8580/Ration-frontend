import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  Camera
} from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    familyMembersCount: 1,
    occupation: '',
    annualIncome: '',
    district: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const { registerUser } = useAuth()

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePhoto: 'Please upload a JPG or PNG image.' }))
      return
    }
    setProfilePhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, profilePhoto: '' }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required'
      } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number'
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      if (!formData.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = 'Aadhaar number is required'
      } else       if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = 'Enter a valid 12-digit Aadhaar number'
      }
      if (!profilePhoto) newErrors.profilePhoto = 'Profile photo is required for your ration card'
    }

    if (step === 2) {
      if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required'
      if (!formData.annualIncome) {
        newErrors.annualIncome = 'Annual income is required'
      } else if (isNaN(formData.annualIncome)) {
        newErrors.annualIncome = 'Enter a valid amount'
      }
      if (!formData.familyMembersCount) {
        newErrors.familyMembersCount = 'Family count is required'
      }
    }

    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.district.trim()) newErrors.district = 'District is required'
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => setCurrentStep(prev => prev - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    const result = await registerUser({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.state} - ${formData.pincode}`,
      dateOfBirth: formData.dateOfBirth,
      aadhaarNumber: formData.aadhaarNumber,
      familyMembersCount: Number(formData.familyMembersCount),
      occupation: formData.occupation,
      annualIncome: Number(formData.annualIncome),
      state: formData.state,
      district: formData.district,
    }, profilePhoto)

    setIsLoading(false)
    if (result.success) {
      setIsSuccess(true)
    } else {
      setErrors({ server: result.error })
    }
  }

  const steps = [
    { number: 1, title: 'Personal' },
    { number: 2, title: 'Socio-Economic' },
    { number: 3, title: 'Location & Security' },
  ]

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Registration Successful!</h1>
          <p className="text-slate-600 mb-8">
            Your smart ration card has been generated automatically based on your details.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent"></div>

      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4 pb-12">
        <div className="w-full max-w-xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/20 rotate-3">
                <FileText className="w-10 h-10 text-white -rotate-3" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Smart Account</h1>
              <p className="text-slate-500">Intelligent Ration Card Allocation System</p>
            </div>

            <div className="flex items-center justify-between mb-12 px-2">
              {steps.map((step, index) => (
                <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${currentStep >= step.number ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 text-slate-400'}`}>
                      {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
                    </div>
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-700 ${currentStep > step.number ? 'bg-primary-600' : 'bg-slate-100'}`} />
                  )}
                </div>
              ))}
            </div>

            {errors.server && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center animate-shake">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                {errors.server}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input label="Full Name" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={User} required />
                  </div>
                  <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} required />
                  <Input label="Mobile Number" name="mobile" type="tel" placeholder="10-digit number" value={formData.mobile} onChange={handleChange} error={errors.mobile} icon={Phone} required maxLength={10} />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3.5 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" />
                    {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1 ml-1">{errors.dateOfBirth}</p>}
                  </div>
                  <Input label="Aadhaar Number" name="aadhaarNumber" placeholder="12-digit Aadhaar" value={formData.aadhaarNumber} onChange={handleChange} error={errors.aadhaarNumber} icon={FileText} required maxLength={12} />
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">
                      Profile Photo <span className="text-red-500">*</span>
                      <span className="text-slate-400 font-normal text-xs ml-2">(shown on your ration card)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <div className="w-28 h-28 rounded-2xl bg-white border-2 border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm text-slate-600 mb-3">Passport-size photo, JPG or PNG, max 5MB</p>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                          <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {errors.profilePhoto && <p className="text-xs text-red-500 mt-2">{errors.profilePhoto}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input label="Occupation" name="occupation" placeholder="e.g. Farmer, Private Sector, etc." value={formData.occupation} onChange={handleChange} error={errors.occupation} icon={FileText} required />
                  </div>
                  <Input label="Annual Income (₹)" name="annualIncome" type="number" placeholder="Total yearly income" value={formData.annualIncome} onChange={handleChange} error={errors.annualIncome} icon={FileText} required />
                  <Input label="Family Members" name="familyMembersCount" type="number" placeholder="Total members" value={formData.familyMembersCount} onChange={handleChange} error={errors.familyMembersCount} icon={User} required min="1" />
                  <div className="md:col-span-2 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                    <p className="text-xs text-primary-700 leading-relaxed font-medium">
                      <span className="font-bold">Note:</span> Your Ration Card category will be automatically calculated based on your income and family size using our smart allocation algorithm.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input label="Address" name="address" placeholder="House No, Street, Landmark" value={formData.address} onChange={handleChange} error={errors.address} icon={Mail} required />
                  </div>
                  <Input label="District" name="district" placeholder="Enter District" value={formData.district} onChange={handleChange} error={errors.district} required />
                  <Input label="State" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} error={errors.state} required />
                  <Input label="Pincode" name="pincode" placeholder="6-digit PIN" value={formData.pincode} onChange={handleChange} error={errors.pincode} required maxLength={6} />
                  <div className="md:col-span-2 grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <Input label="Password" name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} error={errors.password} icon={Lock} required />
                    <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={Lock} required />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8">
                {currentStep > 1 && (
                  <button type="button" onClick={handlePrevious} className="flex-1 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button type="button" onClick={handleNext} className="flex-[2] py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all">
                    Continue
                  </button>
                ) : (
                  <button type="submit" disabled={isLoading} className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:shadow-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
