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
    <div className="flex flex-col gap-[6px]">
      <label
        htmlFor={id}
        className={`
          text-[0.85rem] font-semibold
          ${light ? 'text-[#334155]' : 'text-[#b6c4d8]'}
        `}
      >
        {label}{' '}
        {required && (
          <span className="text-[#eab308]">*</span>
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
          borderRadius: '10px',
          color: light ? '#1e293b' : '#ffffff',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = '#d79a16';
          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = light
            ? '#cbd5e1'
            : '#475569';

          inputProps.onBlur?.(event);
        }}
      />

      {error && (
        <span className="text-[0.78rem] text-[#f87171]">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormInput;
