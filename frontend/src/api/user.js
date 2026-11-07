const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://127.0.0.1:8000'

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const firstError = Object.values(data).find((value) => Array.isArray(value) || typeof value === 'string')
    const detail = Array.isArray(firstError) ? firstError[0] : firstError
    const error = new Error(typeof detail === 'string' ? detail : `Error HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return data
}

export function loginApi(credentials) {
  return request('/api/v1/auth/token/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function registerApi(values) {
  return request('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function getMeApi(token) {
  return request('/api/v1/auth/me/', { token })
}

export function getProductsApi(token) {
  return request('/api/products/', { token })
}

export function getCapitalApi(token, code) {
  return request(`/api/v1/services/capital/?codigo=${encodeURIComponent(code)}`, { token })
}
