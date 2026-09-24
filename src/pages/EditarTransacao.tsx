import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./NovaTransacao.css";

interface Categoria {
    id: number;
    nome: string;
}

function EditarTransacao() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");
    const [tipo, setTipo] = useState("Despesa");

    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, [id]);

    async function carregarDados() {

        try {

            setCarregando(true);

            const [transacaoResponse, categoriasResponse] =
                await Promise.all([
                    api.get(`/Transacoes/${id}`),
                    api.get("/Categorias")
                ]);

            const transacao =
                transacaoResponse.data.data;

            setDescricao(transacao.descricao);
            setValor(String(transacao.valor));

            // Converte a data para o formato aceito pelo input date
            const dataFormatada =
                new Date(transacao.data)
                    .toISOString()
                    .split("T")[0];

            setData(dataFormatada);

            setTipo(transacao.tipo);
            setCategoriaId(
                String(transacao.categoriaId)
            );

            setCategorias(
                categoriasResponse.data.data
            );

        } catch (error) {

            console.error(
                "Erro ao carregar transação:",
                error
            );

            setErro(
                "Não foi possível carregar a transação."
            );

        } finally {

            setCarregando(false);

        }
    }

    async function salvarAlteracoes(
        event: React.FormEvent
    ) {

        event.preventDefault();

        setErro("");

        if (!descricao || !valor || !data) {

            setErro(
                "Preencha todos os campos."
            );

            return;
        }

        if (!categoriaId) {

            setErro(
                "Selecione uma categoria."
            );

            return;
        }

        try {

            setSalvando(true);

            const dados = {
                id: Number(id),
                descricao: descricao.trim(),
                valor: Number(valor),
                data: data,
                tipo: tipo,
                categoriaId: Number(categoriaId)
            };

            console.log("========== ATUALIZANDO TRANSAÇÃO ==========");
            console.log("ID:", id);
            console.log("Dados enviados:", dados);
            console.log("============================================");

            const response = await api.put(
                "/Transacoes",
                dados
            );

            console.log("========== RESPOSTA UPDATE ==========");
            console.log(response.data);
            console.log("=====================================");

            navigate("/transacoes");

        } catch (error: any) {

            console.error("Erro:", error);
            console.error(
                "Status:",
                error.response?.status
            );
            console.error(
                "Resposta:",
                error.response?.data
            );

            console.error(
                "======================================="
            );

            setErro(
                error.response?.data?.message ||
                "Não foi possível atualizar a transação."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {

        return (
            <div className="nova-transacao-page">

                <div className="nova-transacao-container">

                    <p>
                        Carregando transação...
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="nova-transacao-page">

            <div className="nova-transacao-container">

                <div className="nova-transacao-header">

                    <span className="nova-transacao-label">
                        TRANSAÇÃO
                    </span>

                    <h1>
                        Editar transação
                    </h1>

                    <p>
                        Altere as informações da sua transação.
                    </p>

                </div>

                {erro && (
                    <p className="nova-transacao-error">
                        {erro}
                    </p>
                )}

                <form
                    onSubmit={salvarAlteracoes}
                    className="nova-transacao-form"
                >

                    <div className="form-group">

                        <label htmlFor="descricao">
                            Descrição
                        </label>

                        <input
                            id="descricao"
                            type="text"
                            placeholder="Digite a descrição"
                            value={descricao}
                            onChange={(event) =>
                                setDescricao(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="valor">
                            Valor
                        </label>

                        <input
                            id="valor"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={valor}
                            onChange={(event) =>
                                setValor(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="data">
                            Data
                        </label>

                        <input
                            id="data"
                            type="date"
                            value={data}
                            onChange={(event) =>
                                setData(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="tipo">
                            Tipo
                        </label>

                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(event) =>
                                setTipo(
                                    event.target.value
                                )
                            }
                        >

                            <option value="Despesa">
                                Despesa
                            </option>

                            <option value="Receita">
                                Receita
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="categoria">
                            Categoria
                        </label>

                        <select
                            id="categoria"
                            value={categoriaId}
                            onChange={(event) =>
                                setCategoriaId(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Selecione uma categoria
                            </option>

                            {categorias.map(
                                (categoria) => (

                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.nome}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="nova-transacao-actions">

                        <button
                            type="button"
                            className="button-cancelar"
                            onClick={() =>
                                navigate("/transacoes")
                            }
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="button-salvar"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditarTransacao;