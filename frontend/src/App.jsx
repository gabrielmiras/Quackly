import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Aprendizado from './pages/Aprendizado.jsx';
import Gestao from './pages/Gestao.jsx';
import Historico from './pages/Historico.jsx';

/**
 * O React Router troca a URL via pushState, e o navegador NÃO rola até a âncora (#metas)
 * nesse caso. Este componente faz isso manualmente e volta ao topo ao trocar de página.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/aprendizado" element={<Aprendizado />} />
        <Route path="/gestao" element={<Gestao />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </>
  );
}

export default App;
