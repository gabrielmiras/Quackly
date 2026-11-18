import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import produtoService from '../services/produtoService.js';

const FORM_VAZIO = { nome: '', categoria: '', valor: '', quantidade: '' };

function Historico() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    produtoService.listar().then(setProdutos).catch(() => setAviso('Não foi possível carregar os produtos.'));
  }, []);

  const filtrados = useMemo(() => produtos.filter((produto) =>
    `${produto.nome} ${produto.categoria}`.toLowerCase().includes(busca.toLowerCase())
  ), [produtos, busca]);

  function alterarCampo(event) {
    setForm((atual) => ({ ...atual, [event.target.name]: event.target.value }));
  }

  function limparFormulario() {
    setForm(FORM_VAZIO);
    setEditandoId(null);
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setAviso('');
    const dados = { ...form, valor: Number(form.valor), quantidade: Number(form.quantidade) };
    try {
      if (editandoId === null) {
        const criado = await produtoService.criar(dados);
        setProdutos((atuais) => [...atuais, criado]);
        setAviso(`${criado.nome} foi cadastrado.`);
      } else {
        const atualizado = await produtoService.atualizar(editandoId, dados);
        setProdutos((atuais) => atuais.map((item) => item.id === editandoId ? atualizado : item));
        setAviso(`${atualizado.nome} foi atualizado.`);
      }
      limparFormulario();
    } catch {
      setAviso('Não foi possível salvar o produto. Tente novamente.');
    }
  }

  function iniciarEdicao(produto) {
    setForm({ nome: produto.nome, categoria: produto.categoria, valor: String(produto.valor), quantidade: String(produto.quantidade) });
    setEditandoId(produto.id);
    setAviso('');
  }

  async function excluir(produto) {
    if (!window.confirm(`Excluir ${produto.nome}?`)) return;
    try {
      await produtoService.remover(produto.id);
      setProdutos((atuais) => atuais.filter((item) => item.id !== produto.id));
      if (editandoId === produto.id) limparFormulario();
      setAviso(`${produto.nome} foi excluído.`);
    } catch {
      setAviso('Não foi possível excluir o produto. Tente novamente.');
    }
  }

  return (
    <DashboardLayout>
      <section className="dash-section hist-page">
        <h1 className="dash-section__title">Histórico</h1>
        <p className="dash-section__subtitle">Cadastre e acompanhe seus produtos.</p>

        <div className="hist-layout">
          <section className="hist-panel" aria-labelledby="hist-form-title">
            <h2 id="hist-form-title" className="hist-panel__title">{editandoId === null ? 'Novo produto' : 'Editar produto'}</h2>
            <form className="hist-form" onSubmit={enviarFormulario}>
              <FormInput id="hist-nome" label="Nome" name="nome" required value={form.nome} onChange={alterarCampo} placeholder="Ex.: Geladeira" />
              <FormInput id="hist-categoria" label="Categoria" name="categoria" required value={form.categoria} onChange={alterarCampo} placeholder="Ex.: Eletrodoméstico" />
              <FormInput id="hist-valor" label="Valor (R$)" name="valor" type="number" min="0" step="0.01" required value={form.valor} onChange={alterarCampo} placeholder="0,00" />
              <FormInput id="hist-quantidade" label="Quantidade" name="quantidade" type="number" min="0" step="1" required value={form.quantidade} onChange={alterarCampo} placeholder="0" />
              <div className="hist-form__actions">
                <Button variant="submit" type="submit">{editandoId === null ? 'Cadastrar produto' : 'Salvar alterações'}</Button>
                {editandoId !== null && <Button variant="outline" onClick={limparFormulario}>Cancelar edição</Button>}
              </div>
            </form>
            {aviso && <p className="hist-notice" role="status">{aviso}</p>}
          </section>

          <section className="hist-panel" aria-labelledby="hist-list-title">
            <div className="hist-panel__heading">
              <h2 id="hist-list-title" className="hist-panel__title">Produtos <span>{produtos.length}</span></h2>
              <label className="hist-search">
                <span>Buscar produto</span>
                <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Nome ou categoria" />
              </label>
            </div>
            {filtrados.length === 0 ? (
              <p className="hist-empty">{produtos.length ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado. Use o formulário para adicionar o primeiro.'}</p>
            ) : (
              <div className="hist-table-wrap">
                <table className="hist-table">
                  <thead><tr><th>Produto</th><th>Categoria</th><th>Valor</th><th>Qtd.</th><th>Ações</th></tr></thead>
                  <tbody>{filtrados.map((produto) => (
                    <tr key={produto.id} className={produto.id === editandoId ? 'hist-table__row--editing' : ''}>
                      <td data-label="Produto">{produto.nome}</td>
                      <td data-label="Categoria">{produto.categoria}</td>
                      <td data-label="Valor">R$ {Number(produto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td data-label="Quantidade">{produto.quantidade}</td>
                      <td data-label="Ações"><div className="hist-row-actions">
                        <Button variant="action" onClick={() => iniciarEdicao(produto)}><i className="bi bi-pencil" aria-hidden="true"></i><span>Editar</span></Button>
                        <Button variant="action" className="hist-btn--delete" onClick={() => excluir(produto)}><i className="bi bi-trash" aria-hidden="true"></i><span>Excluir</span></Button>
                      </div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Historico;
