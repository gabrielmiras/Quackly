
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://quackly-production.up.railway.app'
).replace(/\/$/, '');

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Informe sua senha.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        senha: form.password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Credenciais inválidas');
        }

        return res.json();
      })
      .then((usuarioLogado) => {
        console.log('Login efetuado com sucesso:', usuarioLogado);

        localStorage.setItem(
          'usuarioLogado',
          JSON.stringify(usuarioLogado)
        );

        navigate('/gestao#gerenciamento');
      })
      .catch(() => {
        setErrors({
          password: 'E-mail ou senha incorretos.',
        });
      });
  };

  return (
    <AuthLayout
      title="Quackly"
      subtitle="Acesse sua conta"
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormInput
          id="login-email"
          name="email"
          type="email"
          label="E-mail"
          required
          placeholder="Adicionar seu e-mail"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          id="login-password"
          name="password"
          type="password"
          label="Senha"
          required
          placeholder="Adicionar sua senha"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Ainda não temos backend para recuperação de senha */}

        <div className="auth-actions">
          <Button variant="submit" type="submit">
            Entrar
          </Button>
        </div>
      </form>

      <div className="auth-footer">
        Ainda não possui uma conta?{' '}
        <Link to="/cadastro" className="auth-link">
          Faça o cadastro!
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
