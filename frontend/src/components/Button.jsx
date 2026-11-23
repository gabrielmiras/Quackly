
import { Link } from 'react-router-dom';

const BUTTON_STYLES = {
  primary: `
    rounded-[50px] border-0
    bg-white px-[30px] py-[13px]
    font-semibold text-black font-sans
    hover:scale-105
  `,

  pill: `
    rounded-[50px] border-0
    bg-white px-8 py-3
    font-semibold text-black
    hover:scale-105
  `,

  outline: `
    w-full rounded-xl
    border-2 border-[#EBECF0]
    bg-transparent p-4
    text-center text-base font-semibold
    text-[#f1f5f9]
    hover:border-[#FFCB61]
    hover:text-[#FFCB61]
  `,

  nav: `
    rounded-[50px] border-0
    bg-white px-6 py-2
    text-black hover:scale-110
  `,

  social: `
    flex w-full items-center justify-center gap-3
    !rounded-xl !border !border-[#475569]
    bg-transparent p-[14px]
    text-[0.95rem] font-semibold text-[#e2e8f0]
    transition-[background-color,border-color] duration-200
    hover:!border-[#64748b]
    hover:bg-white/[0.04]
  `,

  submit: `
    block w-full appearance-none
    !rounded-xl !border !border-[#d6a900]
    bg-[#eab308] p-[14px]
    text-center text-base font-bold text-black
    transition-all duration-200
    hover:brightness-90
  `,

  action: `
    whitespace-nowrap rounded-lg border-0
    bg-[#0d6efd] px-4 py-2
    font-medium text-white
    hover:bg-[#0b5ed7]
  `,
};

function Button({
  variant = 'primary',
  to,
  icon,
  type = 'button',
  onClick,
  className = '',
  children,
}) {
  const classes = `
    inline-block cursor-pointer
    !no-underline hover:!no-underline
    transition-all duration-300 ease-in-out
    ${BUTTON_STYLES[variant] ?? BUTTON_STYLES.primary}
    ${className}
  `.trim();

  const content = (
    <>
      {icon && <i className={`bi ${icon} mr-2`} />}
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
    <button
      type={type}
      className={classes}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;
