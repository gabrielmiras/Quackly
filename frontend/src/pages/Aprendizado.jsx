import DashboardLayout from '../layouts/DashboardLayout.jsx';
import {
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Wallet,
  TrendingUp,
  ShoppingBag,
  Clock3,
} from 'lucide-react';

const QUIZZES = [
  {
    id: 1,
    title: 'Dominando suas Finanças Pessoais',
    description:
      'Teste seus conhecimentos sobre planejamento financeiro, investimentos e controle de gastos. Responda às perguntas para avaliar sua saúde financeira e ganhe recompensas ao concluir o questionário!',
    quantidade: 15,
    categoria: 'Fundamentos',
    icon: Wallet,
    cor: '#4775bd',
    fundo: '#edf3fc',
  },
  {
    id: 2,
    title: 'Desafio do Investidor Iniciante',
    description:
      'Descubra se você está pronto para fazer o seu dinheiro render. Entenda os conceitos básicos de renda fixa, renda variável e saiba como montar a sua primeira reserva de emergência de forma segura.',
    quantidade: 15,
    categoria: 'Investimentos',
    icon: TrendingUp,
    cor: '#059669',
    fundo: '#eaf7f1',
  },
  {
    id: 3,
    title: 'Orçamento Inteligente e Consumo Consciente',
    description:
      'Você sabe para onde vai o seu dinheiro no fim do mês? Avalie seus hábitos de consumo, aprenda a identificar despesas desnecessárias e monte uma estratégia eficiente para sair das dívidas e poupar mais.',
    quantidade: 20,
    categoria: 'Planejamento',
    icon: ShoppingBag,
    cor: '#b7791f',
    fundo: '#fbf3e5',
  },
];

function Aprendizado() {
  const totalQuestoes = QUIZZES.reduce(
    (total, quiz) => total + quiz.quantidade,
    0
  );

  return (
    <DashboardLayout>
      <section
        id="questionarios"
        className="mb-[60px] scroll-mt-[110px] text-[#142238]"
      >
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-[1.8rem] font-bold">
            Questionários
          </h1>

          <p className="mt-1 text-sm text-[#475569]">
            Teste seus conhecimentos e aprimore sua educação financeira.
          </p>
        </div>

        {/* Resumo */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Resumo
            icon={BookOpen}
            valor={QUIZZES.length}
            descricao="Questionários disponíveis"
          />

          <Resumo
            icon={ClipboardCheck}
            valor={totalQuestoes}
            descricao="Questões disponíveis"
          />
        </div>

        {/* Lista de questionários */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#142238]">
            Escolha seu desafio
          </h2>

          <p className="mt-1 text-sm text-[#475569]">
            Selecione um questionário para começar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {QUIZZES.map((quiz) => {
            const Icon = quiz.icon;

            return (
              <article
                key={quiz.id}
                className="
                  flex min-w-0 flex-col
                  rounded-2xl border border-[#d5dee9]
                  bg-white p-6
                  shadow-[0_4px_16px_rgba(20,34,56,0.055)]
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:shadow-[0_9px_24px_rgba(20,34,56,0.09)]
                "
              >
                {/* Ícone e categoria */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: quiz.fundo,
                      color: quiz.cor,
                    }}
                  >
                    <Icon size={23} />
                  </div>

                  <span
                    className="
                      rounded-full px-3 py-1.5
                      text-xs font-bold
                    "
                    style={{
                      backgroundColor: quiz.fundo,
                      color: quiz.cor,
                    }}
                  >
                    {quiz.categoria}
                  </span>
                </div>

                {/* Conteúdo */}
                <h3 className="text-lg font-bold leading-snug text-[#142238]">
                  {quiz.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#475569]">
                  {quiz.description}
                </p>

                {/* Informações */}
                <div className="
                  mt-6 flex items-center justify-between
                  border-t border-[#e2e8f0] pt-4
                ">
                  <span className="flex items-center gap-2 text-sm font-medium text-[#475569]">
                    <ClipboardCheck size={16} />
                    {quiz.quantidade} questões
                  </span>

                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
                    <Clock3 size={14} />
                    Questionário
                  </span>
                </div>

                {/* Botão */}
                <button
                  type="button"
                  onClick={() =>
                    console.log('Inscrito em', quiz.title)
                  }
                  className="
                    mt-5 flex w-full items-center
                    justify-center gap-2
                    !rounded-full bg-[#23385d]
                    px-5 py-3
                    text-sm font-bold text-white
                    shadow-[0_4px_12px_rgba(20,34,56,0.14)]
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#304b75]
                    hover:shadow-[0_6px_16px_rgba(20,34,56,0.20)]
                  "
                >
                  Começar questionário
                  <ArrowRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}

function Resumo({ icon: Icon, valor, descricao }) {
  return (
    <div className="
      flex items-center gap-4
      rounded-2xl border border-[#d5dee9]
      bg-white p-5
      shadow-[0_4px_16px_rgba(20,34,56,0.045)]
    ">
      <div className="
        flex h-12 w-12 shrink-0 items-center
        justify-center rounded-xl
        bg-[#edf1f6] text-[#334e70]
      ">
        <Icon size={22} />
      </div>

      <div>
        <strong className="block text-2xl font-bold text-[#142238]">
          {valor}
        </strong>

        <p className="mt-0.5 text-sm font-medium text-[#475569]">
          {descricao}
        </p>
      </div>
    </div>
  );
}

export default Aprendizado;