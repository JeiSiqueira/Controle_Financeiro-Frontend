import { useState } from "react";
import {
    buscarRelatorio,
    exportarRelatorio,
    type Relatorio,
} from "../services/relatorioService";
import Navbar from "../components/Navbar";
import "./Relatorios.css";

function Relatorios() {
    const hoje = new Date();

    const primeiroDiaAno = `${hoje.getFullYear()}-01-01`;
    const ultimoDiaAno = `${hoje.getFullYear()}-12-31`;

    const [dataInicial, setDataInicial] = useState(primeiroDiaAno);
    const [dataFinal, setDataFinal] = useState(ultimoDiaAno);

    const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [erro, setErro] = useState("");

    function formatarMoeda(valor: number) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function formatarData(data: string) {
        return new Date(data).toLocaleDateString("pt-BR");
    }

    async function gerarRelatorio() {
        if (dataInicial > dataFinal) {
            setErro(
                "A data inicial não pode ser maior que a data final."
            );
            return;
        }

        try {
            setCarregando(true);
            setErro("");

            const resultado = await buscarRelatorio(
                dataInicial,
                dataFinal
            );

            setRelatorio(resultado);
        } catch (error) {
            console.error("Erro ao carregar relatório:", error);
            setErro("Não foi possível carregar o relatório.");
        } finally {
            setCarregando(false);
        }
    }

    async function baixarExcel() {
        if (dataInicial > dataFinal) {
            setErro(
                "A data inicial não pode ser maior que a data final."
            );
            return;
        }

        try {
            setExportando(true);
            setErro("");

            await exportarRelatorio(
                dataInicial,
                dataFinal
            );
        } catch (error) {
            console.error("Erro ao exportar relatório:", error);
            setErro("Não foi possível exportar o relatório.");
        } finally {
            setExportando(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="relatorios">

                <header className="relatorios-header">
                    <div>
                        <h1>Relatórios</h1>

                        <p>
                            Consulte o resumo das suas
                            movimentações financeiras.
                        </p>
                    </div>
                </header>

                <section className="relatorio-filtros">

                    <div className="filtros-header">
                        <div>
                            <h2>Período</h2>

                            <p>
                                Selecione o período que deseja
                                analisar.
                            </p>
                        </div>
                    </div>

                    <div className="filtros-conteudo">

                        <div className="campo-data">
                            <label>Data inicial</label>

                            <input
                                type="date"
                                value={dataInicial}
                                onChange={(e) =>
                                    setDataInicial(e.target.value)
                                }
                            />
                        </div>

                        <div className="campo-data">
                            <label>Data final</label>

                            <input
                                type="date"
                                value={dataFinal}
                                onChange={(e) =>
                                    setDataFinal(e.target.value)
                                }
                            />
                        </div>

                        <div className="filtros-acoes">

                            <button
                                className="botao-gerar"
                                onClick={gerarRelatorio}
                                disabled={carregando}
                            >
                                {carregando
                                    ? "Carregando..."
                                    : "Gerar relatório"}
                            </button>

                            <button
                                className="botao-excel"
                                onClick={baixarExcel}
                                disabled={exportando}
                            >
                                {exportando
                                    ? "Exportando..."
                                    : "Exportar Excel"}
                            </button>

                        </div>

                    </div>

                </section>

                {erro && (
                    <p className="relatorios-error">
                        {erro}
                    </p>
                )}

                {relatorio && (
                    <>
                        <section className="relatorio-cards">

                            <div className="relatorio-card receita">

                                <div className="relatorio-card-title">
                                    Entradas
                                </div>

                                <div className="relatorio-card-value">
                                    {formatarMoeda(
                                        relatorio.totalEntradas
                                    )}
                                </div>

                                <div className="relatorio-card-description">
                                    Total recebido no período
                                </div>

                            </div>

                            <div className="relatorio-card despesa">

                                <div className="relatorio-card-title">
                                    Saídas
                                </div>

                                <div className="relatorio-card-value">
                                    {formatarMoeda(
                                        relatorio.totalSaidas
                                    )}
                                </div>

                                <div className="relatorio-card-description">
                                    Total gasto no período
                                </div>

                            </div>

                            <div
                                className={`relatorio-card saldo ${relatorio.saldo >= 0
                                        ? "positivo"
                                        : "negativo"
                                    }`}
                            >

                                <div className="relatorio-card-title">
                                    Saldo
                                </div>

                                <div className="relatorio-card-value">
                                    {formatarMoeda(
                                        relatorio.saldo
                                    )}
                                </div>

                                <div className="relatorio-card-description">
                                    {relatorio.situacao}
                                </div>

                            </div>

                        </section>

                        <section className="relatorio-container">

                            <div className="relatorio-section-header">
                                <div>
                                    <h2>Resumo mensal</h2>

                                    <p>
                                        Acompanhe suas receitas,
                                        despesas e resultados
                                        ao longo dos meses.
                                    </p>
                                </div>
                            </div>

                            <div className="tabela-wrapper">

                                <table className="relatorio-tabela">

                                    <thead>
                                        <tr>
                                            <th>Mês</th>
                                            <th>Entradas</th>
                                            <th>Saídas</th>
                                            <th>Resultado</th>
                                            <th>Situação</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {relatorio.mensal.map((mes) => (
                                            <tr
                                                key={`${mes.ano}-${mes.mes}`}
                                            >

                                                <td className="mes-coluna">
                                                    {mes.mesNome}
                                                    {" / "}
                                                    {mes.ano}
                                                </td>

                                                <td className="valor-receita">
                                                    {formatarMoeda(
                                                        mes.entradas
                                                    )}
                                                </td>

                                                <td className="valor-despesa">
                                                    {formatarMoeda(
                                                        mes.saidas
                                                    )}
                                                </td>

                                                <td
                                                    className={
                                                        mes.resultado >= 0
                                                            ? "valor-positivo"
                                                            : "valor-negativo"
                                                    }
                                                >
                                                    {formatarMoeda(
                                                        mes.resultado
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`situacao ${mes.situacao
                                                                .toLowerCase()
                                                                .includes("lucro")
                                                                ? "situacao-lucro"
                                                                : mes.situacao
                                                                    .toLowerCase()
                                                                    .includes("preju")
                                                                    ? "situacao-prejuizo"
                                                                    : "situacao-equilibrio"
                                                            }`}
                                                    >
                                                        {mes.situacao}
                                                    </span>
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                        <section className="relatorio-container">

                            <div className="relatorio-section-header">
                                <div>
                                    <h2>Detalhamento</h2>

                                    <p>
                                        Todas as movimentações
                                        registradas no período.
                                    </p>
                                </div>
                            </div>

                            <div className="tabela-wrapper">

                                {relatorio.transacoes.length === 0 ? (

                                    <div className="relatorio-vazio">
                                        <p>
                                            Não existem
                                            movimentações
                                            neste período.
                                        </p>
                                    </div>

                                ) : (

                                    <table className="relatorio-tabela">

                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Descrição</th>
                                                <th>Categoria</th>
                                                <th>Tipo</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {relatorio.transacoes.map(
                                                (transacao, index) => (
                                                    <tr key={index}>

                                                        <td>
                                                            {formatarData(
                                                                transacao.data
                                                            )}
                                                        </td>

                                                        <td className="descricao-coluna">
                                                            {transacao.descricao}
                                                        </td>

                                                        <td>
                                                            {transacao.categoria}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`tipo ${transacao.tipo
                                                                        .toLowerCase() ===
                                                                        "receita"
                                                                        ? "tipo-receita"
                                                                        : "tipo-despesa"
                                                                    }`}
                                                            >
                                                                {transacao.tipo}
                                                            </span>
                                                        </td>

                                                        <td
                                                            className={
                                                                transacao.tipo
                                                                    .toLowerCase() ===
                                                                    "receita"
                                                                    ? "valor-receita"
                                                                    : "valor-despesa"
                                                            }
                                                        >
                                                            {formatarMoeda(
                                                                transacao.valor
                                                            )}
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        </section>
                    </>
                )}

            </main>
        </>
    );
}

export default Relatorios;