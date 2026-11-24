import { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Settings2,
  X,
} from 'lucide-react';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import historicoService from '../services/historicoService.js';
import PeriodoFiltro from '../components/PeriodoFiltro.jsx';
import Historico from './Historico.jsx';

const CORES_DESPESAS = [
  '#2563eb',
  '#f59e0b',
  '#7c3aed',
  '#ea580c',
  '#0284c7',
  '#4f46e5',
  '#d97706',
  '#475569',
  '#6366f1',
];

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

/*
 * Interpreta datas sem fuso horário como datas locais.
 * Isso evita que uma movimentação registrada à meia-noite
 * seja deslocada para o dia anterior ou seguinte.
 */
function obterData(item) {
  if (!item.dataHora) return null;

  const valor = String(item.dataHora).trim();

  const partes = valor.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (partes) {
    const [, ano, mes, dia, hora = '0', minuto = '0', segundo = '0'] = partes;

    const data = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minuto),
      Number(segundo)
    );

    return Number.isNaN(data.getTime()) ? null : data;
  }

  const data = new Date(valor);

  return Number.isNaN(data.getTime()) ? null : data;
}

function gerarConicGradient(items) {
  const total = items.reduce(
    (acc, item) => acc + item.valorNum,
    0
  );

  if (total <= 0) return '#e2e8f0';

  let acumulado = 0;

  const stops = items.map((item) => {
    const porcentagem = (item.valorNum / total) * 100;
    const inicio = acumulado;
    const fim = acumulado + porcentagem;

    acumulado = fim;

    return `${item.color} ${inicio.toFixed(2)}% ${fim.toFixed(2)}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

/* Cartão de gráfico de rosca */
function DonutChartCard({
  items,
  centerLabel,
  centerValue,
  centerColor,
  emptyMessage,
}) {
  const temDados = items && items.length > 0;

  const gradient = temDados
    ? gerarConicGradient(items)
    : '#e2e8f0';

  return (
    <div className="
      relative flex h-auto min-w-0 flex-col
      rounded-2xl border border-[#dbe3ec]
      bg-white p-6
      shadow-[0_6px_22px_rgba(20,34,56,0.07)]
      sm:p-7
    ">
      {temDados ? (
        <div className="
          flex flex-1 flex-col items-center
          justify-center gap-7
          sm:flex-row sm:justify-around
          2xl:flex-row
        ">
          <div className="flex shrink-0 items-center justify-center">
            <div
              className="
                flex h-[180px] w-[180px]
                items-center justify-center
                rounded-full
                shadow-[0_5px_16px_rgba(15,23,42,0.10)]
              "
              style={{ background: gradient }}
            >
              <div className="
                flex h-[118px] w-[118px]
                flex-col items-center justify-center
                rounded-full bg-white shadow-inner
              ">
                <span className="
                  text-xs font-bold uppercase
                  tracking-wider text-[#475569]
                ">
                  {centerLabel}
                </span>

                <strong
                  className="mt-1 text-base font-bold"
                  style={{ color: centerColor || '#1e293b' }}
                >
                  {centerValue}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.label}
                className="
                  flex min-w-0 items-center
                  justify-between gap-3
                  border-b border-[#f1f5f9]
                  pb-3 last:border-0 last:pb-0
                "
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="
                    min-w-0 truncate
                    text-sm font-semibold text-[#334155]
                  ">
                    {item.label}
                  </span>
                </div>

                <strong className="shrink-0 text-sm font-bold text-[#142238]">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="
          flex min-h-[250px] flex-col
          items-center justify-center gap-3
          text-center
        ">
          <div className="
            flex h-14 w-14 items-center
            justify-center rounded-full
            bg-[#f1f5f9] text-[#94a3b8]
          ">
            <Wallet size={25} />
          </div>

          <p className="max-w-[260px] text-sm text-[#64748b]">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}

/* Cartão de indicador financeiro */
function IndicadorCard({ label, valor, tipo, descricao }) {
  const configuracoes = {
    entrada: {
      Icon: ArrowUpRight,
      cor: '#059669',
      fundo: '#ecfdf5',
    },
    saida: {
      Icon: ArrowDownRight,
      cor: '#e11d48',
      fundo: '#fff1f2',
    },
    saldo: {
      Icon: PiggyBank,
      cor: valor < 0 ? '#e11d48' : '#059669',
      fundo: valor < 0 ? '#fff1f2' : '#ecfdf5',
    },
  };

  const config = configuracoes[tipo];
  const Icon = config.Icon;

  return (
    <div className="
      flex min-w-0 flex-col gap-4
      rounded-2xl border border-[#e2e8f0]
      bg-white p-5
      shadow-[0_1px_3px_rgba(0,0,0,0.05)]
      transition-shadow hover:shadow-md
      sm:p-6
    ">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#64748b]">
          {label}
        </span>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: config.fundo, color: config.cor }}
        >
          <Icon size={21} strokeWidth={2.2} />
        </div>
      </div>

      <div>
        <strong
          className="block break-words text-2xl font-bold"
          style={{ color: config.cor }}
        >
          {formatarMoeda(valor)}
        </strong>

        <span className="mt-1 block text-xs text-[#94a3b8]">
          {descricao}
        </span>
      </div>
    </div>
  );
}

function Gestao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false);

  // Filtro de período
  const hoje = new Date();

  const primeiroDiaMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

  const [periodoAplicado, setPeriodoAplicado] = useState({
    tipo: 'mes',
  });

  const [dataInicio, setDataInicio] = useState(
    formatarDataInput(primeiroDiaMes)
  );

  const [dataFim, setDataFim] = useState(
    formatarDataInput(hoje)
  );

  const [erroPeriodo, setErroPeriodo] = useState('');

  useEffect(() => {
    let ativo = true;

    historicoService
      .listar()
      .then((dados) => {
        if (ativo) {
          setMovimentacoes(dados || []);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar movimentações:', err);
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  function selecionarPeriodo(tipo) {
    setPeriodoSelecionado(tipo);
    setErroPeriodo('');

    if (tipo !== 'personalizado') {
      setPeriodoAplicado({ tipo });
    }
  }

  function aplicarPeriodoPersonalizado() {
    if (!dataInicio || !dataFim) {
      setErroPeriodo('Selecione as duas datas.');
      return false;
    }

    if (dataInicio > dataFim) {
      setErroPeriodo('A data inicial não pode ser posterior à data final.');
      return false;
    }

    setErroPeriodo('');

    setPeriodoAplicado({
      tipo: 'personalizado',
      inicio: dataInicio,
      fim: dataFim,
    });

    return true;
  }

  function alterarPeriodo(tipo) {
    selecionarPeriodo(tipo);

    if (tipo !== 'personalizado') {
      setConfiguracoesAbertas(false);
    }
  }

  function aplicarPeriodoEFechar() {
    const aplicado = aplicarPeriodoPersonalizado();

    if (aplicado) {
      setConfiguracoesAbertas(false);
    }
  }

  // Calcula o intervalo selecionado.
  const intervalo = useMemo(() => {
    const agora = new Date();

    const inicioHoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    // Limite exclusivo: inclui todo o dia atual.
    const fimExclusivo = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate() + 1
    );

    switch (periodoAplicado.tipo) {
      case '7dias': {
        const inicio = new Date(inicioHoje);
        inicio.setDate(inicio.getDate() - 6);

        return {
          inicio,
          fim: fimExclusivo,
          descricao: 'Últimos 7 dias',
        };
      }

      case 'ano':
        return {
          inicio: new Date(agora.getFullYear(), 0, 1),
          fim: fimExclusivo,
          descricao: 'Este ano',
        };

      case 'personalizado': {
        const [anoInicio, mesInicio, diaInicio] =
          periodoAplicado.inicio.split('-').map(Number);

        const [anoFim, mesFim, diaFim] =
          periodoAplicado.fim.split('-').map(Number);

        return {
          inicio: new Date(
            anoInicio,
            mesInicio - 1,
            diaInicio
          ),
          fim: new Date(
            anoFim,
            mesFim - 1,
            diaFim + 1
          ),
          descricao: `${periodoAplicado.inicio.split('-').reverse().join('/')} a ${periodoAplicado.fim.split('-').reverse().join('/')}`,
        };
      }

      case 'mes':
      default:
        return {
          inicio: new Date(
            agora.getFullYear(),
            agora.getMonth(),
            1
          ),
          fim: fimExclusivo,
          descricao: 'Este mês',
        };
    }
  }, [periodoAplicado]);

  // Todas as informações da tela usam o mesmo intervalo.
  const movimentacoesFiltradas = useMemo(() => {
    return movimentacoes.filter((item) => {
      const data = obterData(item);

      return (
        data &&
        data >= intervalo.inicio &&
        data < intervalo.fim
      );
    });
  }, [movimentacoes, intervalo]);

  // Entradas, saídas e saldo do período.
  const balanco = useMemo(() => {
    const totalEntradas = movimentacoesFiltradas
      .filter((item) => item.tipo === 'ENTRADA')
      .reduce(
        (acc, item) => acc + (Number(item.valor) || 0),
        0
      );

    const totalSaidas = movimentacoesFiltradas
      .filter((item) => item.tipo === 'SAIDA')
      .reduce(
        (acc, item) => acc + (Number(item.valor) || 0),
        0
      );

    const saldo = totalEntradas - totalSaidas;

    const itens = [];

    if (totalEntradas > 0) {
      itens.push({
        label: 'Entradas',
        valorNum: totalEntradas,
        value: formatarMoeda(totalEntradas),
        color: '#10b981',
      });
    }

    if (totalSaidas > 0) {
      itens.push({
        label: 'Saídas',
        valorNum: totalSaidas,
        value: formatarMoeda(totalSaidas),
        color: '#ef4444',
      });
    }

    return {
      itens,
      totalEntradas,
      totalSaidas,
      saldo,
    };
  }, [movimentacoesFiltradas]);

  // Despesas agrupadas por descrição.
  const ondeGastei = useMemo(() => {
    const saidas = movimentacoesFiltradas.filter(
      (item) => item.tipo === 'SAIDA'
    );

    const totalSaidas = saidas.reduce(
      (acc, item) => acc + (Number(item.valor) || 0),
      0
    );

    const mapaSaidas = {};

    saidas.forEach((item) => {
      const nome = item.nome?.trim() || 'Outras despesas';

      mapaSaidas[nome] =
        (mapaSaidas[nome] || 0) + (Number(item.valor) || 0);
    });

    const itens = Object.entries(mapaSaidas)
      .map(([label, valor], index) => ({
        label,
        valorNum: valor,
        value: formatarMoeda(valor),
        color: CORES_DESPESAS[index % CORES_DESPESAS.length],
      }))
      .sort((a, b) => b.valorNum - a.valorNum);

    return {
      itens,
      totalSaidas,
    };
  }, [movimentacoesFiltradas]);

  const estaNegativo = balanco.saldo < 0;

  return (
    <DashboardLayout>
      <section
        id="gerenciamento"
        className="mb-[55px] scroll-mt-[110px] text-[#1e293b]"
      >
        {/* Cabeçalho e botão de configurações */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 text-[1.8rem] font-bold">
              Visão Geral
            </h1>

            <p className="text-sm text-[#64748b]">
              Acompanhe sua saúde financeira.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setConfiguracoesAbertas(true)}
            aria-label="Configurações da análise"
            title="Configurações da análise"
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              gestao-settings-button
              rounded-xl border border-[#d5dee9]
              bg-white text-[#334e70]
              transition-all duration-200
              hover:bg-[#f1f5f9]
              hover:-translate-y-0.5
            "
          >
            <Settings2 size={21} />
          </button>
        </div>

        {/* Modal de configurações */}
        {configuracoesAbertas && (
          <div
            className="
              fixed inset-0 z-[1100]
              flex items-center justify-center
              bg-[#081426]/70 p-4
              backdrop-blur-sm
            "
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setConfiguracoesAbertas(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-configuracoes"
              className="
                w-full max-w-[480px]
                rounded-2xl border border-[#d5dee9]
                bg-white p-6
                shadow-2xl
              "
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2
                    id="titulo-configuracoes"
                    className="text-xl font-bold text-[#142238]"
                  >
                    Configurações da análise
                  </h2>

                  <p className="mt-1 text-sm text-[#64748b]">
                    Personalize o período dos seus indicadores.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setConfiguracoesAbertas(false)}
                  aria-label="Fechar configurações"
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-lg text-[#64748b]
                    transition-colors hover:bg-[#f1f5f9]
                  "
                >
                  <X size={20} />
                </button>
              </div>

              <PeriodoFiltro
                periodoSelecionado={periodoSelecionado}
                onPeriodoChange={alterarPeriodo}
                dataInicio={dataInicio}
                onDataInicioChange={setDataInicio}
                dataFim={dataFim}
                onDataFimChange={setDataFim}
                onAplicar={aplicarPeriodoEFechar}
                erro={erroPeriodo}
                layout="vertical"
              />

              <p className="mt-4 text-xs text-[#64748b]">
                O período selecionado será aplicado aos indicadores e gráficos do Gerenciamento.
              </p>
            </div>
          </div>
        )}

        {/* Indicadores */}
        <div className="
          mb-10 grid grid-cols-1 gap-5
          sm:grid-cols-2 xl:grid-cols-3
        ">
          <IndicadorCard
            label="Entradas"
            valor={balanco.totalEntradas}
            tipo="entrada"
            descricao="Total recebido no período"
          />

          <IndicadorCard
            label="Saídas"
            valor={balanco.totalSaidas}
            tipo="saida"
            descricao="Total gasto no período"
          />

          <IndicadorCard
            label="Saldo"
            valor={balanco.saldo}
            tipo="saldo"
            descricao={
              estaNegativo
                ? 'Resultado negativo no período'
                : 'Resultado positivo no período'
            }
          />
        </div>

        {/* Análise financeira */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#1e293b]">
            Análise financeira
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Entenda de onde vem e para onde vai seu dinheiro.
          </p>

          <p className="mt-1 text-xs font-semibold text-[#94a3b8]">
            Exibindo dados de: {intervalo.descricao}
          </p>
        </div>

        <div className="
          grid grid-cols-1 gap-x-6 gap-y-10
          xl:grid-cols-2
        ">
          {/* Balanço Geral */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={19} className="text-[#10b981]" />

              <h3 className="text-lg font-bold text-[#142238]">
                Balanço Geral
              </h3>
            </div>

            <DonutChartCard
              items={balanco.itens}
              centerLabel={estaNegativo ? 'No vermelho' : 'Saldo'}
              centerValue={formatarMoeda(balanco.saldo)}
              centerColor={estaNegativo ? '#ef4444' : '#10b981'}
              emptyMessage={
                carregando
                  ? 'Carregando movimentações...'
                  : 'Nenhuma entrada ou saída encontrada neste período.'
              }
            />
          </div>

          {/* Onde Gastei */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown size={19} className="text-[#ef4444]" />

              <h3 className="text-lg font-bold text-[#142238]">
                Onde Gastei
              </h3>
            </div>

            <DonutChartCard
              items={ondeGastei.itens}
              centerLabel="Total gasto"
              centerValue={formatarMoeda(ondeGastei.totalSaidas)}
              centerColor="#ef4444"
              emptyMessage={
                carregando
                  ? 'Carregando movimentações...'
                  : 'Nenhuma despesa encontrada neste período.'
              }
            />
          </div>
        </div>
      </section>

      {/* Histórico de movimentações */}
      <Historico />
    </DashboardLayout>
  );
}

export default Gestao;
