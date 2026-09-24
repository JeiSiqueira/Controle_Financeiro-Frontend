import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "./Transacoes.css";

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    tipo: string;
    categoria: string;
}

function Transacoes() {

    const navigate = useNavigate();

    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [erro, setErro] = useState("");

    // Filtro por mês
    const [mesSelecionado, setMesSelecionado] = useState("todos");

    async function excluirTransacao(id: number) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta transação?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/Transacoes/${id}`);

            setTransacoes((transacoesAtuais) =>
                transacoesAtuais.filter(
                    (transacao) => transacao.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Erro ao excluir transação:",
                error
            );

            setErro(
                "Não foi possível excluir a transação."
            );
        }
    }

    useEffect(() => {

        async function carregarTransacoes() {

            try {

                const response = await api.get("/Transacoes");

                setTransacoes(response.data.data);

            } catch (error) {

                console.error(
                    "Erro ao buscar transações:",
                    error
                );

                setErro(
                    "Não foi possível carregar as transações."
                );
            }
        }

        carregarTransacoes();

    }, []);

    const formatarMoeda = (valor: number) => {

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatarData = (data: string) => {

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );
    };

    // Transações filtradas pelo mês
    const transacoesFiltradas = transacoes.filter((transacao) => {

        if (mesSelecionado === "todos") {
            return true;
        }

        const data = new Date(transacao.data);

        const mes = String(
            data.getMonth() + 1
        ).padStart(2, "0");

        const ano = data.getFullYear();

        return `${ano}-${mes}` === mesSelecionado;
    });

    // Gera os meses que realmente possuem transações
    const mesesDisponiveis = Array.from(
        new Set(
            transacoes.map((transacao) => {

                const data = new Date(transacao.data);

                const mes = String(
                    data.getMonth() + 1
                ).padStart(2, "0");

                const ano = data.getFullYear();

                return `${ano}-${mes}`;
            })
        )
    ).sort().reverse();

    const formatarMes = (valor: string) => {

        const [ano, mes] = valor.split("-");

        const data = new Date(
            Number(ano),
            Number(mes) - 1,
            1
        );

        return data.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric",
            }
        );
    };

    return (
        <>
            <Navbar />

            <main className="transacoes-page">

                <header className="transacoes-header">

                    <div>
                        <h1>Transações</h1>

                        <p>
                            Consulte todas as suas receitas e despesas.
                        </p>
                    </div>

                </header>

                {erro && (
                    <p className="transacoes-error">
                        {erro}
                    </p>
                )}

                <section className="transacoes-card">

                    <div className="transacoes-card-header">

                        <div>
                            <h2>
                                Todas as transações
                            </h2>

                            <span>
                                {transacoesFiltradas.length}{" "}
                                {transacoesFiltradas.length === 1
                                    ? "registro"
                                    : "registros"}
                            </span>
                        </div>

                        {/* FILTRO */}
                        <div className="transacoes-filtro">

                            <label htmlFor="filtro-mes">
                                Filtrar por mês
                            </label>

                            <select
                                id="filtro-mes"
                                value={mesSelecionado}
                                onChange={(e) =>
                                    setMesSelecionado(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="todos">
                                    Todos os meses
                                </option>

                                {mesesDisponiveis.map((mes) => (
                                    <option
                                        key={mes}
                                        value={mes}
                                    >
                                        {formatarMes(mes)}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>

                    {transacoesFiltradas.length === 0 ? (

                        <div className="transacoes-vazio">

                            <p>
                                Nenhuma transação encontrada
                                para este período.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/nova-transacao")
                                }
                            >
                                Adicionar transação
                            </button>

                        </div>

                    ) : (

                        <div className="transacoes-lista">

                            {transacoesFiltradas.map((transacao) => {

                                const ehReceita =
                                    transacao.tipo.toLowerCase() === "receita";

                                return (

                                    <article
                                        className="transacao-item"
                                        key={transacao.id}
                                    >

                                        {/* OPÇÕES FICAM ACIMA */}
                                        <div className="transacao-opcoes">

                                            <span className="transacao-opcoes-titulo">
                                                Opções
                                            </span>

                                            <div className="acoes">

                                                <button
                                                    className="editar-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/editar-transacao/${transacao.id}`
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="excluir-button"
                                                    onClick={() =>
                                                        excluirTransacao(
                                                            transacao.id
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </div>

                                        </div>

                                        {/* INFORMAÇÕES ABAIXO */}
                                        <div className="transacao-informacoes">

                                            <div className="transacao-campo">

                                                <span className="transacao-label">
                                                    Descrição
                                                </span>

                                                <span className="transacao-valor">
                                                    {transacao.descricao}
                                                </span>

                                            </div>

                                            <div className="transacao-campo">

                                                <span className="transacao-label">
                                                    Categoria
                                                </span>

                                                <span className="transacao-valor">
                                                    {transacao.categoria}
                                                </span>

                                            </div>

                                            <div className="transacao-campo">

                                                <span className="transacao-label">
                                                    Data
                                                </span>

                                                <span className="transacao-valor">
                                                    {formatarData(
                                                        transacao.data
                                                    )}
                                                </span>

                                            </div>

                                            <div className="transacao-campo">

                                                <span className="transacao-label">
                                                    Tipo
                                                </span>

                                                <span
                                                    className={
                                                        ehReceita
                                                            ? "tipo-receita"
                                                            : "tipo-despesa"
                                                    }
                                                >
                                                    {transacao.tipo}
                                                </span>

                                            </div>

                                            <div className="transacao-campo">

                                                <span className="transacao-label">
                                                    Valor
                                                </span>

                                                <span
                                                    className={
                                                        ehReceita
                                                            ? "valor-receita"
                                                            : "valor-despesa"
                                                    }
                                                >
                                                    {ehReceita ? "+" : "-"}{" "}
                                                    {formatarMoeda(
                                                        transacao.valor
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </article>

                                );
                            })}

                        </div>

                    )}

                </section>

            </main>
        </>
    );
}

export default Transacoes;