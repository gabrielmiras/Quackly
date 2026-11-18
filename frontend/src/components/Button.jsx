import { Link } from 'react-router-dom';

/**
 * Botão/link único do site.
 *
 * variant: 'primary' | 'pill' | 'outline' | 'nav' | 'social' | 'submit' | 'action'
 * to:      se informado, renderiza um <Link> do React Router; senão, um <button>.
 * icon:    classe do Bootstrap Icons (ex.: "bi-google"), usado na variant 'social'.
 */
function Button({ variant = 'primary', to, icon, type = 'button', onClick, className = '', children }) {
  const classes = `qk-btn qk-btn--${variant} ${className}`.trim();

  const content = (
    <>
      {icon && <i className={`bi ${icon}`}></i>}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}

export default Button;
