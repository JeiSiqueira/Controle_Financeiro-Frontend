import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    tipo: string;
    categoria: string;
}

interface MovimentoMensal {
    chave: string;
    mes: string;
    receitas: number;
    despesas: number;
}

function Dashboard() {

    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [erro, setErro] = useState("");

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
                    "Não foi possível carregar as informações financeiras."
                );
            }
        }

        carregarTransacoes();

    }, []);

    // =========================
    // RECEITAS
    // =========================

    const receitas = transacoes
        .filter(
            (t) =>
                t.tipo.toLowerCase() === "receita"
        )
        .reduce(
            (total, t) =>
                total + t.valor,
            0
        );

    // =========================
    // DESPESAS
    // =========================

    const despesas = transacoes
        .filter(
            (t) =>
                t.tipo.toLowerCase() === "despesa"
        )
        .reduce(
            (total, t) =>
                total + t.valor,
            0
        );

    // =========================
    // SALDO
    // =========================

    const saldo = receitas - despesas;

    // =========================
    // FORMATAÇÃO DE MOEDA
    // =========================

    const formatarMoeda = (valor: number) => {

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL",
            }
        );

    };

    // =========================
    // MOVIMENTAÇÃO MENSAL
    // =========================

    const movimentosPorMes: Record<
        string,
        {
            receitas: number;
            despesas: number;
        }
    > = {};

    transacoes.forEach((transacao) => {

        const data = new Date(
            transacao.data
        );

        const ano = data.getFullYear();

        const mes = String(
            data.getMonth() + 1
        ).padStart(2, "0");

        const chave = `${ano}-${mes}`;

        if (!movimentosPorMes[chave]) {

            movimentosPorMes[chave] = {
                receitas: 0,
                despesas: 0,
            };

        }

        if (
            transacao.tipo.toLowerCase() ===
            "receita"
        ) {

            movimentosPorMes[chave].receitas +=
                transacao.valor;

        } else if (
            transacao.tipo.toLowerCase() ===
            "despesa"
        ) {

            movimentosPorMes[chave].despesas +=
                transacao.valor;

        }

    });

    // =========================
    // ÚLTIMOS 6 MESES
    // =========================

    const movimentosMensais: MovimentoMensal[] =
        Object.entries(movimentosPorMes)
            .sort(
                ([a], [b]) =>
                    a.localeCompare(b)
            )
            .slice(-6)
            .map(
                ([chave, valores]) => {

                    const [ano, mes] =
                        chave.split("-");

                    const data = new Date(
                        Number(ano),
                        Number(mes) - 1,
                        1
                    );

                    const nomeMes =
                        data.toLocaleDateString(
                            "pt-BR",
                            {
                                month: "short",
                            }
                        );

                    return {
                        chave,
                        mes:
                            nomeMes
                                .charAt(0)
                                .toUpperCase() +
                            nomeMes.slice(1),
                        receitas:
                            valores.receitas,
                        despesas:
                            valores.despesas,
                    };

                }
            );

    // =========================
    // MAIOR VALOR DO GRÁFICO
    // =========================

    const maiorValor =
        movimentosMensais.length > 0
            ? Math.max(
                ...movimentosMensais.flatMap(
                    (item) => [
                        item.receitas,
                        item.despesas,
                    ]
                )
            )
            : 0;

    return (
        <>
            <Navbar />

            <main className="dashboard">

                {/* =========================
                    CABEÇALHO
                ========================= */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Visão geral
                        </h1>

                        <p>
                            Acompanhe o resumo
                            das suas finanças.
                        </p>

                    </div>

                </header>

                {/* =========================
                    ERRO
                ========================= */}

                {erro && (
                    <p className="dashboard-error">
                        {erro}
                    </p>
                )}

                {/* =========================
                    CARDS
                ========================= */}

                <section className="cards">

                    <div className="card receita">

                        <div className="card-title">
                            Receitas
                        </div>

                        <div className="card-value">
                            {formatarMoeda(
                                receitas
                            )}
                        </div>

                        <div className="card-description">
                            Total recebido
                        </div>

                    </div>

                    <div className="card despesa">

                        <div className="card-title">
                            Despesas
                        </div>

                        <div className="card-value">
                            {formatarMoeda(
                                despesas
                            )}
                        </div>

                        <div className="card-description">
                            Total gasto
                        </div>

                    </div>

                    <div
                        className={`card ${saldo >= 0
                                ? "saldo positivo"
                                : "saldo negativo"
                            }`}
                    >

                        <div className="card-title">
                            Saldo
                        </div>

                        <div className="card-value">
                            {formatarMoeda(
                                saldo
                            )}
                        </div>

                        <div className="card-description">

                            {saldo >= 0
                                ? "Saldo positivo"
                                : "Saldo negativo"}

                        </div>

                    </div>

                </section>

                {/* =========================
                    MOVIMENTAÇÃO MENSAL
                ========================= */}

                <section className="movimentacao-container">

                    <div className="movimentacao-header">

                        <div>

                            <h2>
                                Movimentação mensal
                            </h2>

                            <p>
                                Acompanhe suas
                                receitas e despesas
                                ao longo dos meses.
                            </p>

                        </div>

                    </div>

                    {movimentosMensais.length === 0 ? (

                        <div className="movimentacao-vazia">

                            <p>
                                Ainda não existem
                                movimentações
                                registradas.
                            </p>

                        </div>

                    ) : (

                        <div className="movimentacao-conteudo">

                            {/* =========================
                                GRÁFICO
                            ========================= */}

                            <div className="grafico-area">

                                <div className="grafico">

                                    {movimentosMensais.map(
                                        (item) => {

                                            const alturaReceita =
                                                maiorValor > 0
                                                    ? (item.receitas / maiorValor) * 100
                                                    : 0;

                                            const alturaDespesa =
                                                maiorValor > 0
                                                    ? (item.despesas / maiorValor) * 100
                                                    : 0;

                                            return (

                                                <div
                                                    className="mes-grafico"
                                                    key={item.chave}
                                                >

                                                    <div className="barras">

                                                        <div className="barra-wrapper">

                                                            <div
                                                                className="barra receita-barra"
                                                                style={{
                                                                    height: `${alturaReceita}%`,
                                                                }}
                                                                title={`Receita: ${formatarMoeda(
                                                                    item.receitas
                                                                )}`}
                                                            />

                                                        </div>

                                                        <div className="barra-wrapper">

                                                            <div
                                                                className="barra despesa-barra"
                                                                style={{
                                                                    height: `${alturaDespesa}%`,
                                                                }}
                                                                title={`Despesa: ${formatarMoeda(
                                                                    item.despesas
                                                                )}`}
                                                            />

                                                        </div>

                                                    </div>

                                                    <span className="mes-label">
                                                        {item.mes}
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                                {/* LEGENDA */}

                                <div className="grafico-legenda">

                                    <span>
                                        <span className="legenda-receita" />
                                        Receitas
                                    </span>

                                    <span>
                                        <span className="legenda-despesa" />
                                        Despesas
                                    </span>

                                </div>

                            </div>

                            {/* =========================
                                VALORES
                            ========================= */}

                            <aside className="valores-mensais">

                                <h3>
                                    Valores
                                </h3>

                                {movimentosMensais.map(
                                    (item) => (

                                        <div
                                            className="valor-mes"
                                            key={item.chave}
                                        >

                                            <strong>
                                                {item.mes}
                                            </strong>

                                            <div className="valor-linha receita-texto">

                                                <span>
                                                    Receita
                                                </span>

                                                <span>
                                                    {formatarMoeda(
                                                        item.receitas
                                                    )}
                                                </span>

                                            </div>

                                            <div className="valor-linha despesa-texto">

                                                <span>
                                                    Despesa
                                                </span>

                                                <span>
                                                    {formatarMoeda(
                                                        item.despesas
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </aside>

                        </div>

                    )}

                </section>

            </main>
        </>
    );
}

export default Dashboard;