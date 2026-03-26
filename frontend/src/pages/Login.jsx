import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, getToken, isNetworkError, login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const alreadyAuthed = useMemo(() => Boolean(getToken()), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (alreadyAuthed) navigate('/dashboard', { replace: true })
  }, [alreadyAuthed, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const token = await login({ email: email.trim(), password })
      // eslint-disable-next-line no-console
      console.log('[Login success] token:', token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Login failed]', err)
      if (isNetworkError(err)) {
        setError('Server not running (cannot reach backend).')
      } else {
        const status = err?.response?.status
        if (status === 500 || status === 400 || status === 401) {
          setError('Invalid credentials.')
        } else {
          setError(getApiErrorMessage(err))
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <div className="card-header">
          <h1 className="title">Smart Complaint System</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>

          <div className="hint-row">
            <span className="subtitle" style={{ margin: 0 }}>
              No account yet?
            </span>
            <Link className="link" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>

      <p className="footer-hint">
        Backend: <code>http://localhost:8081</code>
      </p>
    </div>
  )
}

