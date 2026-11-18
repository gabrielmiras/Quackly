/**
 * Par label + input padronizado (Login e Cadastro).
 * Todas as props extras (value, onChange, type, placeholder, name...) vão direto no <input>,
 * então quem usa o componente controla o campo por fora via useState.
 */
function FormInput({ id, label, required, error, ...inputProps }) {
  return (
    <div className="qk-field">
      <label htmlFor={id}>
        {label} {required && <span>*</span>}
      </label>
      <input id={id} {...inputProps} />
      {error && <span className="qk-field__error">{error}</span>}
    </div>
  );
}

export default FormInput;
