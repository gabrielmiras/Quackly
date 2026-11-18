import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import CoinBackground from '../components/CoinBackground.jsx';
import duck from '../assets/logo-quackly3.png';
import patoNoCelular from '../assets/mockup-celular.png';
import notebookGrafico from '../assets/mockup-notebook.png';

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

const STANDARD_FEATURES = [
  { text: 'Escolha entre diferentes maneiras de aprender (cursos, dicas e conteúdos curtos).' },
  { text: 'Tenha seu próprio assistente de IA para facilitar sua gestão e aprendizado.' },
  { text: 'Defina suas metas, e o Quackly faz o resto.' },
  {
    text: 'Escolha entre conectar o Quackly ao seu banco para registrar transações automaticamente.',
    subItem: 'Ou escolha cadastrar as transações manualmente.',
  },
];

function Home() {
  return (
    <div id="top" className="home">
      <CoinBackground />
      <Navbar />

      <section className="home-hero text-center">
        <div className="container">
          <h1 className="home-hero__title">
            Você não precisa cuidar do seu <br />
            <span className="home-gradient-text">dinheiro sozinho.</span>
          </h1>

          <div className="home-hero__cta">
            <Button variant="primary" to="/login" className="me-3">
              Começar agora
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-5">
        <div className="container text-center">
          <h2 className="home-section-title">
            Por que escolher o <b>Quackly?</b>
          </h2>
          <div className="row mt-5">
            {FEATURES.map((feature) => (
              <div className="col-md-4 mb-4" key={feature.title}>
                <Card variant="feature" {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 position-relative mb-5 mb-lg-0">
              <div className="home-phone">
                <img src={patoNoCelular} alt="Pato no Celular" className="home-phone__img" />

                {TRANSACTIONS.map((item) => (
                  <Card key={item.title} variant="floating" {...item} />
                ))}
              </div>
            </div>
            <div className="col-lg-6 ps-lg-5 text-white">
              <h2 className="home-display-title">Surpresas na fatura? Comigo, não</h2>
              <p className="home-description">
                Eu sei como é abrir a fatura e não entender nada. Por isso eu organizo tudo e ainda te ensino
                como melhorar sua gestão financeira.
              </p>
              <Button variant="pill" to="/login">
                Quero Aprender
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="mentor" className="home-mentor">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 pe-lg-5 text-white mb-5 mb-lg-0">
              <h2 className="home-mentor__title">Seu novo mentor financeiro</h2>
              <p className="home-mentor__text">
                Esqueça as planilhas complicadas. Gerencie seu dinheiro de forma intuitiva através do seu pet
                virtual. Cada decisão financeira correta faz ele crescer, e o seu saldo bancário também.
              </p>
              <Button variant="pill" to="/login">
                Iniciar Jornada
              </Button>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <img
                src={notebookGrafico}
                alt="Notebook com Dashboard Financeiro"
                className="img-fluid home-mentor__img"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="home-pricing">
        <div className="container">
          <h2 className="home-pricing__heading">Benefícios</h2>
          <p className="home-pricing__subtitle">Veja quais são os benefícios e diferenciais de usar o Quackly.</p>

          <div className="home-pricing__grid">
            <Card
              variant="pricing"
              title="Quackly Standard"
              price="Grátis"
              subtitle="Tudo que você precisa para integrar seu aprendizado à gestão do dia a dia"
              features={STANDARD_FEATURES}
              ctaLabel="Começar"
              ctaTo="/login"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
