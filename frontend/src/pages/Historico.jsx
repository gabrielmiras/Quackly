import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import historicoService from '../services/historicoService.js';

function agoraLocal() {
  const data = new Date();
  const doisDigitos = (valor) => String(valor).padStart(2, '0');
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
}

const FORM_VAZIO = { tipo: 'ENTRADA', valor: '', nome: '', dataHora: '' };

function formatarDataHora(valor) {
  if (!valor) return '—';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(data).replace(',', ' às');
}

function ordenarPorData(movimentacoes) {
  return [...movimentacoes].sort((a, b) => String(b.dataHora || '').localeCompare(String(a.dataHora || '')));
}

function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [form, setForm] = useState(() => ({ ...FORM_VAZIO, dataHora: agoraLocal() }));
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState('');
  const [agora, setAgora] = useState(agoraLocal);
  const [dataHoraAlterada, setDataHoraAlterada] = useState(false);

  useEffect(() => {
    historicoService.listar().then((dados) => {
      setMovimentacoes(ordenarPorData(dados));
      if (historicoService.usandoFallbackLocal()) {
        setAviso('API indisponível. As movimentações ficam salvas neste navegador.');
      }
    }).catch(() => setAviso('Não foi possível carregar as movimentações.'));
  }, []);

  useEffect(() => {
    const intervalo = window.setInterval(() => setAgora(agoraLocal()), 1000);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (editandoId === null && !dataHoraAlterada) {
      setForm((atual) => ({ ...atual, dataHora: agora }));
    }
  }, [agora, dataHoraAlterada, editandoId]);

  const filtradas = useMemo(() => movimentacoes.filter((item) => {
    const nome = item.nome?.trim() || (item.tipo === 'ENTRADA' ? 'Entrada' : 'Saída');
    const tipoBusca = item.tipo === 'ENTRADA' ? 'entrada' : 'saida';
    return `${nome} ${tipoBusca}`.toLowerCase().includes(busca.trim().toLowerCase());
  }), [movimentacoes, busca]);

  function alterarCampo(event) {
    setForm((atual) => ({ ...atual, [event.target.name]: event.target.value }));
    if (event.target.name === 'dataHora') setDataHoraAlterada(true);
  }

  function limparFormulario() {
    setForm({ ...FORM_VAZIO, dataHora: agoraLocal() });
    setEditandoId(null);
    setDataHoraAlterada(false);
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setAviso('');
    const dataHora = editandoId !== null || dataHoraAlterada ? form.dataHora : null;
    if (dataHora && dataHora > agoraLocal()) {
      setAviso('A data e hora não podem estar no futuro.');
      return;
    }
    const dados = { ...form, nome: form.nome.trim(), valor: Number(form.valor), dataHora };
    try {
      if (editandoId === null) {
        const criada = await historicoService.criar(dados);
        setMovimentacoes((atuais) => ordenarPorData([...atuais, criada]));
        const modoLocal = historicoService.usandoFallbackLocal() ? ' Salva neste navegador.' : '';
        setAviso(`${criada.nome || (criada.tipo === 'ENTRADA' ? 'Entrada' : 'Saída')} registrada.${modoLocal}`);
      } else {
        const atualizada = await historicoService.atualizar(editandoId, dados);
        setMovimentacoes((atuais) => ordenarPorData(atuais.map((item) => item.id === editandoId ? atualizada : item)));
        setAviso('Movimentação atualizada.');
      }
      limparFormulario();
    } catch {
      setAviso('Não foi possível salvar a movimentação. Tente novamente.');
    }
  }

  function iniciarEdicao(item) {
    setForm({ nome: item.nome || '', tipo: item.tipo, valor: String(item.valor), dataHora: item.dataHora?.slice(0, 19) || agoraLocal() });
    setEditandoId(item.id);
    setDataHoraAlterada(true);
    setAviso('');
  }

  async function excluir(item) {
    const descricao = item.nome?.trim() || (item.tipo === 'ENTRADA' ? 'Entrada' : 'Saída');
    if (!window.confirm(`Excluir a movimentação ${descricao}?`)) return;
    try {
      await historicoService.remover(item.id);
      setMovimentacoes((atuais) => atuais.filter((atual) => atual.id !== item.id));
      if (editandoId === item.id) limparFormulario();
      setAviso('Movimentação excluída.');
    } catch {
      setAviso('Não foi possível excluir a movimentação. Tente novamente.');
    }
  }

  return (
    <DashboardLayout>
      <section className="dash-section hist-page">
        <h1 className="dash-section__title">Histórico</h1>
        <p className="dash-section__subtitle">Cadastre e acompanhe suas entradas e saídas.</p>

        <div className="hist-layout">
          <section className="hist-panel" aria-labelledby="hist-form-title">
            <h2 id="hist-form-title" className="hist-panel__title">{editandoId === null ? 'Nova movimentação' : 'Editar movimentação'}</h2>
            <form className="hist-form" onSubmit={enviarFormulario}>
              <div className="qk-field">
                <label htmlFor="hist-tipo">Tipo da Movimentação <span>*</span></label>
                <select id="hist-tipo" name="tipo" required value={form.tipo} onChange={alterarCampo}>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>
              <FormInput id="hist-data-hora" label="Data e Hora" name="dataHora" type="datetime-local" step="1" max={agora} required value={form.dataHora} onChange={alterarCampo} />
              <FormInput id="hist-valor" label="Valor (R$)" name="valor" type="number" min="0.01" step="0.01" required value={form.valor} onChange={alterarCampo} placeholder="0,00" />
              <FormInput id="hist-nome" label="Nome / Descrição" name="nome" value={form.nome} onChange={alterarCampo} placeholder="Ex.: Salário, Mercado, Aluguel (opcional)" />
              <div className="hist-form__actions">
                <Button variant="submit" type="submit">{editandoId === null ? 'Registrar movimentação' : 'Salvar alterações'}</Button>
                {editandoId !== null && <Button variant="outline" onClick={limparFormulario}>Cancelar edição</Button>}
              </div>
            </form>
            {aviso && <p className="hist-notice" role="status">{aviso}</p>}
          </section>

          <section className="hist-panel" aria-labelledby="hist-list-title">
            <div className="hist-panel__heading">
              <h2 id="hist-list-title" className="hist-panel__title">Movimentações <span>{movimentacoes.length}</span></h2>
              <label className="hist-search">
                <span>Buscar movimentação</span>
                <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Descrição ou tipo" />
              </label>
            </div>
            {filtradas.length === 0 ? (
              <p className="hist-empty">{movimentacoes.length ? 'Nenhuma movimentação encontrada.' : 'Nenhuma movimentação registrada. Use o formulário para adicionar a primeira.'}</p>
            ) : (
              <div className="hist-table-wrap">
                <table className="hist-table">
                  <thead><tr><th>Movimentação</th><th>Data e hora</th><th>Valor</th><th>Ações</th></tr></thead>
                  <tbody>{filtradas.map((item) => {
                    const entrada = item.tipo === 'ENTRADA';
                    const nome = item.nome?.trim() || (entrada ? 'Entrada' : 'Saída');
                    return (
                      <tr key={item.id} className={item.id === editandoId ? 'hist-table__row--editing' : ''}>
                        <td data-label="Movimentação"><span className={`hist-type hist-type--${entrada ? 'entrada' : 'saida'}`}>{entrada ? 'Entrada' : 'Saída'}</span><strong className="hist-description">{nome}</strong></td>
                        <td data-label="Data e hora">{formatarDataHora(item.dataHora)}</td>
                        <td data-label="Valor"><span className={`hist-amount hist-amount--${entrada ? 'entrada' : 'saida'}`}>{entrada ? '+' : '−'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></td>
                        <td data-label="Ações"><div className="hist-row-actions">
                          <Button variant="action" onClick={() => iniciarEdicao(item)}><i className="bi bi-pencil" aria-hidden="true"></i><span>Editar</span></Button>
                          <Button variant="action" className="hist-btn--delete" onClick={() => excluir(item)}><i className="bi bi-trash" aria-hidden="true"></i><span>Excluir</span></Button>
                        </div></td>
                      </tr>
                    );
                  })}</tbody>
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
