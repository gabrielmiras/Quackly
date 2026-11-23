
import { useEffect, useMemo, useRef, useState } from 'react';
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
    String(b.dataHora || '').localeCompare(String(a.dataHora || ''))
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

  // Referência ao formulário para a rolagem no mobile.
  const formularioRef = useRef(null);

  useEffect(() => {
    historicoService.listar()
      .then((dados) => {
        setMovimentacoes(ordenarPorData(dados));

        if (historicoService.usandoFallbackLocal()) {
          setAviso(
            'API indisponível. As movimentações ficam salvas neste navegador.'
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
      1000
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

  // Depois que o React atualiza o formulário para edição,
  // leva o usuário até ele em telas menores.
  useEffect(() => {
    if (editandoId === null) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;

    if (!mobile) return;

    const frame = window.requestAnimationFrame(() => {
      formularioRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editandoId]);

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
    [movimentacoes, busca]
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
          ordenarPorData([...atuais, criada])
        );

        const modoLocal = historicoService.usandoFallbackLocal()
          ? ' Salva neste navegador.'
          : '';

        setAviso(
          `${criada.nome || (criada.tipo === 'ENTRADA' ? 'Entrada' : 'Saída')} registrada.${modoLocal}`
        );
      } else {
        const atualizada = await historicoService.atualizar(
          editandoId,
          dados
        );

        setMovimentacoes((atuais) =>
          ordenarPorData(
            atuais.map((item) =>
              item.id === editandoId ? atualizada : item
            )
          )
        );

        setAviso('Movimentação atualizada.');
      }

      limparFormulario();
    } catch {
      setAviso(
        'Não foi possível salvar a movimentação. Tente novamente.'
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
        atuais.filter((atual) => atual.id !== item.id)
      );

      if (editandoId === item.id) {
        limparFormulario();
      }

      setAviso('Movimentação excluída.');
    } catch {
      setAviso(
        'Não foi possível excluir a movimentação. Tente novamente.'
      );
    }
  }

  const campoSelect = `
    w-full rounded-xl border px-4 py-3
    text-sm font-semibold outline-none transition-all
    focus:ring-[3px]
    ${
      form.tipo === 'ENTRADA'
        ? 'border-[#86efac] bg-[#f0fdf4] text-[#166534] focus:border-[#16a34a] focus:ring-[#16a34a]/15'
        : 'border-[#fda4af] bg-[#fff1f2] text-[#9f1239] focus:border-[#e11d48] focus:ring-[#e11d48]/15'
    }
  `;

  return (
    <DashboardLayout>
      <section className="mb-[60px] scroll-mt-[110px] text-[#142238]">

        {/* CABEÇALHO */}
        <div className="mb-7">
          <h1 className="text-[1.8rem] font-bold tracking-tight">
            Histórico
          </h1>

          <p className="mt-1 text-sm text-[#475569]">
            Cadastre e acompanhe suas entradas e saídas.
          </p>
        </div>

        <div className="
          grid grid-cols-1 items-start gap-6
          min-[992px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]
        ">

          {/* FORMULÁRIO */}
          <section
            ref={formularioRef}
            className="
              min-w-0 scroll-mt-[110px]
              rounded-2xl border border-[#d5dee9]
              bg-white p-5
              shadow-[0_5px_20px_rgba(20,34,56,0.06)]
              sm:p-6
            "
          >
            <h2 className="mb-4 text-xl font-bold tracking-tight text-[#142238]">
              {editandoId === null
                ? 'Nova movimentação'
                : 'Editar movimentação'}
            </h2>

            <form
              className="grid gap-3"
              onSubmit={enviarFormulario}
            >
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="hist-tipo"
                  className="text-sm font-semibold text-[#1e293b]"
                >
                  Tipo da movimentação{' '}
                  <span className="text-[#d79a16]">*</span>
                </label>

                <select
                  id="hist-tipo"
                  name="tipo"
                  required
                  value={form.tipo}
                  onChange={alterarCampo}
                  className={campoSelect}
                >
                  <option
                    value="ENTRADA"
                    className="bg-[#f0fdf4] font-semibold text-[#166534]"
                  >
                    Entrada
                  </option>

                  <option
                    value="SAIDA"
                    className="bg-[#fff1f2] font-semibold text-[#9f1239]"
                  >
                    Saída
                  </option>
                </select>
              </div>

              <FormInput
                variant="light"
                id="hist-data-hora"
                label="Data e hora"
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

              <div className="mt-0 grid gap-2">
                <Button
                  variant="submit"
                  type="submit"
                  className="
                    !rounded-full !border-[#d6a900]
                    !py-4 !text-sm
                    shadow-[0_4px_12px_rgba(214,169,0,0.18)]
                    hover:!-translate-y-0.5
                  "
                >
                  {editandoId === null
                    ? 'Registrar movimentação'
                    : 'Salvar alterações'}
                </Button>

                {editandoId !== null && (
                  <Button
                    variant="submit"
                    onClick={limparFormulario}
                    className="
                      !w-full !h-[59px]
                      !rounded-full
                      !border !border-[#fecaca]
                      !bg-white
                      !px-4 !py-0
                      !text-sm !font-semibold
                      !text-[#dc2626]
                      hover:!bg-[#fef2f2]
                      hover:!border-[#fca5a5]
                      shadow-none
                      transition-colors duration-200
                    "
                  >
                    Cancelar edição
                  </Button>
                )}
              </div>
            </form>

            {aviso && (
              <p
                className="
                  mt-5 rounded-xl border border-[#bbf7d0]
                  bg-[#f0fdf4] px-4 py-3
                  text-sm font-medium text-[#166534]
                "
                role="status"
              >
                {aviso}
              </p>
            )}
          </section>

          {/* LISTA DE MOVIMENTAÇÕES */}
          <section className="
            min-w-0 rounded-2xl border border-[#d5dee9]
            bg-white p-5
            shadow-[0_5px_20px_rgba(20,34,56,0.06)]
            sm:p-6
          ">
            <div className="
              mb-6 flex flex-col gap-4
              sm:flex-row sm:items-center sm:justify-between
            ">
              <h2 className="text-xl font-bold tracking-tight text-[#142238]">
                Movimentações
                <span className="ml-2 text-sm font-semibold text-[#475569]">
                  {movimentacoes.length}
                </span>
              </h2>

              <label className="
                grid min-w-0 gap-2
                text-sm font-semibold text-[#334155]
                sm:w-[230px] sm:shrink-0
              ">
                <span>Buscar movimentação</span>

                <input
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Descrição ou tipo"
                  className="
                    w-full rounded-xl border border-[#cbd5e1]
                    bg-white px-4 py-3
                    text-sm font-normal text-[#1e293b]
                    outline-none transition-all
                    placeholder:text-[#64748b]
                    focus:border-[#4775bd]
                    focus:ring-[3px] focus:ring-[#4775bd]/15
                  "
                />
              </label>
            </div>

            {filtradas.length === 0 ? (
              <p className="py-7 text-sm font-medium text-[#475569]">
                {movimentacoes.length
                  ? 'Nenhuma movimentação encontrada.'
                  : 'Nenhuma movimentação registrada. Use o formulário para adicionar a primeira.'}
              </p>
            ) : (
              <>
                {/* VISUALIZAÇÃO MOBILE */}
                <div className="grid gap-3 md:hidden">
                  {filtradas.map((item) => {
                    const entrada = item.tipo === 'ENTRADA';
                    const nome =
                      item.nome?.trim() ||
                      (entrada ? 'Entrada' : 'Saída');

                    return (
                      <div
                        key={item.id}
                        className={`
                          rounded-xl border border-[#e2e8f0]
                          bg-white p-4
                          ${item.id === editandoId ? 'border-[#eab308] bg-[#fffbeb]' : ''}
                        `}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className={`
                            inline-flex rounded-full px-3 py-1.5
                            text-xs font-bold
                            ${entrada
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : 'bg-[#ffe4e6] text-[#9f1239]'
                            }
                          `}>
                            {entrada ? 'Entrada' : 'Saída'}
                          </span>

                          <span className={`
                            whitespace-nowrap text-sm font-bold
                            ${entrada ? 'text-[#047857]' : 'text-[#be123c]'}
                          `}>
                            {entrada ? '+' : '−'} R${' '}
                            {Number(item.valor).toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <p className="mb-1 break-words font-bold text-[#142238]">
                          {nome}
                        </p>

                        <p className="mb-4 text-xs text-[#64748b]">
                          {formatarDataHora(item.dataHora)}
                        </p>

                        <div className="flex gap-2 border-t border-[#e2e8f0] pt-3">
                          <Button
                            variant="action"
                            onClick={() => iniciarEdicao(item)}
                            className="
                              !flex-1 !rounded-lg !border-0
                              !bg-[#23385d] !px-2 !py-2.5
                              !text-xs !font-semibold !text-white
                            "
                          >
                            <Pencil size={14} className="mr-1 inline" />
                            Editar
                          </Button>

                          <Button
                            variant="action"
                            onClick={() => excluir(item)}
                            className="
                              !flex-1 !rounded-lg !border
                              !border-[#fecaca] !bg-white
                              !px-2 !py-2.5 !text-xs
                              !font-semibold !text-[#b91c1c]
                            "
                          >
                            <Trash2 size={14} className="mr-1 inline" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* VISUALIZAÇÃO DESKTOP */}
                <div className="hidden w-full overflow-x-auto md:block">
                  <table className="w-full min-w-[620px] border-collapse text-left">
                    <thead>
                      <tr>
                        {[
                          'Movimentação',
                          'Data e hora',
                          'Valor',
                          'Ações',
                        ].map((titulo) => (
                          <th
                            key={titulo}
                            className="
                              border-b border-[#dbe3ec]
                              px-3 py-4
                              text-xs font-bold uppercase
                              tracking-wider text-[#334155]
                            "
                          >
                            {titulo}
                          </th>
                        ))}
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
                              transition-colors
                              hover:bg-[#f8fafc]
                              ${item.id === editandoId ? 'bg-[#fffbeb]' : ''}
                              last:[&>td]:border-b-0
                            `}
                          >
                            <td className="
                              border-b border-[#e2e8f0]
                              px-3 py-4 text-sm text-[#334155]
                            ">
                              <span className={`
                                mr-2 inline-flex rounded-full
                                px-3 py-1.5 text-xs font-bold
                                ${entrada
                                  ? 'bg-[#dcfce7] text-[#166534]'
                                  : 'bg-[#ffe4e6] text-[#9f1239]'
                                }
                              `}>
                                {entrada ? 'Entrada' : 'Saída'}
                              </span>

                              <strong className="font-bold text-[#142238]">
                                {nome}
                              </strong>
                            </td>

                            <td className="
                              whitespace-nowrap border-b border-[#e2e8f0]
                              px-3 py-4 text-sm font-medium text-[#334155]
                            ">
                              {formatarDataHora(item.dataHora)}
                            </td>

                            <td className="
                              border-b border-[#e2e8f0]
                              px-3 py-4 text-sm
                            ">
                              <span className={`
                                whitespace-nowrap font-bold
                                ${entrada
                                  ? 'text-[#047857]'
                                  : 'text-[#be123c]'
                                }
                              `}>
                                {entrada ? '+' : '−'} R${' '}
                                {Number(item.valor).toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </td>

                            <td className="
                              border-b border-[#e2e8f0]
                              px-3 py-4
                            ">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="action"
                                  onClick={() => iniciarEdicao(item)}
                                  className="
                                    !rounded-full !border-0
                                    !bg-[#23385d] !px-4 !py-2
                                    !text-xs !font-semibold !text-white
                                    hover:!bg-[#304b75]
                                  "
                                >
                                  <Pencil size={14} className="mr-1 inline" />
                                  Editar
                                </Button>

                                <Button
                                  variant="action"
                                  onClick={() => excluir(item)}
                                  className="
                                    !rounded-full !border !border-[#fecaca]
                                    !bg-white !px-4 !py-2
                                    !text-xs !font-semibold !text-[#b91c1c]
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
              </>
            )}
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Historico;
