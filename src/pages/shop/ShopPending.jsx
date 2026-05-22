import { Link, Navigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

const ShopPending = () => {
  const { user, logout, isLoggedIn, isLoading, isShopOwner, isShopApproved } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!isLoggedIn || !isShopOwner()) {
    return <Navigate to="/login" replace />
  }

  if (isShopApproved()) {
    return <Navigate to="/shop" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Awaiting Admin Approval</h1>
        <p className="text-slate-600 mb-4">
          Your shop registration is pending. Status: <strong>{user?.shopOwnerStatus || 'Pending'}</strong>
        </p>
        <p className="text-sm text-slate-500 mb-6">
          An admin must approve your shop in System Management before you can distribute ration.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/login">
            <Button variant="secondary" fullWidth>Back to Login</Button>
          </Link>
          <Button variant="primary" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default ShopPending
