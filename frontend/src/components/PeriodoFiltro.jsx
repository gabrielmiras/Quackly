import { ChevronDown, CalendarDays } from 'lucide-react';

function PeriodoFiltro({
  periodoSelecionado,
  onPeriodoChange,
  dataInicio,
  onDataInicioChange,
  dataFim,
  onDataFimChange,
  onAplicar,
  erro,
  layout = 'horizontal',
}) {
  const personalizado = periodoSelecionado === 'personalizado';
  const vertical = layout === 'vertical';

  return (
    <div
      className={`
        ${vertical ? 'w-full max-w-full' : 'w-fit max-w-full'}
        rounded-2xl border border-[#e2e8f0]
        bg-white p-4 sm:p-5
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
      `}
    >
      {/* Cabeçalho */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <label
          htmlFor="periodo-financeiro"
          className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
        >
          Período de análise
        </label>

        {personalizado && (
          <span className="whitespace-nowrap text-xs font-semibold text-[#64748b]">
            Escolha o intervalo
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div
        className={`
          flex flex-col gap-3
          ${personalizado && !vertical ? 'md:flex-row md:items-end' : ''}
        `}
      >
        {/* Seletor */}
        <div
          className={`
            relative shrink-0
            ${vertical ? 'w-full' : personalizado ? 'w-full md:w-[210px]' : 'w-[230px] max-w-full'}
          `}
        >
          <select
            id="periodo-financeiro"
            value={periodoSelecionado}
            onChange={(event) => onPeriodoChange(event.target.value)}
            className="
              h-11 w-full appearance-none rounded-xl
              border border-[#dbe3ec] bg-white
              px-3 pr-10 text-sm font-semibold
              text-[#142238] outline-none
              transition-colors
              focus:border-[#2563eb]
              focus:ring-2 focus:ring-[#2563eb]/10
            "
          >
            <option value="7dias">Últimos 7 dias</option>
            <option value="mes">Este mês</option>
            <option value="ano">Este ano</option>
            <option value="personalizado">Personalizado</option>
          </select>

          <ChevronDown
            size={17}
            className="
              pointer-events-none absolute right-3 top-1/2
              -translate-y-1/2 text-[#64748b]
            "
          />
        </div>

        {/* Datas personalizadas */}
        {personalizado && (
          <>
            <div className={`flex min-w-0 flex-col gap-1 ${vertical ? 'w-full' : 'w-full md:w-[190px]'}`}>
              <label
                htmlFor="data-inicial"
                className="text-xs font-semibold text-[#475569]"
              >
                Data inicial
              </label>

              <input
                id="data-inicial"
                type="date"
                value={dataInicio}
                max={dataFim || undefined}
                onChange={(event) => onDataInicioChange(event.target.value)}
                className="
                  h-11 w-full min-w-0 rounded-xl
                  border border-[#dbe3ec] bg-white
                  px-3 text-sm text-[#142238]
                  outline-none
                  focus:border-[#2563eb]
                  focus:ring-2 focus:ring-[#2563eb]/10
                "
              />
            </div>

            <div className={`flex min-w-0 flex-col gap-1 ${vertical ? 'w-full' : 'w-full md:w-[190px]'}`}>
              <label
                htmlFor="data-final"
                className="text-xs font-semibold text-[#475569]"
              >
                Data final
              </label>

              <input
                id="data-final"
                type="date"
                value={dataFim}
                min={dataInicio || undefined}
                onChange={(event) => onDataFimChange(event.target.value)}
                className="
                  h-11 w-full min-w-0 rounded-xl
                  border border-[#dbe3ec] bg-white
                  px-3 text-sm text-[#142238]
                  outline-none
                  focus:border-[#2563eb]
                  focus:ring-2 focus:ring-[#2563eb]/10
                "
              />
            </div>

            <button
              type="button"
              onClick={onAplicar}
              className="
                flex h-11 w-full shrink-0 items-center
                justify-center gap-2 !rounded-full
                bg-[#192841] px-6
                text-sm font-semibold text-white
                transition-all duration-200
                hover:bg-[#263d60]
                hover:shadow-md
                active:scale-[0.97]
                focus:outline-none
                focus:ring-2 focus:ring-[#192841]/20
              "
            >
              <CalendarDays size={16} />
              Aplicar
            </button>
          </>
        )}
      </div>

      {erro && personalizado && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}

export default PeriodoFiltro;
