import { useState, useEffect } from 'react'
import { userPortalApi } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import Button from '../../components/Button'
import Input from '../../components/Input'

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [shops, setShops] = useState([])
  const [form, setForm] = useState({ category: 'not_received', subject: '', message: '', shopId: '' })

  const load = () => {
    userPortalApi.complaints().then((r) => r.data.success && setComplaints(r.data.complaints))
    userPortalApi.shops().then((r) => r.data.success && setShops(r.data.shops))
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await userPortalApi.createComplaint(form)
    if (data.success) {
      setForm({ category: 'not_received', subject: '', message: '', shopId: '' })
      load()
    } else alert(data.message)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="user" />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Complaints & Feedback</h1>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mb-8">
          <label className="block text-sm font-medium">Category</label>
          <select className="w-full border rounded-lg px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="not_received">Ration not received</option>
            <option value="quality">Quality issue</option>
            <option value="quantity">Quantity issue</option>
            <option value="shop_behavior">Shop behavior</option>
            <option value="other">Other</option>
          </select>
          <label className="block text-sm font-medium">Shop (optional)</label>
          <select className="w-full border rounded-lg px-3 py-2" value={form.shopId} onChange={(e) => setForm({ ...form, shopId: e.target.value })}>
            <option value="">Select shop</option>
            {shops.map((s) => <option key={s._id} value={s._id}>{s.name} — {s.shopCode}</option>)}
          </select>
          <Input label="Subject" name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Describe your issue" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <Button type="submit" variant="primary">Submit Complaint</Button>
        </form>
        <h2 className="font-semibold mb-4">Your complaints</h2>
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white p-4 rounded-xl border">
              <p className="font-medium">{c.subject}</p>
              <p className="text-sm text-slate-600">{c.message}</p>
              <p className="text-xs text-slate-400 mt-2">Status: {c.status}</p>
              {c.shopReply && <p className="text-sm text-emerald-700 mt-2">Shop: {c.shopReply}</p>}
              {c.adminReply && <p className="text-sm text-primary-700 mt-1">Admin: {c.adminReply}</p>}
            </div>
          ))}
          {!complaints.length && <p className="text-slate-500 text-sm">No complaints yet.</p>}
        </div>
      </main>
    </div>
  )
}

export default UserComplaints
