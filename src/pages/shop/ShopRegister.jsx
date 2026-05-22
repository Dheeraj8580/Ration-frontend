import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, ArrowLeft } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from '../../context/AuthContext'

const ShopRegister = () => {
  const navigate = useNavigate()
  const { registerShopOwner } = useAuth()
  const [form, setForm] = useState({
    ownerName: '', email: '', password: '', mobile: '',
    shopName: '', shopCode: '', address: '', district: '', state: '', pincode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await registerShopOwner(form)
    setLoading(false)
    if (result.success) navigate('/shop/pending')
    else setError(result.error)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link to="/login" className="inline-flex items-center text-sm text-slate-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Register Ration Shop</h1>
              <p className="text-sm text-slate-500">Admin approval required before distribution</p>
            </div>
          </div>
          {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} required />
            <Input label="Shop Name" name="shopName" value={form.shopName} onChange={handleChange} required />
            <Input label="Shop Code (unique)" name="shopCode" value={form.shopCode} onChange={handleChange} required />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="District" name="district" value={form.district} onChange={handleChange} />
              <Input label="State" name="state" value={form.state} onChange={handleChange} />
            </div>
            <Button type="submit" variant="primary" fullWidth loading={loading}>Submit for Approval</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShopRegister
