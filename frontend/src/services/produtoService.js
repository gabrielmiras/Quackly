const BASE_URL = import.meta.env.VITE_API_URL || '';
const STORAGE_KEY = 'quackly-produtos';

function lerLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function salvarLocal(produtos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  return produtos;
}

async function requisitar(path, options) {
  const response = await fetch(`${BASE_URL}/usuarios${path}`, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

const produtoService = {
  async listar() {
    return BASE_URL ? requisitar('') : lerLocal();
  },
  async criar(produto) {
    if (BASE_URL) return requisitar('', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(produto) });
    const produtos = lerLocal();
    const criado = { ...produto, id: Date.now() };
    salvarLocal([...produtos, criado]);
    return criado;
  },
  async atualizar(id, produto) {
    if (BASE_URL) return requisitar(`/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(produto) });
    const atualizado = { ...produto, id };
    salvarLocal(lerLocal().map((item) => item.id === id ? atualizado : item));
    return atualizado;
  },
  async remover(id) {
    if (BASE_URL) return requisitar(`/${id}`, { method: 'DELETE' });
    salvarLocal(lerLocal().filter((item) => item.id !== id));
  },
};

export default produtoService;
