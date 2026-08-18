import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Dashboard() {

    const navigate = useNavigate();
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarTransacoes() {
            try {
                const response = await api.get("/Transacoes");

                setTransacoes(response.data.data);
            } catch (error) {
                console.error("Erro ao buscar transações:", error);
                setErro("Não foi possível carregar as transações.");
            }
        }

        carregarTransacoes();
    }, []);

    const receitas = transacoes
        .filter((t) => t.tipo.toLowerCase() === "receita")
        .reduce((total, t) => total + t.valor, 0);

    const despesas = transacoes
        .filter((t) => t.tipo.toLowerCase() === "despesa")
        .reduce((total, t) => total + t.valor, 0);

    const saldo = receitas - despesas;

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR");
    };

    return (
        <>
            <Navbar />

            <div className="dashboard">

                <header className="dashboard-header">
                    <div>
                        <h1>Controle Financeiro</h1>
                        <p>Resumo das suas finanças</p>
                    </div>

                    <button
                        className="nova-transacao"
                        onClick={() => navigate("/nova-transacao")}
                    >
                        Nova transação
                    </button>
                </header>

                {erro && <p>{erro}</p>}

                <section className="cards">

                    <div className="card receita">
                        <div className="card-title">
                             Receitas
                        </div>

                        <div className="card-value">
                            {formatarMoeda(receitas)}
                        </div>
                    </div>

                    <div className="card despesa">
                        <div className="card-title">
                             Despesas
                        </div>

                        <div className="card-value">
                            {formatarMoeda(despesas)}
                        </div>
                    </div>

                    <div className="card saldo">
                        <div className="card-title">
                             Saldo
                        </div>

                        <div className="card-value">
                            {formatarMoeda(saldo)}
                        </div>
                    </div>

                </section>

                <section className="transacoes">

                    <h2>Últimas transações</h2>

                    {transacoes.length === 0 ? (
                        <p>Nenhuma transação encontrada.</p>
                    ) : (

                        <table>

                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>

                            <tbody>

                                {transacoes.map((transacao) => (

                                    <tr key={transacao.id}>

                                        <td>
                                            {transacao.descricao}
                                        </td>

                                        <td>
                                            {transacao.categoria}
                                        </td>

                                        <td>
                                            {formatarData(transacao.data)}
                                        </td>

                                        <td>
                                            {transacao.tipo}
                                        </td>

                                        <td
                                            className={
                                                transacao.tipo.toLowerCase() === "receita"
                                                    ? "receita-valor"
                                                    : "despesa-valor"
                                            }
                                        >
                                            {transacao.tipo.toLowerCase() === "receita"
                                                ? "+"
                                                : "-"}{" "}
                                            {formatarMoeda(transacao.valor)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </section>

            </div>
        </>
    );
}

export default Dashboard;