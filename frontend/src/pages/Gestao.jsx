import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/Card.jsx';
import aviao from '../assets/meta-aviao.png';
import casa from '../assets/meta-casa.png';
import sonho from '../assets/meta-sonho.png';
import more from '../assets/meta-mais.png';

const STATS = [
  { label: 'Este ano', value: 'R$ 20.652,50'},
  { label: 'Este mês', value: 'R$ 1.321,20'},
  { label: 'Esta semana', value: 'R$ 250,00'},
];

/* INFORMACOES PRA FUNCAO QUE CRIA O GRAFICO
*const EXPENSES = [
  { label: 'Aluguel', value: 'R$ 1860,00', color: '#00bcd4' },
  { label: 'Alimentos', value: 'R$ 1.294,15', color: '#009688' },
  { label: 'Emergências', value: 'R$ 100,00', color: '#e91e63' },
];*/

const GOALS = [
  { image: aviao, title: 'Viagem' },
  { image: casa, title: 'Reforma na casa' },
  { image: sonho, title: 'Realizar seu sonho' },
  { image: more, title: 'Nova meta' },
];

/** Rosca + legenda de despesas (só é usado nesta página, por isso fica local). 
function ExpensesChart({ items }) {
  return (
    <div className="gestao-chart">
      <div className="gestao-chart__donut"></div>
      <div className="gestao-chart__legend">
        {items.map((item) => (
          <div className="gestao-chart__item" key={item.label}>
            <div className="gestao-chart__label">
              <div className="gestao-chart__dot" style={{ backgroundColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}*/

function Gestao() {
  return (
    <DashboardLayout>
      <section id="gerenciamento" className="dash-section">
        <h1 className="dash-section__title">Visão Geral</h1>
        <p className="dash-section__subtitle">Quanto você economizou?</p>
        <div className="gestao-stats">
          {STATS.map((stat) => (
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
