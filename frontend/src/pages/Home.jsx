import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import CoinBackground from '../components/CoinBackground.jsx';

import duck from '../assets/logo-quackly3.png';
import patoNoCelular from '../assets/mockup-celular.png';
import notebookGrafico from '../assets/mockup-notebook.png';

import { ChevronDown } from 'lucide-react';

const CONTAINER = `
  mx-auto w-full px-3
  sm:max-w-[540px]
  md:max-w-[720px]
  lg:max-w-[960px]
  xl:max-w-[1140px]
  2xl:max-w-[1320px]
`;

const FEATURES = [
  {
    icon: 'bi-mortarboard',
    title: 'Gestão desde o básico',
    description: 'Aprenda gestão de maneira descomplicada enquanto aplica os conceitos no seu dia a dia.',
  },
  {
    iconImage: duck,
    title: 'Evolua seu PET',
    description: 'Cuide do seu pet enquanto cuida do seu dinheiro. Economize no mundo real e evolua seu parceiro virtual.',
  },
  {
    icon: 'bi-chat-dots',
    title: 'Agente de IA',
    description: 'Se permita ter a assistência de um agente de IA para fazer a "parte chata", como preencher uma planilha ou emitir um gráfico.',
  },
];

const TRANSACTIONS = [
  {
    position: 1,
    icon: 'bi-bag-fill',
    iconTone: 'bg-danger-subtle text-danger',
    title: 'Delivery de comida',
    subtitle: 'Alimentação • 28 de Jun',
    value: 'R$ 42,00',
  },
  {
    position: 2,
    icon: 'bi-house-door-fill',
    iconTone: 'bg-primary-subtle text-primary',
    title: 'Hospedagem',
    subtitle: 'Viagens • 24 de Jun',
    value: 'R$ 120,00',
  },
  {
    position: 3,
    icon: 'bi-car-front-fill',
    iconTone: 'bg-dark text-white border border-secondary',
    title: 'Corrida',
    subtitle: 'parcela 1/4 • 28 de Jun',
    value: 'R$ 120,00',
  },
];

function Home() {
  return (
    <div
      id="top"
      className="
        relative isolate min-h-screen
        overflow-x-clip
        bg-[#192841] text-white
        pt-[60px]
      "
    >
      <CoinBackground />
      <Navbar />

      {/* HERO */}
      <section className="
        mt-[130px] mb-[210px]
        px-3 pt-[80px] pb-[60px]
        text-center
      ">
        <div className="
          mx-auto w-full max-w-[1500px] px-3
        ">
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 8vw, 4rem)',
              lineHeight: 1.08,
              letterSpacing: '-1px',
            }}
            className="
              mx-auto mb-8 w-full
              max-w-[1000px]
              !font-extrabold text-white
              sm:tracking-[-2px]
            "
          >
            Você não precisa cuidar do seu

            <span className="
              mt-3 block
              bg-[image:var(--gradient-primary)]
              bg-clip-text text-transparent
            ">
              dinheiro sozinho.
            </span>
          </h1>

          <div className="mt-9">
            <Button
              variant="primary"
              to="/login"
              className="!px-8 !py-3"
            >
              Começar agora
            </Button>
          </div>
          <a
            href="#features"
            aria-label="Conheça os recursos do Quackly"
            className="
              mt-[305px] inline-flex
              items-center justify-center
              text-[#FFCB61]
              transition-colors duration-300
              hover:text-white
              animate-bounce
            "
          >
            <ChevronDown size={38} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* RECURSOS */}
      <section
        id="features"
        className="scroll-mt-[110px] py-12"
      >
        <div className={`${CONTAINER} text-center`}>
          <h2 className="text-[2rem] font-medium text-white">
            Por que escolher o <b>Quackly?</b>
          </h2>

          <div className="
            mt-12 grid w-full min-w-0
            grid-cols-1 items-stretch
            gap-6 md:grid-cols-3
          ">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="min-w-0">
                <Card variant="feature" {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZAÇÃO FINANCEIRA */}
      <section className="py-12">
        <div className={CONTAINER}>
          <div className="
            grid grid-cols-1 items-center gap-6
            lg:grid-cols-2
          ">
            <div className="
              relative mb-12
              lg:mb-0
            ">
              <div className="
                relative ml-0 mr-auto
                max-w-[500px]
                max-[991px]:mx-auto
                max-[991px]:max-w-full
              ">
                <img
                  src={patoNoCelular}
                  alt="Pato no Celular"
                  className="
                    relative left-[-60px]
                    z-[1] block w-full
                    rounded-[40px] p-0
                    max-[991px]:left-0
                    max-[991px]:mx-auto
                    max-[991px]:max-w-[320px]
                  "
                />

                {TRANSACTIONS.map((item) => (
                  <Card
                    key={item.title}
                    variant="floating"
                    {...item}
                  />
                ))}
              </div>
            </div>

            <div className="
              text-white
              lg:pl-12
            ">
              <h2 className="
                mb-6 text-[clamp(2.2rem,5vw,3.5rem)]
                font-bold leading-[1.1]
                text-white
                max-[991px]:mt-10
                max-[991px]:text-center
              ">
                Surpresas na fatura? Comigo, não!
              </h2>

              <p className="
                mb-8 max-w-[450px]
                text-[1.1rem] leading-[1.6]
                text-white/70
                max-[991px]:mx-auto
                max-[991px]:text-center
              ">
                Eu sei como é abrir a fatura e não entender nada. Por isso eu organizo tudo e ainda te ensino
                como melhorar sua gestão financeira.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Button variant="pill" to="/login">
                  Quero Aprender
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENTOR VIRTUAL */}
      <section
        id="mentor"
        className="
          scroll-mt-[110px]
          overflow-hidden py-[60px]
        "
      >
        <div className={CONTAINER}>
          <div className="
            grid grid-cols-1 items-center gap-6
            lg:grid-cols-2
          ">
            <div className="
              mb-12 text-white
              lg:mb-0 lg:pr-12
            ">
              <h2 className="
                mb-6 text-[clamp(2.5rem,5vw,3.8rem)]
                font-bold leading-[1.1]
                text-white
                max-[991px]:mt-10
                max-[991px]:text-center
              ">
                Seu novo mentor financeiro
              </h2>

              <p className="
                mb-[35px] max-w-[480px]
                text-[1.15rem] leading-[1.6]
                text-white/70
                max-[991px]:mx-auto
                max-[991px]:mb-8
                max-[991px]:text-center
              ">
                Esqueça as planilhas complicadas. Gerencie seu dinheiro de forma intuitiva através do seu pet
                virtual. Cada decisão financeira correta faz ele crescer, e o seu saldo bancário também.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Button variant="pill" to="/login">
                  Iniciar Jornada
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={notebookGrafico}
                alt="Notebook com Dashboard Financeiro"
                className="
                  block h-auto max-w-full
                  mx-auto
                "
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
