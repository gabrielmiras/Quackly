import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

const API_URL = (import.meta.env.VITE_API_URL || 'https://quackly-production.up.railway.app').replace(/\/$/, '');

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Informe seu nome completo.';
    if (!form.email.trim()) nextErrors.email = 'Informe seu e-mail.';
    if (!form.password.trim()) nextErrors.password = 'Crie uma senha.';
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'As senhas não coincidem.';
    }
    {/* AINDA NAO TEMOS TERMOS
      if (!form.acceptedTerms) nextErrors.acceptedTerms = 'É preciso aceitar os termos para continuar.';*/}
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: form.name, email: form.email, senha: form.password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((criado) => {
        console.log('Cadastro realizado:', criado);
        navigate('/login');
      })
      .catch(() => {
        setErrors({ email: 'Erro ao cadastrar. Tente novamente.' });
      });
  };

  return (
    <AuthLayout title="Quackly" subtitle="Crie sua conta">
      <Button variant="social" icon="bi-google" onClick={() => console.log('Cadastro com Google')}>
        Cadastrar com Google
      </Button>

      <div className="auth-divider">ou</div>

      <form className="auth-form auth-form--tight" onSubmit={handleSubmit} noValidate>
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Nome completo"
          required
          placeholder="Como podemos te chamar?"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="E-mail"
          required
          placeholder="seu@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Senha"
          required
          placeholder="Crie uma senha forte"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <FormInput
          id="confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirmar senha"
          required
          placeholder="Repita a senha"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        {/* AINDA NAO TEMOS POLITICA DE PRIVACIDADE NEM TERMOS DE USO */}
        {/*<div className="auth-terms">
          <input
            type="checkbox"
            id="terms"
            name="acceptedTerms"
            checked={form.acceptedTerms}
            onChange={handleChange}
          />
          <label htmlFor="terms">
            Eu li e aceito os <a href="#" onClick={(event) => event.preventDefault()}>Termos de Uso</a> e a{' '}
            <a href="#" onClick={(event) => event.preventDefault()}>Política de Privacidade</a>.
          </label>
        </div>
        {errors.acceptedTerms && <span className="auth-error">{errors.acceptedTerms}</span>}*/}

        <Button variant="submit" type="submit" className="auth-submit-spaced">
          Criar minha conta
        </Button>
      </form>

      <div className="auth-footer auth-footer--tight">
        Já possui uma conta?{' '}
        <Link to="/login" className="auth-link">
          Faça o login!
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Cadastro;
