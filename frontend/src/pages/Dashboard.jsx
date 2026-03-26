import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearToken,
  createComplaint,
  fetchComplaints,
  getApiErrorMessage,
  getToken,
  isNetworkError,
} from '../services/api'

function normalizeComplaints(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content // common Spring pageable shape
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('LOW')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const load = useCallback(async () => {
    setLoadError('')
    setLoading(true)
    try {
      const data = await fetchComplaints()
      // eslint-disable-next-line no-console
      console.log('[Complaints loaded]', data)
      setComplaints(normalizeComplaints(data))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Complaints load failed]', err)
      if (isNetworkError(err)) {
        setLoadError('Server not running (cannot reach backend).')
      } else if (err?.response?.status === 401) {
        // Interceptor will redirect; keep UI message in case.
        setLoadError('Unauthorized. Please login again.')
      } else {
        setLoadError(getApiErrorMessage(err))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [navigate, token])

  useEffect(() => {
    load()
  }, [load])

  async function onCreate(e) {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const res = await createComplaint({
        title: title.trim(),
        description: description.trim(),
        priority,
      })
      // eslint-disable-next-line no-console
      console.log('[Complaint created]', res)
      setTitle('')
      setDescription('')
      setPriority('LOW')
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Create complaint failed]', err)
      if (isNetworkError(err)) {
        setCreateError('Server not running (cannot reach backend).')
      } else if (err?.response?.status === 401) {
        setCreateError('Unauthorized. Please login again.')
      } else {
        setCreateError(getApiErrorMessage(err))
      }
    } finally {
      setCreating(false)
    }
  }

  function onLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">View and create complaints</p>
        </div>
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="grid">
        <section className="card">
          <div className="card-header row">
            <h2 className="section-title">Create complaint</h2>
            <span className="pill">POST /api/complaints</span>
          </div>

          <form onSubmit={onCreate} className="form">
            <label className="field">
              <span className="label">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary"
                required
              />
            </label>

            <label className="field">
              <span className="label">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue…"
                rows={5}
                required
              />
            </label>

            <label className="field">
              <span className="label">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </label>

            {createError ? (
              <div className="alert alert-error">{createError}</div>
            ) : null}

            <button className="btn primary" type="submit" disabled={creating}>
              {creating ? 'Submitting…' : 'Submit complaint'}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-header row">
            <h2 className="section-title">Complaints</h2>
            <div className="row" style={{ gap: 8 }}>
              <span className="pill">GET /api/complaints</span>
              <button className="btn small" onClick={load} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>

          {loadError ? <div className="alert alert-error">{loadError}</div> : null}

          {loading ? (
            <div className="skeleton">Loading complaints…</div>
          ) : complaints.length === 0 ? (
            <div className="empty">No complaints yet.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>ID</th>
                    <th>Title</th>
                    <th style={{ width: 110 }}>Priority</th>
                    <th style={{ width: 140 }}>Status</th>
                    <th style={{ width: 200 }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c?.id ?? c?._id ?? idx}>
                      <td className="mono">{c?.id ?? c?._id ?? ''}</td>
                      <td>
                        <div className="cell-title">{c?.title ?? ''}</div>
                        {c?.description ? (
                          <div className="cell-sub">{c.description}</div>
                        ) : null}
                      </td>
                      <td>
                        <span className="badge">{c?.priority ?? ''}</span>
                      </td>
                      <td>{c?.status ?? ''}</td>
                      <td className="mono">
                        {formatDate(c?.createdAt ?? c?.created_at ?? c?.dateCreated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

