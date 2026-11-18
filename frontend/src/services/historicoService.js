const BASE_URL = import.meta.env.VITE_API_URL || '';
const STORAGE_KEY = 'quackly-movimentacoes';

function lerLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function salvarLocal(movimentacoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movimentacoes));
}

async function requisitar(path, options) {
  const response = await fetch(`${BASE_URL}/movimentacoes${path}`, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

const historicoService = {
  async listar() {
    return BASE_URL ? requisitar('') : lerLocal();
  },
  async criar(movimentacao) {
    if (BASE_URL) return requisitar('', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movimentacao) });
    const criada = { ...movimentacao, id: Date.now() };
    salvarLocal([...lerLocal(), criada]);
    return criada;
  },
  async atualizar(id, movimentacao) {
    if (BASE_URL) return requisitar(`/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movimentacao) });
    const atualizada = { ...movimentacao, id };
    salvarLocal(lerLocal().map((item) => item.id === id ? atualizada : item));
    return atualizada;
  },
  async remover(id) {
    if (BASE_URL) return requisitar(`/${id}`, { method: 'DELETE' });
    salvarLocal(lerLocal().filter((item) => item.id !== id));
  },
};

export default historicoService;
