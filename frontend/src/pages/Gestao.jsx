import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/Card.jsx';
import historicoService from '../services/historicoService.js';
import aviao from '../assets/meta-aviao.png';
import casa from '../assets/meta-casa.png';
import sonho from '../assets/meta-sonho.png';
import more from '../assets/meta-mais.png';

const GOALS = [
  { image: aviao, title: 'Viagem' },
  { image: casa, title: 'Reforma na casa' },
  { image: sonho, title: 'Realizar seu sonho' },
  { image: more, title: 'Nova meta' },
];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function calcularEconomia(itens) {
  return itens.reduce((acc, item) => {
    const valor = Number(item.valor) || 0;
    return item.tipo === 'ENTRADA' ? acc + valor : acc - valor;
  }, 0);
}

function obterData(item) {
  if (!item.dataHora) return null;
  const d = new Date(String(item.dataHora).replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? null : d;
}

function gerarConicGradient(items) {
  const total = items.reduce((acc, item) => acc + item.valorNum, 0);
  if (total <= 0) return '#e2e8f0';

  let acumulado = 0;
  const stops = items.map((item) => {
    const porcentagem = (item.valorNum / total) * 100;
    const inicio = acumulado;
    const fim = acumulado + porcentagem;
    acumulado = fim;
    return `${item.color} ${inicio.toFixed(1)}% ${fim.toFixed(1)}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

/** Componente genérico de gráfico de rosca */
function DonutChartCard({ title, items, centerLabel, centerValue, centerColor, emptyMessage }) {
  if (!items || items.length === 0) {
    return (
      <div className="gestao-chart" style={{ minHeight: '260px', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', margin: 0, textAlign: 'center' }}>
          {emptyMessage || 'Nenhum dado registrado para este gráfico.'}
        </p>
      </div>
    );
  }

  const gradient = gerarConicGradient(items);

  return (
    <div className="gestao-chart" style={{ padding: '24px' }}>
      <div
        className="gestao-chart__donut"
        style={{
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          width: '130px',
          height: '130px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            padding: '4px',
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {centerLabel}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: centerColor || '#1e293b' }}>
            {centerValue}
          </span>
        </div>
      </div>

      <div className="gestao-chart__legend" style={{ gap: '12px' }}>
        {items.map((item) => (
          <div className="gestao-chart__item" key={item.label} style={{ gap: '16px' }}>
            <div className="gestao-chart__label" style={{ gap: '10px' }}>
              <div className="gestao-chart__dot" style={{ backgroundColor: item.color }}></div>
              <span style={{ fontWeight: item.highlight ? '600' : 'normal' }}>{item.label}</span>
            </div>
            <strong style={{ color: item.highlightColor || 'inherit', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
              {item.value}
            </strong>
          </div>
        ))}
      </div>
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

  const stats = useMemo(() => {
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();

    // Início da semana (Segunda-feira 00:00:00)
    const inicioSemana = new Date(agora);
    const diaSemana = (inicioSemana.getDay() + 6) % 7;
    inicioSemana.setDate(agora.getDate() - diaSemana);
    inicioSemana.setHours(0, 0, 0, 0);

    const inicioMes = new Date(anoAtual, mesAtual, 1);
    const inicioAno = new Date(anoAtual, 0, 1);

    const movimentacoesAno = movimentacoes.filter((item) => {
      const d = obterData(item);
      return d && d >= inicioAno;
    });

    const movimentacoesMes = movimentacoes.filter((item) => {
      const d = obterData(item);
      return d && d >= inicioMes;
    });

    const movimentacoesSemana = movimentacoes.filter((item) => {
      const d = obterData(item);
      return d && d >= inicioSemana;
    });

    const economizadoAno = calcularEconomia(movimentacoesAno);
    const economizadoMes = calcularEconomia(movimentacoesMes);
    const economizadoSemana = calcularEconomia(movimentacoesSemana);

    // Formata o valor dos cards de cima destacando em vermelho quando negativo e verde quando positivo
    const formatarCardValor = (valorNum) => (
      <span style={{ color: valorNum < 0 ? '#ef4444' : '#059669', fontWeight: 700 }}>
        {formatarMoeda(valorNum)}
      </span>
    );

    return [
      { label: 'Este ano', value: formatarCardValor(economizadoAno) },
      { label: 'Este mês', value: formatarCardValor(economizadoMes) },
      { label: 'Esta semana', value: formatarCardValor(economizadoSemana) },
    ];
  }, [movimentacoes]);

  // 1. Dados para o gráfico de Balanço Geral (Entradas vs Saídas)
  const balanco = useMemo(() => {
    const totalEntradas = movimentacoes
      .filter((m) => m.tipo === 'ENTRADA')
      .reduce((acc, m) => acc + (Number(m.valor) || 0), 0);

    const totalSaidas = movimentacoes
      .filter((m) => m.tipo === 'SAIDA')
      .reduce((acc, m) => acc + (Number(m.valor) || 0), 0);

    const saldo = totalEntradas - totalSaidas;

    const itens = [];
    if (totalEntradas > 0) {
      itens.push({
        label: 'Entradas (Ganhos)',
        valorNum: totalEntradas,
        value: formatarMoeda(totalEntradas),
        color: '#10b981', // Verde esmeralda
      });
    }

    if (totalSaidas > 0) {
      itens.push({
        label: 'Saídas (Despesas)',
        valorNum: totalSaidas,
        value: formatarMoeda(totalSaidas),
        color: '#ef4444', // Vermelho
      });
    }

    return {
      itens,
      totalEntradas,
      totalSaidas,
      saldo,
    };
  }, [movimentacoes]);

  // 2. Dados para o gráfico "Onde Gastei" (Apenas Saídas divididas por categoria)
  const ondeGastei = useMemo(() => {
    // Cores de despesas SEM verde (o verde fica exclusivo para Entradas/Ganhos) e sem rosa
    const cores = ['#2563eb', '#f59e0b', '#7c3aed', '#ea580c', '#0284c7', '#4f46e5', '#d97706', '#475569', '#6366f1'];
    const saidas = movimentacoes.filter((m) => m.tipo === 'SAIDA');
    const totalSaidas = saidas.reduce((acc, m) => acc + (Number(m.valor) || 0), 0);

    const mapaSaidas = {};
    saidas.forEach((m) => {
      const nome = m.nome?.trim() || 'Outras despesas';
      mapaSaidas[nome] = (mapaSaidas[nome] || 0) + (Number(m.valor) || 0);
    });

    const itens = [];
    let corIndex = 0;
    Object.entries(mapaSaidas).forEach(([label, valor]) => {
      itens.push({
        label,
        valorNum: valor,
        value: formatarMoeda(valor),
        color: cores[corIndex % cores.length],
      });
      corIndex++;
    });

    return {
      itens,
      totalSaidas,
    };
  }, [movimentacoes]);

  const estaNegativo = balanco.saldo < 0;

  return (
    <DashboardLayout>
      <section id="gerenciamento" className="dash-section">
        <h1 className="dash-section__title">Visão Geral</h1>
        <p
          className="dash-section__subtitle"
          style={{ color: estaNegativo ? '#ef4444' : undefined, fontWeight: estaNegativo ? 600 : undefined }}
        >
          {carregando
            ? 'Calculando quanto você economizou...'
            : estaNegativo
            ? 'Sem saldo economizado'
            : 'Quanto você economizou?'}
        </p>
        <div className="gestao-stats">
          {stats.map((stat) => (
            <Card key={stat.label} variant="stat" {...stat} />
          ))}
        </div>

        {/* Linha com os dois gráficos lado a lado */}
        <div className="row g-4" style={{ marginTop: '24px' }}>
          {/* Gráfico 1: Balanço Geral */}
          <div className="col-12 col-xl-6">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
              Balanço Geral
            </h2>
            <DonutChartCard
              title="Balanço Geral"
              items={balanco.itens}
              centerLabel={balanco.saldo >= 0 ? 'Economia' : 'No vermelho'}
              centerValue={formatarMoeda(balanco.saldo)}
              centerColor={balanco.saldo >= 0 ? '#10b981' : '#ef4444'}
              emptyMessage="Nenhuma entrada ou saída cadastrada ainda."
            />
          </div>

          {/* Gráfico 2: Onde Gastei */}
          <div className="col-12 col-xl-6">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
              Onde Gastei
            </h2>
            <DonutChartCard
              title="Onde Gastei"
              items={ondeGastei.itens}
              centerLabel="Total Gasto"
              centerValue={formatarMoeda(ondeGastei.totalSaidas)}
              centerColor="#ef4444"
              emptyMessage="Nenhuma despesa cadastrada ainda."
            />
          </div>
        </div>
      </section>

      <section id="metas" className="dash-section">
        <h1 className="dash-section__title">Metas</h1>
        <p className="dash-section__subtitle">Acompanhe seus objetivos financeiros</p>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {GOALS.map((goal) => (
            <div className="col" key={goal.title}>
              <Card variant="goal" {...goal} onClick={() => console.log('Meta:', goal.title)} />
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Gestao;
