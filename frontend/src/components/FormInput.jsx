
function FormInput({
  id,
  label,
  required,
  error,
  variant = 'dark',
  ...inputProps
}) {
  const light = variant === 'light';

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={`
          text-sm font-semibold
          ${light ? 'text-[#1e293b]' : 'text-[#b6c4d8]'}
        `}
      >
        {label}{' '}
        {required && (
          <span className="text-[#d79a16]">*</span>
        )}
      </label>

      <input
        {...inputProps}
        id={id}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: light ? '#ffffff' : '#0d1624',
          border: `1px solid ${light ? '#cbd5e1' : '#475569'}`,
          borderRadius: '12px',
          color: light ? '#1e293b' : '#ffffff',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = light
            ? '#4775bd'
            : '#FFCB61';

          event.currentTarget.style.boxShadow = light
            ? '0 0 0 3px rgba(71,117,189,0.12)'
            : '0 0 0 3px rgba(255,203,97,0.12)';

          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = light
            ? '#cbd5e1'
            : '#475569';

          event.currentTarget.style.boxShadow = 'none';

          inputProps.onBlur?.(event);
        }}
      />

      {error && (
        <span className="text-xs font-medium text-[#dc2626]">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormInput;
