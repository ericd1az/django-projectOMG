import { useFormik } from 'formik'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Icon } from 'semantic-ui-react'
import * as Yup from 'yup'
import { loginApi } from '../../api/user'
import { useAuth } from '../../hooks/useAuth'

const schema = Yup.object({
  email: Yup.string().email('Escribe un correo válido.').required('El correo es obligatorio.'),
  password: Yup.string().required('La contraseña es obligatoria.'),
})

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/dashboard'

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      try {
        const { access, refresh } = await loginApi(values)
        console.info('Token JWT obtenido', { access: `${access.slice(0, 18)}…`, refresh: Boolean(refresh) })
        await login(access)
        toast.success('Bienvenido a NOVA')
        navigate(destination, { replace: true })
      } catch (error) {
        toast.error(error.status === 401 ? 'Correo o contraseña incorrectos.' : error.message)
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  return (
    <main className="auth-card">
      <span className="auth-card__eyebrow"><Icon name="lock" /> ACCESO A TU CUENTA</span>
      <h1>Qué gusto verte de nuevo.</h1>
      <p>Inicia sesión para entrar a tu espacio en NOVA.</p>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Form.Input
          label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com"
          autoComplete="email" value={formik.values.email} onChange={formik.handleChange}
          onBlur={formik.handleBlur} error={formik.touched.email && formik.errors.email ? { content: formik.errors.email, pointing: 'below' } : null}
        />
        <Form.Input
          label="Contraseña" name="password" type="password" placeholder="Tu contraseña"
          autoComplete="current-password" value={formik.values.password} onChange={formik.handleChange}
          onBlur={formik.handleBlur} error={formik.touched.password && formik.errors.password ? { content: formik.errors.password, pointing: 'below' } : null}
        />
        <Button className="auth-submit" type="submit" fluid loading={formik.isSubmitting} disabled={formik.isSubmitting}>Entrar a mi espacio <Icon name="arrow right" /></Button>
      </Form>
      <div className="auth-card__switch">¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí</Link></div>
    </main>
  )
}
