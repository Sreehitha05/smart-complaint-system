import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, getToken, isNetworkError, registerUser } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const alreadyAuthed = useMemo(() => Boolean(getToken()), [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (alreadyAuthed) navigate('/dashboard', { replace: true })
  }, [alreadyAuthed, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      // eslint-disable-next-line no-console
      console.log('[Register success]', res)
      setSuccess('Account created. Please login.')
      navigate('/login', { replace: true })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Register failed]', err)
      if (isNetworkError(err)) {
        setError('Server not running (cannot reach backend).')
      } else {
        setError(getApiErrorMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <div className="card-header">
          <h1 className="title">Create account</h1>
          <p className="subtitle">Register a new USER account</p>
        </div>

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Choose a password"
              required
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}
          {success ? <div className="alert">{success}</div> : null}

          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Register'}
          </button>

          <div className="hint-row">
            <span className="subtitle" style={{ margin: 0 }}>
              Already have an account?
            </span>
            <Link className="link" to="/login">
              Login
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

