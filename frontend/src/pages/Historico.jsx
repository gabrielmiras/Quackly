
import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import historicoService from '../services/historicoService.js';

function agoraLocal() {
  const data = new Date();
  const doisDigitos = (valor) => String(valor).padStart(2, '0');

  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
}

const FORM_VAZIO = {
  tipo: 'ENTRADA',
  valor: '',
  nome: '',
  dataHora: '',
};

function formatarDataHora(valor) {
  if (!valor) return '—';

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data).replace(',', ' às');
}

function ordenarPorData(movimentacoes) {
  return [...movimentacoes].sort((a, b) =>
    String(b.dataHora || '').localeCompare(String(a.dataHora || '')),
  );
}

function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [form, setForm] = useState(() => ({
    ...FORM_VAZIO,
    dataHora: agoraLocal(),
  }));
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState('');
  const [agora, setAgora] = useState(agoraLocal);
  const [dataHoraAlterada, setDataHoraAlterada] = useState(false);

  useEffect(() => {
    historicoService.listar()
      .then((dados) => {
        setMovimentacoes(ordenarPorData(dados));

        if (historicoService.usandoFallbackLocal()) {
          setAviso(
            'API indisponível. As movimentações ficam salvas neste navegador.',
          );
        }
      })
      .catch(() => {
        setAviso('Não foi possível carregar as movimentações.');
      });
  }, []);

  useEffect(() => {
    const intervalo = window.setInterval(
      () => setAgora(agoraLocal()),
      1000,
    );

    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (editandoId === null && !dataHoraAlterada) {
      setForm((atual) => ({
        ...atual,
        dataHora: agora,
      }));
    }
  }, [agora, dataHoraAlterada, editandoId]);

  const filtradas = useMemo(
    () =>
      movimentacoes.filter((item) => {
        const nome =
          item.nome?.trim() ||
          (item.tipo === 'ENTRADA' ? 'Entrada' : 'Saída');

        const tipoBusca =
          item.tipo === 'ENTRADA' ? 'entrada' : 'saida';

        return `${nome} ${tipoBusca}`
          .toLowerCase()
          .includes(busca.trim().toLowerCase());
      }),
    [movimentacoes, busca],
  );

  function alterarCampo(event) {
    setForm((atual) => ({
      ...atual,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === 'dataHora') {
      setDataHoraAlterada(true);
    }
  }

  function limparFormulario() {
    setForm({
      ...FORM_VAZIO,
      dataHora: agoraLocal(),
    });
    setEditandoId(null);
    setDataHoraAlterada(false);
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setAviso('');

    const dataHora = form.dataHora;

    if (dataHora && dataHora > agoraLocal()) {
      setAviso('A data e hora não podem estar no futuro.');
      return;
    }

    const dados = {
      ...form,
      nome: form.nome.trim(),
      valor: Number(form.valor),
      dataHora,
    };

    try {
      if (editandoId === null) {
        const criada = await historicoService.criar(dados);

        setMovimentacoes((atuais) =>
          ordenarPorData([...atuais, criada]),
        );

        const modoLocal = historicoService.usandoFallbackLocal()
          ? ' Salva neste navegador.'
          : '';

        setAviso(
          `${criada.nome || (criada.tipo === 'ENTRADA' ? 'Entrada' : 'Saída')} registrada.${modoLocal}`,
        );
      } else {
        const atualizada = await historicoService.atualizar(
          editandoId,
          dados,
        );

        setMovimentacoes((atuais) =>
          ordenarPorData(
            atuais.map((item) =>
              item.id === editandoId ? atualizada : item,
            ),
          ),
        );

        setAviso('Movimentação atualizada.');
      }

      limparFormulario();
    } catch {
      setAviso(
        'Não foi possível salvar a movimentação. Tente novamente.',
      );
    }
  }

  function iniciarEdicao(item) {
    setForm({
      nome: item.nome || '',
      tipo: item.tipo,
      valor: String(item.valor),
      dataHora: item.dataHora?.slice(0, 19) || agoraLocal(),
    });

    setEditandoId(item.id);
    setDataHoraAlterada(true);
    setAviso('');
  }

  async function excluir(item) {
    const descricao =
      item.nome?.trim() ||
      (item.tipo === 'ENTRADA' ? 'Entrada' : 'Saída');

    if (!window.confirm(`Excluir a movimentação ${descricao}?`)) {
      return;
    }

    try {
      await historicoService.remover(item.id);

      setMovimentacoes((atuais) =>
        atuais.filter((atual) => atual.id !== item.id),
      );

      if (editandoId === item.id) {
        limparFormulario();
      }

      setAviso('Movimentação excluída.');
    } catch {
      setAviso(
        'Não foi possível excluir a movimentação. Tente novamente.',
      );
    }
  }

  const campoSelect = `
    w-full rounded-[10px] border border-[#cbd5e1]
    bg-white px-3 py-[11px] text-sm text-[#1e293b]
    outline-none transition-colors
    focus:border-[#d79a16]
    focus:ring-[3px] focus:ring-[#ffcb61]/35
  `;

  return (
    <DashboardLayout>
      <section className="mb-[60px] scroll-mt-[110px] text-[#1e293b]">
        <h1 className="mb-[5px] text-[1.8rem] font-bold">
          Histórico
        </h1>

        <p className="mb-[25px] text-base text-[#64748b]">
          Cadastre e acompanhe suas entradas e saídas.
        </p>

        <div className="
          grid grid-cols-1 items-start gap-6
          min-[992px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]
        ">
          {/* Formulário */}
          <section className="
            min-w-0 rounded-[18px] border border-[#e2e8f0]
            bg-white p-[18px] shadow-[0_8px_24px_rgba(25,40,65,0.06)]
            sm:p-6
          ">
            <h2 className="mb-5 text-[1.15rem] font-bold">
              {editandoId === null
                ? 'Nova movimentação'
                : 'Editar movimentação'}
            </h2>

            <form
              className="grid gap-4"
              onSubmit={enviarFormulario}
            >
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="hist-tipo"
                  className="text-[0.85rem] font-semibold text-[#334155]"
                >
                  Tipo da Movimentação <span className="text-[#d79a16]">*</span>
                </label>

                <select
                  id="hist-tipo"
                  name="tipo"
                  required
                  value={form.tipo}
                  onChange={alterarCampo}
                  className={campoSelect}
                >
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>

              <FormInput
                variant="light"
                id="hist-data-hora"
                label="Data e Hora"
                name="dataHora"
                type="datetime-local"
                step="1"
                max={agora}
                required
                value={form.dataHora}
                onChange={alterarCampo}
              />

              <FormInput
                variant="light"
                id="hist-valor"
                label="Valor (R$)"
                name="valor"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.valor}
                onChange={alterarCampo}
                placeholder="0,00"
              />

              <FormInput
                variant="light"
                id="hist-nome"
                label="Nome / Descrição"
                name="nome"
                value={form.nome}
                onChange={alterarCampo}
                placeholder="Ex.: Salário, Mercado, Aluguel (opcional)"
              />

              <div className="mt-1 grid gap-[10px]">
                <Button variant="submit" type="submit">
                  {editandoId === null
                    ? 'Registrar movimentação'
                    : 'Salvar alterações'}
                </Button>

                {editandoId !== null && (
                  <Button
                    variant="outline"
                    onClick={limparFormulario}
                    className="!border-[#cbd5e1] !text-[#334155]"
                  >
                    Cancelar edição
                  </Button>
                )}
              </div>
            </form>

            {aviso && (
              <p
                className="
                  mt-4 rounded-[10px] bg-[#dcfce7]
                  px-[14px] py-[11px] text-[0.9rem] text-[#14532d]
                "
                role="status"
              >
                {aviso}
              </p>
            )}
          </section>

          {/* Lista de movimentações */}
          <section className="
            min-w-0 rounded-[18px] border border-[#e2e8f0]
            bg-white p-[18px] shadow-[0_8px_24px_rgba(25,40,65,0.06)]
            sm:p-6
          ">
            <div className="
              mb-5 flex flex-wrap items-center
              justify-between gap-4
            ">
              <h2 className="text-[1.15rem] font-bold">
                Movimentações
                <span className="ml-[6px] text-[0.9rem] font-medium text-[#64748b]">
                  {movimentacoes.length}
                </span>
              </h2>

              <label className="
                grid min-w-0 flex-1 gap-[5px]
                text-[0.8rem] font-semibold text-[#64748b]
                sm:min-w-[220px] sm:flex-none
              ">
                <span>Buscar movimentação</span>

                <input
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Descrição ou tipo"
                  className={`
                    w-full rounded-[10px] border border-[#cbd5e1]
                    bg-white px-3 py-[11px]
                    text-sm font-normal text-[#1e293b]
                    outline-none transition-colors
                    focus:border-[#d79a16]
                    focus:ring-[3px] focus:ring-[#ffcb61]/35
                  `}
                />
              </label>
            </div>

            {filtradas.length === 0 ? (
              <p className="py-[22px] text-[#64748b]">
                {movimentacoes.length
                  ? 'Nenhuma movimentação encontrada.'
                  : 'Nenhuma movimentação registrada. Use o formulário para adicionar a primeira.'}
              </p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr>
                      {['Movimentação', 'Data e hora', 'Valor', 'Ações'].map(
                        (titulo) => (
                          <th
                            key={titulo}
                            className="
                              border-b border-[#e2e8f0]
                              px-[10px] py-3
                              text-[0.76rem] font-semibold
                              uppercase tracking-[0.04em]
                              text-[#64748b]
                            "
                          >
                            {titulo}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {filtradas.map((item) => {
                      const entrada = item.tipo === 'ENTRADA';
                      const nome =
                        item.nome?.trim() ||
                        (entrada ? 'Entrada' : 'Saída');

                      return (
                        <tr
                          key={item.id}
                          className={`
                            ${item.id === editandoId ? 'bg-[#fffbeb]' : ''}
                            last:[&>td]:border-b-0
                          `}
                        >
                          <td className="border-b border-[#f1f5f9] px-[10px] py-[14px] text-[0.9rem] text-[#334155]">
                            <span className={`
                              mr-[9px] inline-flex rounded-full
                              px-[9px] py-1 text-[0.72rem] font-bold
                              ${entrada
                                ? 'bg-[#dcfce7] text-[#166534]'
                                : 'bg-[#ffe4e6] text-[#9f1239]'
                              }
                            `}>
                              {entrada ? 'Entrada' : 'Saída'}
                            </span>

                            <strong className="font-semibold text-[#1e293b]">
                              {nome}
                            </strong>
                          </td>

                          <td className="border-b border-[#f1f5f9] px-[10px] py-[14px] text-[0.9rem] text-[#334155]">
                            {formatarDataHora(item.dataHora)}
                          </td>

                          <td className="border-b border-[#f1f5f9] px-[10px] py-[14px] text-[0.9rem]">
                            <span className={`
                              whitespace-nowrap font-bold
                              ${entrada ? 'text-[#15803d]' : 'text-[#be123c]'}
                            `}>
                              {entrada ? '+' : '−'} R${' '}
                              {Number(item.valor).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </td>

                          <td className="border-b border-[#f1f5f9] px-[10px] py-[14px]">
                            <div className="flex gap-[7px]">
                              <Button
                                variant="action"
                                onClick={() => iniciarEdicao(item)}
                                className="!rounded-lg !px-[10px] !py-[7px] !text-[0.8rem]"
                              >
                                <Pencil size={14} className="mr-1 inline" />
                                Editar
                              </Button>

                              <Button
                                variant="action"
                                onClick={() => excluir(item)}
                                className="
                                  !rounded-lg !border !border-[#fecaca]
                                  !bg-white !px-[10px] !py-[7px]
                                  !text-[0.8rem] !text-[#b91c1c]
                                  hover:!bg-[#fef2f2]
                                "
                              >
                                <Trash2 size={14} className="mr-1 inline" />
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
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
