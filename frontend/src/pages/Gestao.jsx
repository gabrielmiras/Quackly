import { useEffect, useMemo, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/Card.jsx';
import historicoService from '../services/historicoService.js';
import Metas from '../components/Metas.jsx';

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

function calcularEconomia(itens) {
  return itens.reduce((acc, item) => {
    const valor = Number(item.valor) || 0;

    return item.tipo === 'ENTRADA'
      ? acc + valor
      : acc - valor;
  }, 0);
}

function obterData(item) {
  if (!item.dataHora) return null;

  const data = new Date(
    String(item.dataHora).replace(' ', 'T')
  );

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

/** Painel reutilizável de gráfico de rosca */
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
      xl:h-full
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
          xl:flex-col 2xl:flex-row
        ">
          {/* Gráfico circular */}
          <div className="
            flex shrink-0 items-center
            justify-center
          ">
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
                rounded-full bg-white
                shadow-inner
              ">
                <span className="
                  text-xs font-bold
                  uppercase tracking-wider
                  text-[#475569]
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

          {/* Legenda */}
          <div className="
            flex w-full min-w-0 flex-1
            flex-col gap-3
          ">
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

                <strong className="
                  shrink-0 text-sm font-bold
                  text-[#142238]
                ">
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

function Gestao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    historicoService
      .listar()
      .then((dados) => {
        setMovimentacoes(dados || []);
      })
      .catch((err) => {
        console.error('Erro ao carregar movimentações:', err);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  // Estatísticas financeiras
  const stats = useMemo(() => {
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();

    // Hoje e os seis dias anteriores
    const inicioUltimos7Dias = new Date(agora);
    inicioUltimos7Dias.setDate(agora.getDate() - 6);
    inicioUltimos7Dias.setHours(0, 0, 0, 0);

    const inicioMes = new Date(anoAtual, mesAtual, 1);
    const inicioAno = new Date(anoAtual, 0, 1);

    const movimentacoesAno = movimentacoes.filter((item) => {
      const data = obterData(item);
      return data && data >= inicioAno && data <= agora;
    });

    const movimentacoesMes = movimentacoes.filter((item) => {
      const data = obterData(item);
      return data && data >= inicioMes && data <= agora;
    });

    const movimentacoesUltimos7Dias = movimentacoes.filter((item) => {
      const data = obterData(item);

      return (
        data &&
        data >= inicioUltimos7Dias &&
        data <= agora
      );
    });

    const economizadoAno = calcularEconomia(movimentacoesAno);
    const economizadoMes = calcularEconomia(movimentacoesMes);
    const economizadoUltimos7Dias = calcularEconomia(
      movimentacoesUltimos7Dias
    );

    const formatarCardValor = (valor) => (
      <span
        style={{
          color: valor < 0 ? '#ef4444' : '#059669',
          fontWeight: 700,
        }}
      >
        {formatarMoeda(valor)}
      </span>
    );

    return [
      {
        label: 'Este ano',
        value: formatarCardValor(economizadoAno),
      },
      {
        label: 'Este mês',
        value: formatarCardValor(economizadoMes),
      },
      {
        label: 'Últimos 7 dias',
        value: formatarCardValor(economizadoUltimos7Dias),
      },
    ];
  }, [movimentacoes]);

  // Balanço geral: entradas e saídas
  const balanco = useMemo(() => {
    const totalEntradas = movimentacoes
      .filter((item) => item.tipo === 'ENTRADA')
      .reduce(
        (acc, item) => acc + (Number(item.valor) || 0),
        0
      );

    const totalSaidas = movimentacoes
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
  }, [movimentacoes]);

  // Despesas agrupadas por descrição
  const ondeGastei = useMemo(() => {
    const saidas = movimentacoes.filter(
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

    const itens = Object.entries(mapaSaidas).map(
      ([label, valor], index) => ({
        label,
        valorNum: valor,
        value: formatarMoeda(valor),
        color: CORES_DESPESAS[index % CORES_DESPESAS.length],
      })
    );

    return {
      itens,
      totalSaidas,
    };
  }, [movimentacoes]);

  const estaNegativo = balanco.saldo < 0;

  return (
    <DashboardLayout>
      {/* Visão Geral */}
      <section
        id="gerenciamento"
        className="mb-[55px] scroll-mt-[110px] text-[#1e293b]"
      >
        <div className="mb-6">
          <h1 className="mb-1 text-[1.8rem] font-bold">
            Visão Geral
          </h1>

          <p className="text-sm text-[#64748b]">
            Acompanhe sua saúde financeira.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="
          mb-10 grid grid-cols-1 gap-5
          sm:grid-cols-2
          xl:grid-cols-3
        ">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              variant="stat"
              {...stat}
            />
          ))}
        </div>

        {/* Análise financeira */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#1e293b]">
            Análise financeira
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Entenda de onde vem e para onde vai seu dinheiro.
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
              centerLabel={
                balanco.saldo >= 0 ? 'Economia' : 'No vermelho'
              }
              centerValue={formatarMoeda(balanco.saldo)}
              centerColor={
                balanco.saldo >= 0 ? '#10b981' : '#ef4444'
              }
              emptyMessage="Nenhuma entrada ou saída cadastrada ainda."
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
              emptyMessage="Nenhuma despesa cadastrada ainda."
            />
          </div>
        </div>
      </section>

      {/* Metas */}
      <div className="mb-[20px]">
        <Metas />
      </div>
    </DashboardLayout>
  );
}

export default Gestao;
