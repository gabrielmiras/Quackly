import { Link } from 'react-router-dom';
import logo from '../assets/logo-quackly.png';

/** Moldura escura central usada por Login e Cadastro. `children` entra abaixo do logo/título. */
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Link to="/">
              <img src={logo} alt="Logo Quackly" style={{ transform: 'scale(0.67)' }} />
            </Link>
          </div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="auth-body">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
