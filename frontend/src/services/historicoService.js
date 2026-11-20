const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const ENDPOINT = `${BASE_URL}/movimentacoes`;
const STORAGE_KEY = 'quackly-movimentacoes';
let fallbackLocal = false;

function lerLocal() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarLocal(movimentacoes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movimentacoes));
  } catch {
    return;
  }
}

function ordenarPorData(movimentacoes) {
  return [...movimentacoes].sort((a, b) => String(b.dataHora || '').localeCompare(String(a.dataHora || '')));
}

function dataHoraAtual() {
  const data = new Date();
  const doisDigitos = (valor) => String(valor).padStart(2, '0');
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
}

async function requisitar(path = '', options) {
  const response = await fetch(`${ENDPOINT}${path}`, options);
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

async function comFallbackLocal(acaoApi, acaoLocal) {
  if (fallbackLocal) return acaoLocal();
  try {
    return await acaoApi();
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    fallbackLocal = true;
    return acaoLocal();
  }
}

const historicoService = {
  usandoFallbackLocal() {
    return fallbackLocal;
  },
  listar() {
    return comFallbackLocal(async () => {
      const dados = await requisitar();
      salvarLocal(ordenarPorData(dados));
      return dados;
    }, () => ordenarPorData(lerLocal()));
  },
  criar(movimentacao) {
    return comFallbackLocal(
      async () => {
        const criada = await requisitar('', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movimentacao) });
        salvarLocal(ordenarPorData([...lerLocal().filter((item) => item.id !== criada.id), criada]));
        return criada;
      },
      () => {
        const criada = { ...movimentacao, id: Date.now(), dataHora: movimentacao.dataHora || dataHoraAtual() };
        salvarLocal(ordenarPorData([...lerLocal(), criada]));
        return criada;
      },
    );
  },
  atualizar(id, movimentacao) {
    return comFallbackLocal(
      async () => {
        const atualizada = await requisitar(`/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movimentacao) });
        salvarLocal(ordenarPorData([...lerLocal().filter((item) => item.id !== id), atualizada]));
        return atualizada;
      },
      () => {
        const atualizada = { ...movimentacao, id, dataHora: movimentacao.dataHora || dataHoraAtual() };
        salvarLocal(ordenarPorData(lerLocal().map((item) => item.id === id ? atualizada : item)));
        return atualizada;
      },
    );
  },
  remover(id) {
    return comFallbackLocal(
      async () => {
        await requisitar(`/${id}`, { method: 'DELETE' });
        salvarLocal(lerLocal().filter((item) => item.id !== id));
      },
      () => salvarLocal(lerLocal().filter((item) => item.id !== id)),
    );
  },
};

export default historicoService;
