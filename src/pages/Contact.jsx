import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import Input from '../components/Input'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  FileText
} from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      title: 'Helpline Number',
      value: '1800-XXX-XXXX',
      description: 'Toll-free, Available 24/7',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@ration.gov.in',
      description: 'We reply within 24 hours',
      color: 'bg-success-100 text-success-600',
    },
    {
      icon: MapPin,
      title: 'Head Office',
      value: 'New Delhi, India',
      description: 'Department of Food & PD',
      color: 'bg-warning-100 text-warning-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon - Sat: 9AM - 6PM',
      description: 'Sunday: Closed',
      color: 'bg-danger-100 text-danger-600',
    },
  ]

  const faqs = [
    {
      question: 'How do I apply for a new ration card?',
      answer: 'You can apply for a new ration card by registering on our platform, filling out the online application form, and uploading the required documents. The entire process is digital and takes about 15-20 minutes.',
    },
    {
      question: 'What documents are required for the application?',
      answer: 'The required documents include: Aadhaar Card, Address Proof (Utility Bill/Rent Agreement), Passport Size Photograph, and Income Certificate (for certain card types).',
    },
    {
      question: 'How long does it take to process my application?',
      answer: 'Typically, applications are processed within 7-15 working days. You can track your application status in real-time through the portal using your application ID.',
    },
    {
      question: 'What should I do if my application is rejected?',
      answer: 'If your application is rejected, you will receive a notification with the reason for rejection. You can rectify the issues and reapply, or contact our support team for assistance.',
    },
    {
      question: 'How can I download my digital ration card?',
      answer: 'Once your application is approved, you can download your digital ration card from the "My Ration Card" section in your dashboard. The card is available in PDF format with a QR code for verification.',
    },
    {
      question: 'Can I update my address or family details?',
      answer: 'Yes, you can update your address or family details by submitting an update application through the portal. Select the appropriate application type and provide the updated information with supporting documents.',
    },
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We're here to help. Reach out to us for any queries, feedback, or support.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{info.title}</h3>
                <p className="text-primary-600 font-medium mb-1">{info.value}</p>
                <p className="text-sm text-slate-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-slate-600">Fill out the form below and we'll get back to you</p>
                </div>
              </div>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-600 mb-6">
                    Thank you for contacting us. We'll respond to your query within 24 hours.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setIsSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label="Phone Number (Optional)"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="application">Application Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message <span className="text-danger-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Describe your query in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`
                        w-full rounded-lg border bg-white px-3 py-2.5 text-sm
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                        transition-colors duration-200
                        ${errors.message ? 'border-danger-300' : 'border-slate-300'}
                      `}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-sm text-danger-600">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={Send}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>

           {/* Office Location */}
<div>
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
    
    {/* Header */}
    <div className="p-6 border-b border-slate-200">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mr-4">
          <MapPin className="w-6 h-6 text-warning-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Visit Our Office</h2>
          <p className="text-slate-600">Department of Food & Public Distribution</p>
        </div>
      </div>
    </div>

    {/* Google Map */}
    <div className="h-80">
      <iframe
        title="Office Location"
        src="https://www.google.com/maps?q=Krishi+Bhavan+New+Delhi&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>

    {/* Address */}
    <div className="p-6">
      <h3 className="font-semibold text-slate-900 mb-3">Address Details</h3>
      <div className="space-y-2 text-sm text-slate-600">
        <p>Department of Food & Public Distribution</p>
        <p>Ministry of Consumer Affairs, Food & Public Distribution</p>
        <p>Krishi Bhavan, Dr. Rajendra Prasad Road</p>
        <p>New Delhi - 110001, India</p>
      </div>

      {/* Button */}
      <a
        href="https://www.google.com/maps?q=Krishi+Bhavan+New+Delhi"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-primary-600 font-medium hover:underline"
      >
        Get Directions →
      </a>
    </div>

  </div>


              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary-600" />
                  Quick Help
                </h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <FileText className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-sm text-slate-700">User Guide & Documentation</span>
                  </a>
                  <a href="#" className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <AlertCircle className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-sm text-slate-700">Report a Technical Issue</span>
                  </a>
                  <a href="#" className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <Phone className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-sm text-slate-700">Emergency Helpline</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-900 pr-8">{faq.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
