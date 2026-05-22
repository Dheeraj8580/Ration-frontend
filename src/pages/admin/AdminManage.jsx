import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import Button from '../../components/Button'

const AdminManage = () => {
  const [section, setSection] = useState('schema')
  const [schemas, setSchemas] = useState([])
  const [shopOwners, setShopOwners] = useState([])
  const [shops, setShops] = useState([])
  const [duplicates, setDuplicates] = useState(null)
  const [report, setReport] = useState(null)
  const [complaints, setComplaints] = useState([])

  const load = async () => {
    if (section === 'schema') {
      const { data } = await adminApi.schemaList()
      if (data.success) setSchemas(data.schemas)
    }
    if (section === 'shops') {
      const [o, s] = await Promise.all([adminApi.shopOwners(), adminApi.shops()])
      if (o.data.success) setShopOwners(o.data.shopOwners)
      if (s.data.success) setShops(s.data.shops)
    }
    if (section === 'duplicates') {
      const { data } = await adminApi.duplicates()
      if (data.success) setDuplicates(data)
    }
    if (section === 'reports') {
      const { data } = await adminApi.distributionReport()
      if (data.success) setReport(data)
    }
    if (section === 'complaints') {
      const { data } = await adminApi.complaints()
      if (data.success) setComplaints(data.complaints)
    }
  }

  useEffect(() => { load() }, [section])

  const saveSchema = async (cardType, body) => {
    await adminApi.schemaUpdate(cardType, body)
    load()
  }

  const approveShop = async (id) => {
    await adminApi.approveShopOwner(id)
    load()
  }

  const rejectShop = async (id) => {
    const reason = window.prompt('Rejection reason?')
    if (!reason) return
    await adminApi.rejectShopOwner(id, { rejectionReason: reason })
    load()
  }

  const tabs = [
    { id: 'schema', label: 'Quota Schema' },
    { id: 'shops', label: 'Shops' },
    { id: 'duplicates', label: 'Duplicates' },
    { id: 'reports', label: 'Reports' },
    { id: 'complaints', label: 'Complaints' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userType="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">System Management</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setSection(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${section === t.id ? 'bg-primary-600 text-white' : 'bg-white text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {section === 'schema' && (
          <div className="space-y-6">
            {schemas.map((s) => (
              <SchemaEditor key={s.cardType} schema={s} onSave={saveSchema} />
            ))}
          </div>
        )}

        {section === 'shops' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-semibold mb-4">Pending shop owners</h2>
              {shopOwners.filter((o) => o.shopOwnerStatus === 'Pending').map((o) => (
                <div key={o.id || o._id} className="bg-white p-4 rounded-xl mb-2 flex justify-between items-center">
                  <span>{o.name} — {o.email}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveShop(o.id || o._id)}>Approve</Button>
                    <Button size="sm" variant="secondary" onClick={() => rejectShop(o.id || o._id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-semibold mb-4">All shops & stock</h2>
              {shops.map((sh) => (
                <div key={sh._id} className="bg-white p-4 rounded-xl mb-2 text-sm">
                  <p className="font-medium">{sh.name} ({sh.shopCode}) — {sh.status}</p>
                  {sh.stock && (
                    <p className="text-slate-600">Stock: Rice {sh.stock.riceKg}kg, Wheat {sh.stock.wheatKg}kg, Sugar {sh.stock.sugarKg}kg
                      {sh.lowStock && <span className="text-amber-600 ml-2">Low stock</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'duplicates' && duplicates && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Suspicious groups: {duplicates.suspiciousCount}</p>
            {duplicates.duplicateAadhaar.map((d) => (
              <div key={d.aadhaar} className="bg-red-50 p-4 rounded-xl">
                <p className="font-medium">Duplicate Aadhaar: {d.aadhaar}</p>
                {d.entries.map((e) => <p key={e.id} className="text-sm">{e.name} — {e.email}</p>)}
              </div>
            ))}
          </div>
        )}

        {section === 'reports' && report && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="font-semibold">Month: {report.month} — Total: {report.totalDistributions}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {Object.entries(report.byDistrict || {}).map(([dist, v]) => (
                <li key={dist}>{dist}: {v.count} distributions, {v.riceKg}kg rice</li>
              ))}
            </ul>
          </div>
        )}

        {section === 'complaints' && (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-xl">
                <p className="font-medium">{c.subject}</p>
                <p className="text-sm">{c.message}</p>
                <p className="text-xs text-slate-400">{c.user?.name} — {c.status}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const SchemaEditor = ({ schema, onSave }) => {
  const [form, setForm] = useState({
    riceKgPerMember: schema.riceKgPerMember,
    wheatKgPerMember: schema.wheatKgPerMember,
    sugarKgPerMember: schema.sugarKgPerMember,
  })

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="font-bold text-lg">{schema.label}</h3>
      <p className="text-sm text-slate-500 mb-4">{schema.cardType}</p>
      <div className="grid grid-cols-3 gap-4">
        {['riceKgPerMember', 'wheatKgPerMember', 'sugarKgPerMember'].map((k) => (
          <div key={k}>
            <label className="text-xs text-slate-500">{k}</label>
            <input className="w-full border rounded-lg px-2 py-1" type="number" value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} />
          </div>
        ))}
      </div>
      <Button className="mt-4" size="sm" onClick={() => onSave(schema.cardType, form)}>Save Schema</Button>
    </div>
  )
}

export default AdminManage
