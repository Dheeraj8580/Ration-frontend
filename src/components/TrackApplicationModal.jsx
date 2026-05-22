import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { X, Search, CreditCard, Calendar } from 'lucide-react'
import Input from './Input'
import Button from './Button'

const TrackApplicationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [aadhaar, setAadhaar] = useState('')
  const [dob, setDob] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      setAadhaar('')
      setDob('')
      setErrors({})
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const validate = () => {
    const next = {}
    const cleaned = aadhaar.replace(/\s/g, '')
    if (!cleaned) {
      next.aadhaar = 'Aadhaar number is required'
    } else if (!/^\d{12}$/.test(cleaned)) {
      next.aadhaar = 'Enter a valid 12-digit Aadhaar number'
    }
    if (!dob) {
      next.dob = 'Date of birth is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const cleaned = aadhaar.replace(/\s/g, '')
    onClose()
    navigate(`/status?aadhaar=${encodeURIComponent(cleaned)}&dob=${encodeURIComponent(dob)}`)
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-application-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 id="track-application-title" className="text-lg font-bold">
                  Track Application
                </h2>
                <p className="text-sm text-primary-100">Enter your details to check status</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Aadhaar Number"
            name="aadhaar"
            type="text"
            placeholder="Enter 12-digit Aadhaar number"
            value={aadhaar}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 12)
              setAadhaar(val)
              if (errors.aadhaar) setErrors((prev) => ({ ...prev, aadhaar: '' }))
            }}
            error={errors.aadhaar}
            required
            icon={CreditCard}
            maxLength={12}
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value)
              if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }))
            }}
            error={errors.dob}
            required
            icon={Calendar}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1" icon={Search}>
              Track Status
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default TrackApplicationModal
