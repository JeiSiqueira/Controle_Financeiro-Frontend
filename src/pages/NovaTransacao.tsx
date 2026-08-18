import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Categoria {
    id: number;
    nome: string;
}

function NovaTransacao() {
    const navigate = useNavigate();

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");
    const [tipo, setTipo] = useState("Despesa");

    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [criarCategoria, setCriarCategoria] = useState(false);
    const [novaCategoria, setNovaCategoria] = useState("");

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarCategorias();
    }, []);

    async function carregarCategorias() {
        try {
            const response = await api.get("/Categorias");

            setCategorias(response.data.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            setErro("Não foi possível carregar as categorias.");
        }
    }

    async function salvarTransacao(event: React.FormEvent) {
        event.preventDefault();

        setErro("");

        if (!descricao || !valor || !data) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (!criarCategoria && !categoriaId) {
            setErro("Selecione uma categoria.");
            return;
        }

        if (criarCategoria && !novaCategoria.trim()) {
            setErro("Digite o nome da nova categoria.");
            return;
        }

        try {
            setSalvando(true);

            let categoriaSelecionadaId = Number(categoriaId);

            if (criarCategoria) {
                const response = await api.post("/Categorias", {
                    nome: novaCategoria.trim(),
                });

                categoriaSelecionadaId = response.data.data.id;

                await carregarCategorias();
            }

            await api.post("/Transacoes", {
                descricao,
                valor: Number(valor),
                data,
                tipo,
                categoriaId: categoriaSelecionadaId,
            });

            navigate("/dashboard");

        } catch (error: any) {
            console.error("Erro ao criar transação:", error);
            console.error("Resposta da API:", error.response?.data);

            setErro(
                error.response?.data?.message ||
                "Não foi possível criar a transação."
            );

        } finally {
            setSalvando(false);
        }
    }

    function selecionarCategoria(valorSelecionado: string) {
        if (valorSelecionado === "nova") {
            setCriarCategoria(true);
            setCategoriaId("");
            setNovaCategoria("");
        } else {
            setCriarCategoria(false);
            setCategoriaId(valorSelecionado);
            setNovaCategoria("");
        }

        setErro("");
    }

    return (
        <div>
            <h1>Nova Transação</h1>

            {erro && <p>{erro}</p>}

            <form onSubmit={salvarTransacao}>

                <div>
                    <label>Descrição</label>

                    <input
                        type="text"
                        value={descricao}
                        onChange={(event) =>
                            setDescricao(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Valor</label>

                    <input
                        type="number"
                        step="0.01"
                        value={valor}
                        onChange={(event) =>
                            setValor(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Data</label>

                    <input
                        type="date"
                        value={data}
                        onChange={(event) =>
                            setData(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Tipo</label>

                    <select
                        value={tipo}
                        onChange={(event) =>
                            setTipo(event.target.value)
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

                <div>
                    <label>Categoria</label>

                    <select
                        value={criarCategoria ? "nova" : categoriaId}
                        onChange={(event) =>
                            selecionarCategoria(event.target.value)
                        }
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {categorias.map((categoria) => (
                            <option
                                key={categoria.id}
                                value={categoria.id}
                            >
                                {categoria.nome}
                            </option>
                        ))}

                        <option value="nova">
                            + Criar nova categoria
                        </option>
                    </select>

                    {criarCategoria && (
                        <div>
                            <label>Nova categoria</label>

                            <input
                                type="text"
                                value={novaCategoria}
                                onChange={(event) =>
                                    setNovaCategoria(event.target.value)
                                }
                                placeholder="Digite o nome da categoria"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={salvando}
                >
                    {salvando
                        ? "Salvando..."
                        : "Salvar"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                >
                    Cancelar
                </button>

            </form>
        </div>
    );
}

export default NovaTransacao;