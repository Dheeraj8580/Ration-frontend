import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Input from '../components/Input'
import RationCardDisplay from '../components/RationCardDisplay'
import {
  ArrowLeft,
  CheckCircle,
  Upload,
  User,
  Users,
  FileText,
  Home,
  CreditCard,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Clock
} from 'lucide-react'

const ApplicationForm = () => {
  const navigate = useNavigate()
  const { user, submitApplication, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser?.()
  }, [refreshUser])

  useEffect(() => {
    if (!user) return
    const dob = user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : ''
    setFormData((prev) => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email,
      phone: user.mobile || prev.phone,
      aadhaarNumber: user.aadhaarNumber || prev.aadhaarNumber,
      dateOfBirth: dob || prev.dateOfBirth,
      address: user.address || prev.address,
      city: user.district || prev.city,
      state: user.state || prev.state,
      pincode: user.pincode || prev.pincode,
      fatherName: user.fatherName || prev.fatherName,
      motherName: user.motherName || prev.motherName,
      gender: user.gender || prev.gender,
      maritalStatus: user.maritalStatus || prev.maritalStatus,
      familyMembers:
        user.familyMembers?.length > 0 ? user.familyMembers : prev.familyMembers,
    }))
  }, [user])

  const hasSubmittedApplication =
    !!user?.applicationSubmittedAt ||
    !!(user?.documents?.idProof && user?.documents?.addressProof)

  const hasExistingCard =
    user?.applicationStatus === 'Approved' &&
    !!user?.rationCardNumber

  const isPending =
    user?.applicationStatus === 'Pending' && hasSubmittedApplication

  const canApply =
    user?.applicationStatus === 'NotSubmitted' ||
    user?.applicationStatus === 'Rejected' ||
    (user?.applicationStatus === 'Pending' && !hasSubmittedApplication)

  const formatCardType = (type) => {
    const map = { APL: 'Above Poverty Line (APL)', BPL: 'Below Poverty Line (BPL)', Antyodaya: 'Antyodaya Anna Yojana (AAY)' }
    return map[type] || type || 'Ration Card'
  }

  const existingCardData = {
    cardNumber: user?.rationCardNumber || '—',
    cardType: formatCardType(user?.rationCardType),
    status: 'Active',
    issuedDate: user?.approvalDate
      ? new Date(user.approvalDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—',
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    aadhaarNumber: '',
    phone: '',
    email: '',

    // Address Details
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Family Details
    familyMembers: [
      { name: '', relation: '', age: '', aadhaar: '' }
    ],

    // Card Type
    cardType: '',
  })

  const [errors, setErrors] = useState({})

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Address', icon: Home },
    { number: 3, title: 'Family Members', icon: Users },
    { number: 4, title: 'Documents', icon: FileText },
    { number: 5, title: 'Payment', icon: CreditCard },
  ]

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
      if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      if (!formData.gender) newErrors.gender = 'Gender is required'
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required'
      if (!formData.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = 'Aadhaar number is required'
      } else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ''))) {
        newErrors.aadhaarNumber = 'Enter valid 12-digit Aadhaar number'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = 'Enter valid 10-digit phone number'
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required'
      } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Enter valid 6-digit pincode'
      }
    }

    if (step === 3) {
      const invalidMember = formData.familyMembers.some(
        (m) => !m.name?.trim() || !m.relation
      )
      if (invalidMember) {
        newErrors.familyMembers = 'Each family member needs a name and relation'
      }
      if (!formData.cardType) newErrors.cardType = 'Please select card type'
    }

    if (step === 4) {
      const requiredDocs = ['photo', 'idProof', 'addressProof']
      requiredDocs.forEach(doc => {
        if (!uploadedFiles[doc]) {
          newErrors[doc] = 'This document is required'
        }
      })
    }

    if (step === 5) {
      if (!paymentCompleted) {
        newErrors.payment = 'Please complete the application fee payment.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileUpload = (docType, e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [docType]: file }))
      if (errors[docType]) {
        setErrors(prev => ({ ...prev, [docType]: '' }))
      }
    }
  }

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', relation: '', age: '', aadhaar: '' }]
    }))
  }

  const updateFamilyMember = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.familyMembers]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, familyMembers: updated }
    })
  }

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }))
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsPaying(true);
    
    // Attempt to load official Razorpay SDK for Test Mode popup
    const isLoaded = await loadRazorpayScript();
    
    if (isLoaded) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SrwpG0CaV7aaS8',
        amount: 6000, // ₹60.00 in paise
        currency: 'INR',
        name: 'Digital Ration Portal',
        description: 'Application Fee Payment',
        handler: function (response) {
          setPaymentId(response.razorpay_payment_id);
          setPaymentCompleted(true);
          setIsPaying(false);
          if (errors.payment) {
            setErrors(prev => ({ ...prev, payment: '' }));
          }
        },
        prefill: {
          name: formData.fullName || user?.name || '',
          email: formData.email || user?.email || 'dheerajk.jk@gmail.com',
          contact: formData.phone || user?.mobile || '',
        },
        theme: {
          color: '#0f172a',
        },
        modal: {
          ondismiss: function () {
            // Keep isPaying as true to allow manual UTR input fallback if they want
          }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.error('Razorpay initialization error:', err);
      }
    }
    
    // Fallback: If SDK fails to load or error occurs, open the Razorpay.me test page
    window.open('https://razorpay.me/@dheeraj6446', '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    const fullAddress = [formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(', ')

    const result = await submitApplication(
      {
        name: formData.fullName,
        mobile: formData.phone,
        address: fullAddress || formData.address,
        dateOfBirth: formData.dateOfBirth,
        aadhaarNumber: formData.aadhaarNumber,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        pincode: formData.pincode,
        familyMembersCount: formData.familyMembers.length,
        familyMembers: JSON.stringify(formData.familyMembers),
        cardType: formData.cardType,
        occupation: formData.occupation || 'General',
        annualIncome: formData.annualIncome || user?.annualIncome || 50000,
        state: formData.state,
        district: formData.city,
        paymentId: paymentId || `pay_simulated_${Date.now()}`,
        isFeePaid: true,
      },
      {
        photo: uploadedFiles.photo,
        idProof: uploadedFiles.idProof,
        addressProof: uploadedFiles.addressProof,
        incomeProof: uploadedFiles.incomeProof || undefined,
      }
    )

    setIsSubmitting(false)

    if (result.success) {
      setIsSuccess(true)
    } else {
      alert(result.error || 'Failed to submit application')
    }
  }

  if (!canApply && isPending && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar userType="user" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Application Under Review</h1>
            <p className="text-slate-600 mb-6">
              Your application with documents and family details is pending admin approval.
              Your ration card will be issued only after approval.
            </p>
            <Link to="/status" className="btn-primary inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold">Track Status</Link>
          </div>
        </div>
      </div>
    )
  }

  if (hasExistingCard) {
    return (
      <div className="min-h-screen bg-slate-50 flex ration-card-page">
        <Sidebar userType="user" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Digital Ration Card</h1>
              <p className="text-slate-600">
                Your application is approved. View, print, or download your card below.
              </p>
            </div>

            <RationCardDisplay user={user} id="ration-card-print" />

            <div className="mt-8 flex flex-wrap gap-3 justify-center ration-card-instructions">
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  document.body.classList.add('printing-ration-card')
                  window.print()
                  window.addEventListener(
                    'afterprint',
                    () => document.body.classList.remove('printing-ration-card'),
                    { once: true }
                  )
                }}
              >
                Download Card (PDF)
              </Button>
              <Button variant="primary" onClick={() => navigate('/digital-ration-card')}>
                Full Screen View
              </Button>
              <Link
                to="/contact"
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-2"
              >
                Contact Support for Card Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar userType="user" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Application Submitted!
            </h1>
            <p className="text-slate-600 mb-2">
              Your application has been successfully submitted for review.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-500 mb-1">Application ID</p>
              <p className="text-xl font-bold text-primary-600">
                APP-{user?.id?.slice(-6)?.toUpperCase() || 'SUBMITTED'}
              </p>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              You can track your application status using this ID. We'll notify you via SMS and email once your application is processed.
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => navigate('/status')}
              >
                Track Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between pl-16 pr-6 sm:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Apply for Ration Card</h1>
                <p className="text-xs sm:text-sm text-slate-500">Complete all steps to submit your application</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Stepper - Desktop View */}
            <div className="hidden md:block mb-12 relative">
              <div className="absolute top-6 left-16 right-16 h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-start relative z-10">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex flex-col items-center w-32">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ring-4 ring-slate-50 ${currentStep > step.number
                      ? 'bg-success-600 text-white scale-105'
                      : currentStep === step.number
                        ? 'bg-primary-600 text-white scale-110 shadow-primary-200 shadow-lg'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-3 text-xs font-bold text-center uppercase tracking-wider ${currentStep >= step.number ? 'text-primary-900' : 'text-slate-400'
                      }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper - Mobile View */}
            <div className="block md:hidden mb-8 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
                    {(() => {
                      const ActiveIcon = steps[currentStep - 1].icon
                      return <ActiveIcon className="w-5 h-5" />
                    })()}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Step {currentStep} of {steps.length}</p>
                    <h3 className="font-bold text-slate-800 text-sm leading-none mt-1">{steps[currentStep - 1].title}</h3>
                  </div>
                </div>
                <span className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {Math.round((currentStep / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {user?.applicationStatus === 'Rejected' && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-danger-800">Previous application rejected</p>
                  <p className="text-sm text-danger-700 mt-1">
                    {user.rejectionReason || 'Please update your details and resubmit.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-5 sm:p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary-600" />
                    Personal Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      error={errors.fullName}
                      required
                    />
                    <Input
                      label="Father's Name"
                      name="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={handleChange}
                      error={errors.fatherName}
                      required
                    />
                    <Input
                      label="Mother's Name"
                      name="motherName"
                      placeholder="Enter mother's name"
                      value={formData.motherName}
                      onChange={handleChange}
                      error={errors.motherName}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Date of Birth <span className="text-danger-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`
                          w-full rounded-lg border bg-white px-3 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                          ${errors.dateOfBirth ? 'border-danger-300' : 'border-slate-300'}
                        `}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1.5 text-sm text-danger-600">{errors.dateOfBirth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Gender <span className="text-danger-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`
                          w-full rounded-lg border bg-white px-3 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                          ${errors.gender ? 'border-danger-300' : 'border-slate-300'}
                        `}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1.5 text-sm text-danger-600">{errors.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Marital Status <span className="text-danger-500">*</span>
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.maritalStatus ? 'border-danger-300' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="widowed">Widowed</option>
                        <option value="divorced">Divorced</option>
                      </select>
                      {errors.maritalStatus && (
                        <p className="mt-1.5 text-sm text-danger-600">{errors.maritalStatus}</p>
                      )}
                    </div>
                    <Input
                      label="Aadhaar Number"
                      name="aadhaarNumber"
                      placeholder="12-digit Aadhaar number"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      error={errors.aadhaarNumber}
                      required
                      maxLength={12}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="10-digit phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      required
                      maxLength={10}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-primary-600" />
                    Address Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Complete Address <span className="text-danger-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows="3"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`
                          w-full rounded-lg border bg-white px-3 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                          ${errors.address ? 'border-danger-300' : 'border-slate-300'}
                        `}
                      />
                      {errors.address && (
                        <p className="mt-1.5 text-sm text-danger-600">{errors.address}</p>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="City"
                        name="city"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        placeholder="Your state"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Pincode"
                          name="pincode"
                          placeholder="6-digit pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          error={errors.pincode}
                          required
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Family Members */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary-600" />
                      Family Members
                    </h2>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addFamilyMember}
                      icon={Users}
                    >
                      Add Member
                    </Button>
                  </div>

                  {errors.familyMembers && (
                    <p className="text-sm text-danger-600 font-medium">{errors.familyMembers}</p>
                  )}

                  <div className="space-y-4">
                    {formData.familyMembers.map((member, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-slate-900">Member {index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <select
                            value={member.relation}
                            onChange={(e) => updateFamilyMember(index, 'relation', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Relation</option>
                            <option value="spouse">Spouse</option>
                            <option value="son">Son</option>
                            <option value="daughter">Daughter</option>
                            <option value="father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="other">Other</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Age"
                            value={member.age}
                            onChange={(e) => updateFamilyMember(index, 'age', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Aadhaar (optional)"
                            value={member.aadhaar}
                            onChange={(e) => updateFamilyMember(index, 'aadhaar', e.target.value)}
                            maxLength={12}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="md:w-2/3">
                      <label className="block text-sm font-bold text-primary-900 mb-2">
                        Ration Card Type <span className="text-danger-500">*</span>
                      </label>
                      <select
                        name="cardType"
                        value={formData.cardType}
                        onChange={handleChange}
                        className={`
                          w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium
                          focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                          ${errors.cardType ? 'border-danger-300' : 'border-primary-200'}
                        `}
                      >
                        <option value="">Select Card Type</option>
                        <option value="apl">Above Poverty Line (APL)</option>
                        <option value="bpl">Below Poverty Line (BPL)</option>
                        <option value="antyodaya">Antyodaya Anna Yojana (AAY)</option>
                      </select>
                      {errors.cardType && (
                        <p className="mt-2 text-sm text-danger-600 font-medium">{errors.cardType}</p>
                      )}
                      <p className="mt-3 text-sm text-primary-700/80 leading-relaxed">
                        Card type determines your eligibility and benefits under the Public Distribution System. Ensure you select the correct category.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-600" />
                    Document Upload
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { key: 'photo', label: 'Passport Size Photo', accept: 'image/*' },
                      { key: 'idProof', label: 'Identity Proof (Aadhaar/PAN/Voter ID)', accept: '.pdf,.jpg,.png' },
                      { key: 'addressProof', label: 'Address Proof', accept: '.pdf,.jpg,.png' },
                      { key: 'incomeProof', label: 'Income Proof (optional)', accept: '.pdf,.jpg,.png' },
                    ].map((doc) => (
                      <div
                        key={doc.key}
                        className={`p-6 border-2 border-dashed rounded-xl transition-colors ${uploadedFiles[doc.key]
                          ? 'border-success-300 bg-success-50'
                          : 'border-slate-300 hover:border-primary-400 bg-white'
                          }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${uploadedFiles[doc.key] ? 'bg-success-100' : 'bg-slate-100'
                            }`}>
                            {uploadedFiles[doc.key] ? (
                              <CheckCircle className={`w-6 h-6 ${uploadedFiles[doc.key] ? 'text-success-600' : 'text-slate-400'}`} />
                            ) : (
                              <Upload className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <p className="font-medium text-slate-900 mb-1">
                            {doc.label}
                            {!doc.label.includes('optional') && <span className="text-danger-500">*</span>}
                          </p>
                          {uploadedFiles[doc.key] ? (
                            <div className="flex items-center justify-center space-x-2">
                              <p className="text-sm text-success-600">{uploadedFiles[doc.key].name}</p>
                              <button
                                type="button"
                                onClick={() => setUploadedFiles(prev => ({ ...prev, [doc.key]: null }))}
                                className="p-1 text-slate-400 hover:text-danger-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-slate-500 mb-3">Click to upload or drag and drop</p>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept={doc.accept}
                                  onChange={(e) => handleFileUpload(doc.key, e)}
                                  className="hidden"
                                />
                                <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                                  Choose File
                                </span>
                              </label>
                            </>
                          )}
                          {errors[doc.key] && (
                            <p className="mt-2 text-sm text-danger-600">{errors[doc.key]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-warning-50 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-warning-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-warning-700">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>All documents should be clear and readable</li>
                        <li>Maximum file size: 5MB per document</li>
                        <li>Accepted formats: PDF, JPG, PNG</li>
                        <li>Documents will be verified by officials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    Application Fee Payment
                  </h2>

                  <div className="grid md:grid-cols-5 gap-8">
                    {/* Fee Summary */}
                    <div className="md:col-span-3 space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 text-base">Fee Breakdown</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Application Form Fee</span>
                            <span className="font-medium text-slate-900">₹60.00</span>
                          </div>
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Processing & Portal Charges</span>
                            <span className="font-medium text-success-600">FREE</span>
                          </div>
                          <div className="border-t border-slate-200 my-2 pt-3 flex justify-between text-base font-bold text-slate-900">
                            <span>Total Payable Amount</span>
                            <span className="text-primary-600 text-lg">₹60.00</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6">
                        <h4 className="font-semibold text-primary-900 mb-2 flex items-center text-sm">
                          <AlertCircle className="w-4 h-4 mr-2 text-primary-600" />
                          Secure Transaction
                        </h4>
                        <p className="text-xs text-primary-700 leading-relaxed">
                          Your transaction is secured using 256-bit encryption. The fee is mandatory for processing the ration card application as per the State Department guidelines.
                        </p>
                      </div>
                    </div>

                    {/* Payment Action / Status */}
                    <div className="md:col-span-2 flex flex-col justify-between">
                      {paymentCompleted ? (
                        <div className="border-2 border-success-200 rounded-2xl p-6 text-center bg-success-50/50 flex flex-col items-center justify-center min-h-[220px] space-y-4 animate-scale-in">
                          <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center text-success-600">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-success-900">Payment Successful</p>
                            <p className="text-xs text-success-600 mt-1">Your fee payment is registered.</p>
                          </div>
                          <div className="bg-white border border-success-100 rounded-xl p-3 w-full text-left space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Transaction ID / UTR:</span>
                              <span className="font-mono font-medium text-slate-900">{paymentId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Amount Paid:</span>
                              <span className="font-semibold text-slate-900">₹60.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Status:</span>
                              <span className="font-bold text-success-600">PAID</span>
                            </div>
                          </div>
                        </div>
                      ) : isPaying ? (
                        <div className="border-2 border-primary-200 rounded-2xl p-6 bg-white flex flex-col min-h-[220px] space-y-4 animate-fade-in">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-2 animate-pulse">
                              <Clock className="w-5 h-5" />
                            </div>
                            <p className="font-bold text-slate-900 text-sm">Verify Payment</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              We've opened the Razorpay page in a new tab. Please complete the ₹60.00 payment and paste the Transaction ID / UTR below.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                              Transaction ID / UTR <span className="text-danger-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={paymentId}
                              onChange={(e) => {
                                setPaymentId(e.target.value);
                                if (errors.payment) {
                                  setErrors(prev => ({ ...prev, payment: '' }));
                                }
                              }}
                              placeholder="Enter UTR or Ref ID"
                              className={`w-full font-mono rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.payment ? 'border-danger-300' : 'border-slate-300'
                              }`}
                            />
                            {errors.payment && (
                              <p className="text-xs text-danger-600 font-medium text-left">{errors.payment}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Button
                              type="button"
                              variant="primary"
                              className="w-full justify-center py-2.5 text-sm font-semibold rounded-xl"
                              onClick={() => {
                                if (!paymentId.trim()) {
                                  setErrors(prev => ({ ...prev, payment: 'Please enter a valid Transaction ID / UTR to verify.' }));
                                  return;
                                }
                                if (paymentId.trim().length < 4) {
                                  setErrors(prev => ({ ...prev, payment: 'UTR/Transaction ID must be at least 4 characters long.' }));
                                  return;
                                }
                                setPaymentCompleted(true);
                                setIsPaying(false);
                                if (errors.payment) {
                                  setErrors(prev => ({ ...prev, payment: '' }));
                                }
                              }}
                            >
                              Verify & Confirm Payment
                            </Button>
                            
                            <div className="flex justify-between items-center px-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPaying(false);
                                  setPaymentId('');
                                }}
                                className="text-xs text-slate-500 hover:text-slate-800 transition-colors underline"
                              >
                                Go Back
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const mockUtr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                                  setPaymentId(mockUtr);
                                  if (errors.payment) {
                                    setErrors(prev => ({ ...prev, payment: '' }));
                                  }
                                }}
                                className="text-xs text-primary-600 hover:text-primary-800 transition-colors font-medium"
                              >
                                Auto-fill Test UTR
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-slate-200 rounded-2xl p-6 text-center bg-white flex flex-col items-center justify-center min-h-[220px] space-y-4">
                          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Payment Pending</p>
                            <p className="text-xs text-slate-500 mt-1">Please pay the fee to submit your application.</p>
                          </div>
                          <Button
                            type="button"
                            variant="primary"
                            className="w-full justify-center py-3 text-sm font-semibold rounded-xl"
                            onClick={handlePayment}
                          >
                            Pay ₹60.00 with Razorpay
                          </Button>
                          {errors.payment && (
                            <p className="text-xs text-danger-600 font-medium">{errors.payment}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={currentStep === 1 ? () => navigate('/dashboard') : handlePrevious}
                  icon={ChevronLeft}
                  disabled={isSubmitting}
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </Button>

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    icon={ChevronRight}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={!paymentCompleted || isSubmitting}
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Razorpay In-App Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300 scale-100 flex flex-col">
            {/* Header */}
            <div className="bg-[#172554] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setShowSimulator(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Digital Ration Portal</h3>
                  <p className="text-xs text-blue-200">dheerajk.jk@gmail.com</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-end border-t border-blue-800/60 pt-4">
                <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Amount to Pay</span>
                <span className="text-2xl font-bold">₹60.00</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1 bg-slate-50">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Developer Sandbox Simulation</p>
                  <p className="text-amber-800">
                    No active `VITE_RAZORPAY_KEY_ID` was detected in your `.env` file. We are running in secure sandbox simulation prefilled for **dheerajk.jk@gmail.com**.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Simulation Outcome</p>
                
                <button
                  type="button"
                  onClick={() => {
                    const simPayId = `pay_sim_${Math.random().toString(36).substr(2, 9)}`;
                    setPaymentId(simPayId);
                    setPaymentCompleted(true);
                    setShowSimulator(false);
                  }}
                  className="w-full bg-white hover:bg-success-50 border border-slate-200 hover:border-success-300 rounded-xl p-4 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-success-50 flex items-center justify-center text-success-600 group-hover:bg-success-100 transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Simulate Success</p>
                      <p className="text-xs text-slate-500">Test successful payment submission flow</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-success-600 transition-colors" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert('Oops! Something went wrong. Payment Failed');
                    setShowSimulator(false);
                  }}
                  className="w-full bg-white hover:bg-danger-50 border border-slate-200 hover:border-danger-300 rounded-xl p-4 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-danger-50 flex items-center justify-center text-danger-600 group-hover:bg-danger-100 transition-colors">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Simulate Failure</p>
                      <p className="text-xs text-slate-500">Test failed payment validation flow</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-danger-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 text-center flex items-center justify-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Secured by</span>
              <span className="text-blue-600 font-bold italic text-xs tracking-wider">Razorpay</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationForm
