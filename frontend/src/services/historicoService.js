const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const ENDPOINT = `${BASE_URL}/movimentacoes`;

function obterIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

  if (!usuario?.id) {
    throw new Error('Usuário não identificado. Faça login novamente.');
  }

  return usuario.id;
}

function converterParaFrontend(movimentacao) {
  return {
    id: movimentacao.idMovimentacao,
    tipo: movimentacao.tipoMovimentacao === 'Entrada' ? 'ENTRADA' : 'SAIDA',
    valor: movimentacao.valor,
    nome: movimentacao.nome,
    dataHora: movimentacao.data,
  };
}

function converterParaBackend(movimentacao) {
  return {
    idUsuario: obterIdUsuario(),
    tipoMovimentacao: movimentacao.tipo === 'ENTRADA' ? 'Entrada' : 'Saida',
    valor: Number(movimentacao.valor),
    nome: movimentacao.nome.trim(),
    data: movimentacao.dataHora,
  };
}

async function requisitar(path = '', options = {}) {
  const response = await fetch(`${ENDPOINT}${path}`, options);

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

const historicoService = {
  usandoFallbackLocal() {
    return false;
  },

  async listar() {
    const idUsuario = obterIdUsuario();

    const dados = await requisitar(`?idUsuario=${idUsuario}`);

    return dados.map(converterParaFrontend);
  },

  async criar(movimentacao) {
    const dados = converterParaBackend(movimentacao);

    const criada = await requisitar('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    return converterParaFrontend(criada);
  },

  async atualizar(id, movimentacao) {
    const idUsuario = obterIdUsuario();
    const dados = converterParaBackend(movimentacao);

    const atualizada = await requisitar(
      `/${id}?idUsuario=${idUsuario}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      }
    );

    if (!atualizada) {
      throw new Error('Movimentação não encontrada.');
    }

    return converterParaFrontend(atualizada);
  },

  async remover(id) {
    const idUsuario = obterIdUsuario();

    await requisitar(`/${id}?idUsuario=${idUsuario}`, {
      method: 'DELETE',
    });
  },
};

export default historicoService;
