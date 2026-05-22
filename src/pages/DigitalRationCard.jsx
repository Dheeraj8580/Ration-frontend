import { useRef, useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCurrentUser } from '../hooks/useCurrentUser'
import {
  Download,
  Printer,
  User,
  QrCode,
  ArrowLeft,
  Search,
  AlertCircle,
  FileText
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import RationCardDisplay from '../components/RationCardDisplay'
import { authApi } from '../services/api'

const DigitalRationCard = () => {
  const { userId, isLoggedIn } = useAuth()
  const { user: loggedInUser, loading: authLoading } = useCurrentUser(userId)

  const [searchNumber, setSearchNumber] = useState('')
  const [cardData, setCardData] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)
  const cardRef = useRef(null)

  // Automatically load the logged-in user's card if approved
  useEffect(() => {
    if (loggedInUser) {
      const isApproved =
        loggedInUser.applicationStatus === 'Approved' ||
        (!loggedInUser.applicationStatus && !!loggedInUser.rationCardNumber)

      if (isApproved) {
        setCardData(loggedInUser)
      }
    }
  }, [loggedInUser])

  const handlePrintCard = () => {
    document.body.classList.add('printing-ration-card')
    window.print()
    const cleanup = () => {
      document.body.classList.remove('printing-ration-card')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchNumber.trim()) {
      setSearchError('Please enter a ration card number.')
      return
    }

    setSearching(true)
    setSearchError('')
    try {
      const { data } = await authApi.getRationCard(searchNumber.trim())
      if (data.success && data.user) {
        setCardData(data.user)
      } else {
        setSearchError('Failed to fetch ration card.')
      }
    } catch (err) {
      setSearchError(
        err.friendlyMessage ||
          err.response?.data?.message ||
          'No approved ration card found with this number.'
      )
    } finally {
      setSearching(false)
    }
  }

  const handleClearSearch = () => {
    setCardData(null)
    setSearchNumber('')
    setSearchError('')
  }

  if (authLoading && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden no-print z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary-100/30 blur-[120px] rounded-full" />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Link
            to={isLoggedIn ? '/dashboard' : '/'}
            className="inline-flex items-center text-slate-600 hover:text-primary-600 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {isLoggedIn ? 'Dashboard' : 'Home'}
          </Link>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-100">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Download E-Ration Card</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your unique approved Ration Card Number to instantly search, view, and print/download your digital card.
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow-xl shadow-slate-100 rounded-3xl border border-slate-200/50 sm:px-10">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-black text-slate-700 mb-2">
                  Ration Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 h-5 text-slate-400" />
                  </div>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    required
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value)}
                    placeholder="e.g. RCUP1029384756"
                    className="pl-10 block w-full border border-slate-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono font-bold uppercase tracking-wider bg-slate-50"
                  />
                </div>
              </div>

              {searchError && (
                <div className="rounded-2xl bg-danger-50 p-4 border border-danger-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-danger-700 leading-relaxed">{searchError}</p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={searching}
                  className="py-4 shadow-lg shadow-primary-200"
                >
                  {searching ? 'Searching Card...' : 'Search & View Card'}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <span className="text-xs font-semibold text-slate-500">
                Are you a new applicant?{' '}
                <Link to="/status" className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
                  Track Application Status
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 ration-card-page">
      <div className="fixed inset-0 pointer-events-none overflow-hidden no-print">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-8 no-print">
          <button
            onClick={handleClearSearch}
            className="inline-flex items-center text-slate-600 hover:text-primary-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Search Another Card
          </button>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={handlePrintCard} icon={Printer}>
              Print Card
            </Button>
            <Button variant="primary" size="md" onClick={handlePrintCard} icon={Download}>
              Download / Save PDF
            </Button>
          </div>
        </div>

        <div ref={cardRef}>
          <RationCardDisplay user={cardData} />
        </div>

        <div className="mt-12 no-print ration-card-instructions">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary-600" />
            Usage Instructions
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <InstructionCard number="01" text="Keep this digital card or its printed copy during ration collection." />
            <InstructionCard number="02" text="The QR code can be scanned by dealers for instant verification." />
            <InstructionCard number="03" text="Any changes in income or family size must be updated immediately." />
          </div>
        </div>
      </div>
    </div>
  )
}

const InstructionCard = ({ number, text }) => (
  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
    <span className="text-3xl font-black text-slate-100 block mb-2">{number}</span>
    <p className="text-xs font-bold text-slate-600 leading-relaxed">{text}</p>
  </div>
)

export default DigitalRationCard
