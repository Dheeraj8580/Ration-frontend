import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { shopApi } from '../../services/api'
import ShopSidebar from '../../components/ShopSidebar'
import Button from '../../components/Button'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Package, ScanLine, AlertTriangle } from 'lucide-react'

const ShopDashboard = () => {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [shopData, setShopData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [verifyForm, setVerifyForm] = useState({ rationCardNumber: '', aadhaarNumber: '' })
  const [verified, setVerified] = useState(null)
  const [stockForm, setStockForm] = useState({ riceKg: '', wheatKg: '', sugarKg: '', supplyNote: '' })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const showMsg = (text, type = 'info') => setMsg({ type, text })

  const loadShop = useCallback(async () => {
    const { data } = await shopApi.me()
    if (data.success) setShopData(data)
    else showMsg(data.message, 'error')
  }, [])

  const loadTransactions = useCallback(async () => {
    const { data } = await shopApi.transactions()
    if (data.success) {
      setTransactions(data.transactions)
      setSummary(data.summary)
    }
  }, [])

  const loadComplaints = useCallback(async () => {
    const { data } = await shopApi.complaints()
    if (data.success) setComplaints(data.complaints)
  }, [])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        await loadShop()
        if (tab === 'transactions') await loadTransactions()
        if (tab === 'complaints') await loadComplaints()
      } catch (e) {
        showMsg(e.friendlyMessage, 'error')
      }
      setLoading(false)
    }
    run()
  }, [tab, loadShop, loadTransactions, loadComplaints])

  const handleVerify = async () => {
    setActionLoading(true)
    try {
      const { data } = await shopApi.verify(verifyForm)
      if (data.success) {
        setVerified(data)
        showMsg(data.alreadyCollected ? 'Already collected this month.' : 'Citizen verified.', 'success')
      } else showMsg(data.message, 'error')
    } catch (e) {
      showMsg(e.friendlyMessage, 'error')
    }
    setActionLoading(false)
  }

  const handleDistribute = async () => {
    setActionLoading(true)
    try {
      const { data } = await shopApi.distribute({
        rationCardNumber: verifyForm.rationCardNumber,
        verificationMethod: 'Aadhaar',
      })
      if (data.success) {
        showMsg(`Distributed! Receipt: ${data.distribution.receiptId}`, 'success')
        setVerified(null)
        setVerifyForm({ rationCardNumber: '', aadhaarNumber: '' })
        await loadShop()
        if (tab === 'transactions') await loadTransactions()
      } else showMsg(data.message, 'error')
    } catch (e) {
      showMsg(e.friendlyMessage, 'error')
    }
    setActionLoading(false)
  }

  const handleStockUpdate = async (mode) => {
    setActionLoading(true)
    try {
      const { data } = await shopApi.updateStock({ ...stockForm, mode })
      if (data.success) {
        showMsg('Stock updated.', 'success')
        await loadShop()
      } else showMsg(data.message, 'error')
    } catch (e) {
      showMsg(e.friendlyMessage, 'error')
    }
    setActionLoading(false)
  }

  const handleComplaintReply = async (id, shopReply) => {
    if (!shopReply?.trim()) return
    const { data } = await shopApi.replyComplaint(id, shopReply)
    if (data.success) {
      showMsg('Reply sent.', 'success')
      loadComplaints()
    }
  }

  if (loading && !shopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const stock = shopData?.stock
  const msgClass =
    msg.type === 'error' ? 'bg-red-50 text-red-700' : msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-primary-50 text-primary-800'

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ShopSidebar tab={tab} setTab={setTab} user={user} onLogout={logout} />
      <main className="flex-1 pl-16 pr-6 py-8 sm:px-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Ration Shop Portal</h1>
        <p className="text-slate-500 mb-6">
          {shopData?.shop?.name || '—'} ({shopData?.shop?.shopCode || '—'})
        </p>

        {shopData?.alerts?.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm text-amber-800">Low stock — request supply from admin.</span>
          </div>
        )}

        {msg.text && <p className={`mb-4 text-sm p-3 rounded-lg ${msgClass}`}>{msg.text}</p>}

        {tab === 'overview' && stock && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Rice Stock" icon={Package}><p className="text-2xl font-bold">{stock.riceKg} kg</p></Card>
            <Card title="Wheat Stock" icon={Package}><p className="text-2xl font-bold">{stock.wheatKg} kg</p></Card>
            <Card title="Sugar Stock" icon={Package}><p className="text-2xl font-bold">{stock.sugarKg} kg</p></Card>
          </div>
        )}

        {tab === 'stock' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg space-y-4">
            <h2 className="font-semibold">Update / Add Supply</h2>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Rice kg" value={stockForm.riceKg} onChange={(e) => setStockForm({ ...stockForm, riceKg: e.target.value })} />
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Wheat kg" value={stockForm.wheatKg} onChange={(e) => setStockForm({ ...stockForm, wheatKg: e.target.value })} />
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Sugar kg" value={stockForm.sugarKg} onChange={(e) => setStockForm({ ...stockForm, sugarKg: e.target.value })} />
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Supply note" value={stockForm.supplyNote} onChange={(e) => setStockForm({ ...stockForm, supplyNote: e.target.value })} />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => handleStockUpdate('set')} loading={actionLoading} className="w-full sm:w-auto">Set Stock</Button>
              <Button variant="secondary" onClick={() => handleStockUpdate('add_supply')} loading={actionLoading} className="w-full sm:w-auto">Add Supply</Button>
            </div>
          </div>
        )}

        {tab === 'distribute' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><ScanLine className="w-5 h-5 text-emerald-600" /> Verify & Distribute</h2>
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Ration card number" value={verifyForm.rationCardNumber} onChange={(e) => setVerifyForm({ ...verifyForm, rationCardNumber: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Aadhaar (optional)" value={verifyForm.aadhaarNumber} onChange={(e) => setVerifyForm({ ...verifyForm, aadhaarNumber: e.target.value })} />
              <Button onClick={handleVerify} loading={actionLoading}>Verify Citizen</Button>
              {verified && !verified.alreadyCollected && (
                <Button variant="primary" onClick={handleDistribute} loading={actionLoading}>Issue Monthly Ration</Button>
              )}
            </div>
            {verified?.citizen && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg">{verified.citizen.name}</h3>
                <p className="text-sm text-slate-600">Card: {verified.citizen.rationCardNumber}</p>
                <p className="text-sm text-slate-600">Type: {verified.citizen.rationCardType}</p>
                {verified.quota && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm space-y-1">
                    <p className="font-medium">Monthly quota</p>
                    <p>Rice: {verified.quota.allocated.riceKg} kg</p>
                    <p>Wheat: {verified.quota.allocated.wheatKg} kg</p>
                    <p>Sugar: {verified.quota.allocated.sugarKg} kg</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {summary && (
              <p className="p-4 text-sm text-slate-600 border-b">
                Distributions: {summary.count} — Rice {summary.riceKg}kg, Wheat {summary.wheatKg}kg
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Receipt</th>
                    <th className="p-3 text-left">Citizen</th>
                    <th className="p-3">Qty (R/W/S)</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id} className="border-t">
                      <td className="p-3 font-mono text-xs">{t.receiptId}</td>
                      <td className="p-3">{t.user?.name}</td>
                      <td className="p-3">{t.riceKg}/{t.wheatKg}/{t.sugarKg}</td>
                      <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!transactions.length && <p className="p-6 text-slate-500 text-center">No distributions yet.</p>}
            </div>
          </div>
        )}

        {tab === 'complaints' && (
          <div className="space-y-4 max-w-2xl">
            {complaints.map((c) => (
              <ComplaintReplyCard key={c._id} complaint={c} onReply={handleComplaintReply} />
            ))}
            {!complaints.length && <p className="text-slate-500">No complaints for your shop.</p>}
          </div>
        )}
      </main>
    </div>
  )
}

const ComplaintReplyCard = ({ complaint: c, onReply }) => {
  const [reply, setReply] = useState('')
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <p className="font-semibold">{c.subject}</p>
      <p className="text-sm text-slate-600 mt-1">{c.message}</p>
      <p className="text-xs text-slate-400 mt-2">From: {c.user?.name} — {c.status}</p>
      {c.shopReply && <p className="text-sm text-emerald-700 mt-2">Your reply: {c.shopReply}</p>}
      {!c.shopReply && (
        <div className="mt-3 flex gap-2">
          <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Your clarification..." value={reply} onChange={(e) => setReply(e.target.value)} />
          <Button size="sm" onClick={() => onReply(c._id, reply)}>Reply</Button>
        </div>
      )}
    </div>
  )
}

export default ShopDashboard
