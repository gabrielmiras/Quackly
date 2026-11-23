import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Target,
  Wallet,
  Pencil,
  Trash2,
  X,
  PiggyBank,
  CalendarDays,
  ArrowDownToLine,
  CheckCircle2,
} from 'lucide-react';

const CHAVE_METAS = 'quackly_metas';

function obterChaveMetas() {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuarioLogado') || 'null'
    );

    return `${CHAVE_METAS}_${usuario?.id ?? 'local'}`;
  } catch {
    return `${CHAVE_METAS}_local`;
  }
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function carregarMetas() {
  try {
    return JSON.parse(localStorage.getItem(obterChaveMetas()) || '[]');
  } catch {
    return [];
  }
}

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  valorObjetivo: '',
  valorGuardado: '',
  prazo: '',
};

function Metas() {
  const [metas, setMetas] = useState(carregarMetas);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalValor, setModalValor] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [valorAdicional, setValorAdicional] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    localStorage.setItem(obterChaveMetas(), JSON.stringify(metas));
  }, [metas]);

  const resumo = useMemo(() => {
    const totalGuardado = metas.reduce(
      (total, meta) => total + Number(meta.valorGuardado || 0),
      0
    );

    const totalObjetivos = metas.reduce(
      (total, meta) => total + Number(meta.valorObjetivo || 0),
      0
    );

    return {
      quantidade: metas.filter(
        (meta) => Number(meta.valorGuardado) < Number(meta.valorObjetivo)
      ).length,
      concluidas: metas.filter(
        (meta) => Number(meta.valorGuardado) >= Number(meta.valorObjetivo)
      ).length,
      totalGuardado,
      totalObjetivos,
    };
  }, [metas]);

  function abrirCadastro() {
    setForm(FORM_VAZIO);
    setMetaSelecionada(null);
    setErro('');
    setModalAberto(true);
  }

  function abrirEdicao(meta) {
    setMetaSelecionada(meta);
    setForm({
      nome: meta.nome,
      descricao: meta.descricao || '',
      valorObjetivo: String(meta.valorObjetivo),
      valorGuardado: String(meta.valorGuardado),
      prazo: meta.prazo || '',
    });
    setErro('');
    setModalAberto(true);
  }

  function salvarMeta(event) {
    event.preventDefault();

    const objetivo = Number(form.valorObjetivo);
    const guardado = Number(form.valorGuardado || 0);

    if (!form.nome.trim()) {
      setErro('Informe o nome da sua meta.');
      return;
    }

    if (!Number.isFinite(objetivo) || objetivo <= 0) {
      setErro('Informe um valor objetivo válido.');
      return;
    }

    if (!Number.isFinite(guardado) || guardado < 0) {
      setErro('Informe um valor guardado válido.');
      return;
    }

    if (guardado > objetivo) {
      setErro('O valor guardado não pode ser maior que o objetivo.');
      return;
    }

    const dados = {
      id: metaSelecionada?.id ?? `${Date.now()}`,
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      valorObjetivo: objetivo,
      valorGuardado: guardado,
      prazo: form.prazo,
    };

    if (metaSelecionada) {
      setMetas((atuais) =>
        atuais.map((meta) =>
          meta.id === metaSelecionada.id ? dados : meta
        )
      );
    } else {
      setMetas((atuais) => [...atuais, dados]);
    }

    setModalAberto(false);
    setForm(FORM_VAZIO);
    setMetaSelecionada(null);
    setErro('');
  }

  function abrirAdicao(meta) {
    setMetaSelecionada(meta);
    setValorAdicional('');
    setErro('');
    setModalValor(true);
  }

  function adicionarValor(event) {
    event.preventDefault();

    const valor = Number(valorAdicional);

    if (!Number.isFinite(valor) || valor <= 0) {
      setErro('Informe um valor maior que zero.');
      return;
    }

    setMetas((atuais) =>
      atuais.map((meta) =>
        meta.id === metaSelecionada.id
          ? {
              ...meta,
              valorGuardado: Math.min(
                Number(meta.valorGuardado) + valor,
                Number(meta.valorObjetivo)
              ),
            }
          : meta
      )
    );

    setModalValor(false);
    setValorAdicional('');
    setMetaSelecionada(null);
    setErro('');
  }

  function excluirMeta(id) {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta meta?'
    );

    if (confirmar) {
      setMetas((atuais) => atuais.filter((meta) => meta.id !== id));
    }
  }

  const inputClass = `
    w-full rounded-xl border border-[#dbe2ea]
    bg-white px-4 py-3 text-sm text-[#142238]
    outline-none transition
    placeholder:text-[#64748b]
    focus:border-[#d6a441] focus:ring-2
    focus:ring-[#d6a441]/15
  `;

  return (
    <section
      id="metas"
      className="scroll-mt-[110px] text-[#142238]"
      style={{ paddingTop: '64px' }}
    >
      {/* Cabeçalho */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-[1.8rem] font-bold">
            Minhas metas
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            Transforme seus planos em conquistas.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="
            flex items-center justify-center gap-2
            !rounded-full bg-[#23385d] px-6 py-3
            text-sm font-bold text-white
            shadow-[0_4px_12px_rgba(20,34,56,0.14)]
            transition-all duration-200
            hover:-translate-y-0.5 hover:bg-[#304b75]
            hover:shadow-[0_6px_16px_rgba(20,34,56,0.20)]
          "
        >
          <Plus size={18} />
          Nova meta
        </button>
      </div>

      {/* Resumo */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ResumoCard
          icon={Target}
          label="Metas em andamento"
          valor={resumo.quantidade}
          detalhe={`${resumo.concluidas} concluída(s)`}
          cor="#d6a441"
        />

        <ResumoCard
          icon={Wallet}
          label="Total guardado"
          valor={formatarMoeda(resumo.totalGuardado)}
          detalhe="Somatório das suas metas"
          cor="#059669"
        />

        <ResumoCard
          icon={PiggyBank}
          label="Total dos objetivos"
          valor={formatarMoeda(resumo.totalObjetivos)}
          detalhe="Valor necessário para todas as metas"
          cor="#4775bd"
        />
      </div>

      {/* Lista de metas */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Seus objetivos</h3>
        <span className="text-xs text-[#64748b]">
          {metas.length} {metas.length === 1 ? 'meta cadastrada' : 'metas cadastradas'}
        </span>
      </div>

      {metas.length === 0 ? (
        <div className="
          flex flex-col items-center justify-center
          rounded-2xl border border-dashed border-[#cbd5e1]
          bg-[#f8fafc] px-5 py-14 text-center
        ">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf0f7] text-[#475569]">
            <Target size={30} />
          </div>

          <h3 className="text-lg font-bold">
            Você ainda não tem metas
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[#475569]">
            Que tal começar criando um objetivo? Pode ser uma viagem,
            um novo computador ou qualquer sonho que queira realizar.
          </p>

          <button
            type="button"
            onClick={abrirCadastro}
          className="
            flex items-center justify-center gap-2
            !rounded-full bg-[#23385d] px-6 py-3
            text-sm font-bold text-white
            shadow-[0_4px_12px_rgba(20,34,56,0.14)]
            transition-all duration-200
            hover:-translate-y-0.5 hover:bg-[#304b75]
            hover:shadow-[0_6px_16px_rgba(20,34,56,0.20)]
          "
          >
            <Plus size={16} className="mr-2 inline" />
            Criar primeira meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {metas.map((meta) => {
            const objetivo = Number(meta.valorObjetivo);
            const guardado = Number(meta.valorGuardado);
            const porcentagem = Math.min(
              (guardado / objetivo) * 100,
              100
            );
            const concluida = guardado >= objetivo;

            return (
              <article
                key={meta.id}
                className="
                  border border-[#d5dee9]
                bg-white p-5
                  shadow-[0_4px_16px_rgba(20,34,56,0.07)]
                  transition hover:shadow-[0_8px_24px_rgba(20,34,56,0.08)]
                  sm:p-6
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f5f8] text-[#526780]">
                      {concluida ? (
                        <CheckCircle2 size={21} className="text-[#059669]" />
                      ) : (
                        <Target size={21} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-[#142238]">
                        {meta.nome}
                      </h4>
                      <p className="mt-1 text-xs text-[#64748b]">
                        {concluida ? 'Meta concluída' : 'Em andamento'}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => abrirEdicao(meta)}
                      aria-label={`Editar ${meta.nome}`}
                      className="rounded-lg p-2 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#142238]"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => excluirMeta(meta.id)}
                      aria-label={`Excluir ${meta.nome}`}
                      className="rounded-lg p-2 text-[#64748b] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {meta.descricao && (
                  <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                    {meta.descricao}
                  </p>
                )}

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#64748b]">
                      Valor guardado
                    </p>
                    <strong className="mt-1 block text-xl font-bold text-[#059669]">
                      {formatarMoeda(guardado)}
                    </strong>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#64748b]">
                      Objetivo
                    </p>
                    <strong className="mt-1 block text-sm font-semibold text-[#334155]">
                      {formatarMoeda(objetivo)}
                    </strong>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#475569]">
                      Progresso
                    </span>
                    <span className="text-sm font-bold text-[#142238]">
                      {porcentagem.toFixed(1).replace('.', ',')}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#edf1f5]">
                    <div
                      className="h-full rounded-full bg-[#10b981] transition-all duration-500"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <CalendarDays size={14} />
                    {meta.prazo
                      ? new Date(`${meta.prazo}T12:00:00`).toLocaleDateString('pt-BR')
                      : 'Sem prazo definido'}
                  </span>

                  {!concluida && (
                    <button
                      type="button"
                      onClick={() => abrirAdicao(meta)}
                      className="
                        flex items-center justify-center gap-2
                        !rounded-full bg-[#23385d] px-6 py-3
                        text-sm font-bold text-white
                        shadow-[0_4px_12px_rgba(20,34,56,0.14)]
                        transition-all duration-200
                        hover:-translate-y-0.5 hover:bg-[#304b75]
                        hover:shadow-[0_6px_16px_rgba(20,34,56,0.20)]
                      "
                    >
                      <Plus size={15} />
                      Adicionar valor
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal: criar ou editar */}
      {modalAberto && (
        <Modal onClose={() => setModalAberto(false)}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#142238]">
                {metaSelecionada ? 'Editar meta' : 'Nova meta'}
              </h3>
              <p className="mt-1 text-sm text-[#475569]">
                Defina os detalhes do seu objetivo.
              </p>
            </div>

            <BotaoFechar onClick={() => setModalAberto(false)} />
          </div>

          <form onSubmit={salvarMeta} className="flex flex-col gap-4">
            <Campo
              label="Nome da meta"
              value={form.nome}
              onChange={(valor) => setForm({ ...form, nome: valor })}
              placeholder="Ex.: Comprar um notebook"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Descrição (opcional)
              </label>
              <textarea
                value={form.descricao}
                onChange={(event) =>
                  setForm({ ...form, descricao: event.target.value })
                }
                rows={2}
                placeholder="Conte um pouco sobre seu objetivo..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <Campo
              label="Valor desejado (R$)"
              type="number"
              min="0.01"
              step="0.01"
              value={form.valorObjetivo}
              onChange={(valor) => setForm({ ...form, valorObjetivo: valor })}
              placeholder="2000,00"
              required
            />

            <Campo
              label="Quanto já guardou? (R$)"
              type="number"
              min="0"
              step="0.01"
              value={form.valorGuardado}
              onChange={(valor) => setForm({ ...form, valorGuardado: valor })}
              placeholder="0,00"
            />

            <Campo
              label="Prazo (opcional)"
              type="date"
              value={form.prazo}
              onChange={(valor) => setForm({ ...form, prazo: valor })}
            />

            {erro && (
              <p className="text-sm font-medium text-red-600">{erro}</p>
            )}

            <button
              type="submit"
              className="
                flex items-center justify-center gap-2
                !rounded-full bg-[#23385d] px-6 py-3
                text-sm font-bold text-white
                shadow-[0_4px_12px_rgba(20,34,56,0.14)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-[#304b75]
                hover:shadow-[0_6px_16px_rgba(20,34,56,0.20)]
              "
            >
              {metaSelecionada ? 'Salvar alterações' : 'Criar meta'}
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: adicionar valor */}
      {modalValor && metaSelecionada && (
        <Modal onClose={() => setModalValor(false)}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#142238]">
                Adicionar valor
              </h3>
              <p className="mt-1 text-sm text-[#475569]">
                Meta: {metaSelecionada.nome}
              </p>
            </div>

            <BotaoFechar onClick={() => setModalValor(false)} />
          </div>

          <form onSubmit={adicionarValor} className="flex flex-col gap-4">
            <div className="rounded-xl bg-[#f1f5f9] p-4">
              <p className="text-xs text-[#64748b]">Ainda falta</p>
              <strong className="mt-1 block text-xl text-[#142238]">
                {formatarMoeda(
                  Number(metaSelecionada.valorObjetivo) -
                  Number(metaSelecionada.valorGuardado)
                )}
              </strong>
            </div>

            <Campo
              label="Valor que deseja guardar (R$)"
              type="number"
              min="0.01"
              step="0.01"
              value={valorAdicional}
              onChange={setValorAdicional}
              placeholder="100,00"
              required
            />

            {erro && (
              <p className="text-sm font-medium text-red-600">{erro}</p>
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#142238] px-5 py-3 text-sm font-semibold text-white hover:bg-[#23385d]"
            >
              <ArrowDownToLine size={17} />
              Guardar valor
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function ResumoCard({ icon: Icon, label, valor, detalhe, cor }) {
  return (
    <div className="rounded-2xl border border-[#d5dee9]
                  bg-white p-5
                    shadow-[0_4px_16px_rgba(20,34,56,0.07)]">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${cor}15`, color: cor }}
        >
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium text-[#475569]">{label}</span>
      </div>

      <strong className="block text-2xl font-bold text-[#142238]">
        {valor}
      </strong>
      <p className="mt-1 text-xs text-[#64748b]">{detalhe}</p>
    </div>
  );
}

function Campo({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#334155]">
        {label}
      </label>
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full rounded-xl border border-[#dbe2ea]
          bg-white px-4 py-3 text-sm text-[#142238]
          outline-none transition
          placeholder:text-[#64748b]
          focus:border-[#d6a441] focus:ring-2
          focus:ring-[#d6a441]/15
        "
      />
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto bg-[#081426]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
        {children}
      </div>
    </div>
  );
}

function BotaoFechar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fechar"
      className="rounded-lg p-2 text-[#475569] hover:bg-[#f1f5f9]"
    >
      <X size={20} />
    </button>
  );
}

export default Metas;
