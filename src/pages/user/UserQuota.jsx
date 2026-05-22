import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Sidebar from '../../components/Sidebar'
import Button from '../../components/Button'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { userPortalApi } from '../../services/api'

const UserQuota = () => {
  const { userId } = useAuth()
  const [data, setData] = useState(null)
  const [otpData, setOtpData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    userPortalApi
      .quota()
      .then((r) => {
        if (r.data.success) setData(r.data)
        else setError(r.data.message || 'Could not load quota.')
      })
      .catch((e) => setError(e.friendlyMessage || 'Could not load quota.'))
      .finally(() => setLoading(false))
  }, [userId])

  const generateOtp = async () => {
    try {
      const { data: res } = await userPortalApi.generateOtp()
      if (res.success) setOtpData(res)
      else setError(res.message)
    } catch (e) {
      setError(e.friendlyMessage || 'OTP generation failed.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="user" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Monthly Quota & Collection</h1>
        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        {data?.quota && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-slate-500">Month: {data.month}</p>
              <p className="text-lg font-bold text-primary-600">{data.quota.schemaLabel}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Rice: <strong>{data.quota.allocated.riceKg} kg</strong></li>
                <li>Wheat: <strong>{data.quota.allocated.wheatKg} kg</strong></li>
                <li>Sugar: <strong>{data.quota.allocated.sugarKg} kg</strong></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold mb-2">Collection Status</h2>
              {data.collected ? (
                <p className="text-success-600 font-medium">✓ Ration collected this month</p>
              ) : (
                <p className="text-amber-600 font-medium">Not collected yet</p>
              )}
              {data.collection && (
                <p className="text-sm text-slate-600 mt-2">Shop: {data.collection.shop?.name}</p>
              )}
            </div>
          </div>
        )}

        {!data?.collected && data?.quota && (
          <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md">
            <h2 className="font-semibold mb-4">Shop Verification OTP</h2>
            <p className="text-sm text-slate-600 mb-4">Generate OTP and show at your ration shop.</p>
            <Button onClick={generateOtp}>Generate OTP</Button>
            {otpData && (
              <div className="mt-6 text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-3xl font-black tracking-widest text-primary-600">{otpData.otp}</p>
                <p className="text-xs text-slate-500 mt-2">Valid until {new Date(otpData.expiresAt).toLocaleTimeString()}</p>
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG value={otpData.qrPayload} size={140} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default UserQuota
