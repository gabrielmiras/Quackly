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

    return [
      { label: 'Este ano', value: formatarMoeda(calcularEconomia(movimentacoesAno)) },
      { label: 'Este mês', value: formatarMoeda(calcularEconomia(movimentacoesMes)) },
      { label: 'Esta semana', value: formatarMoeda(calcularEconomia(movimentacoesSemana)) },
    ];
  }, [movimentacoes]);

  return (
    <DashboardLayout>
      <section id="gerenciamento" className="dash-section">
        <h1 className="dash-section__title">Visão Geral</h1>
        <p className="dash-section__subtitle">
          {carregando ? 'Calculando quanto você economizou...' : 'Quanto você economizou?'}
        </p>
        <div className="gestao-stats">
          {stats.map((stat) => (
            <Card key={stat.label} variant="stat" {...stat} />
          ))}
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
