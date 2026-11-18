import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/Card.jsx';

const QUIZZES = [
  {
    title: 'Dominando suas Finanças Pessoais',
    description:
      'Teste seus conhecimentos sobre planejamento financeiro, investimentos e controle de gastos. Responda às perguntas para avaliar sua saúde financeira e ganhe recompensas ao concluir o questionário!',
    meta: '15 questões',
  },
  {
    title: 'Desafio do Investidor Iniciante',
    description:
      'Descubra se você está pronto para fazer o seu dinheiro render. Entenda os conceitos básicos de renda fixa, renda variável e saiba como montar a sua primeira reserva de emergência de forma segura.',
    meta: '15 questões',
  },
  {
    title: 'Orçamento Inteligente e Consumo Consciente',
    description:
      'Você sabe para onde vai o seu dinheiro no fim do mês? Avalie seus hábitos de consumo, aprenda a identificar despesas desnecessárias e monte uma estratégia eficiente para sair das dívidas e poupar mais.',
    meta: '20 questões',
  },
];

function Aprendizado() {
  return (
    <DashboardLayout>
      <section id="questionarios" className="dash-section">
        <h1 className="dash-section__title">Questionários</h1>
        <p className="dash-section__subtitle">Teste seus conhecimentos.</p>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {QUIZZES.map((quiz) => (
            <div className="col d-flex" key={quiz.title}>
              <Card variant="quiz" {...quiz} onAction={() => console.log('Inscrito em', quiz.title)} />
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Aprendizado;
