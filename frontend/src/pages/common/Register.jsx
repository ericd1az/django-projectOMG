import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Icon } from 'semantic-ui-react'
import * as Yup from 'yup'
import { registerApi } from '../../api/user'

const schema = Yup.object({
  username: Yup.string().matches(/^\S+$/, 'No uses espacios.').required('El nombre de usuario es obligatorio.'),
  first_name: Yup.string().max(150, 'Máximo 150 caracteres.'),
  email: Yup.string().email('Escribe un correo válido.').required('El correo es obligatorio.'),
  telefono: Yup.string().max(20, 'Máximo 20 caracteres.'),
  password: Yup.string().min(8, 'Usa al menos 8 caracteres.').required('La contraseña es obligatoria.'),
  password_confirm: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.').required('Confirma tu contraseña.'),
})

export function Register() {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: { username: '', first_name: '', email: '', telefono: '', password: '', password_confirm: '' },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      try {
        await registerApi(values)
        toast.success('Tu cuenta está lista. Ya puedes iniciar sesión.')
        navigate('/login')
      } catch (error) {
        toast.error(error.message)
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  const fieldError = (name) => formik.touched[name] && formik.errors[name] ? { content: formik.errors[name], pointing: 'below' } : null

  return (
    <main className="auth-card auth-card--register">
      <span className="auth-card__eyebrow"><Icon name="user plus" /> ÚNETE A NOVA</span>
      <h1>Crea tu cuenta.</h1>
      <p>Unos datos y tendrás tu propio espacio en la tienda.</p>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <div className="form-row">
          <Form.Input label="Usuario" name="username" placeholder="usuario_nova" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('username')} />
          <Form.Input label="Nombre" name="first_name" placeholder="Tu nombre" value={formik.values.first_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('first_name')} />
        </div>
        <Form.Input label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('email')} />
        <Form.Input label="Teléfono (opcional)" name="telefono" type="tel" placeholder="Tu número de contacto" value={formik.values.telefono} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('telefono')} />
        <div className="form-row">
          <Form.Input label="Contraseña" name="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('password')} />
          <Form.Input label="Confirmar" name="password_confirm" type="password" autoComplete="new-password" placeholder="Repite la contraseña" value={formik.values.password_confirm} onChange={formik.handleChange} onBlur={formik.handleBlur} error={fieldError('password_confirm')} />
        </div>
        <Button className="auth-submit" type="submit" fluid loading={formik.isSubmitting} disabled={formik.isSubmitting}>Crear mi cuenta <Icon name="arrow right" /></Button>
      </Form>
      <div className="auth-card__switch">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></div>
    </main>
  )
}
