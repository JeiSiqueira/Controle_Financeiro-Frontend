import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Cadastro.css";

export default function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [cadastrando, setCadastrando] = useState(false);

    async function handleCadastro(event: React.FormEvent) {
        event.preventDefault();

        setMensagem("");
        setErro("");

        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            setCadastrando(true);

            await api.post("/Auth/register", {
                nome: nome.trim(),
                email: email.trim(),
                senha,
            });

            setMensagem(
                "Conta criada com sucesso! Redirecionando para o login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error: any) {
            console.error("Erro ao cadastrar:", error);
            console.error("Resposta da API:", error.response?.data);

            setErro(
                error.response?.data?.message ||
                "Não foi possível criar a conta."
            );
        } finally {
            setCadastrando(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Controle Financeiro</h1>

                <h2>Criar conta</h2>

                <p className="auth-subtitle">
                    Crie sua conta para começar a controlar suas finanças.
                </p>

                {erro && (
                    <p className="auth-error">
                        {erro}
                    </p>
                )}

                {mensagem && (
                    <p className="auth-success">
                        {mensagem}
                    </p>
                )}

                <form onSubmit={handleCadastro}>

                    <div className="form-group">
                        <label>Nome</label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div className="form-group">
                        <label>E-mail</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Digite seu e-mail"
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>

                        <input
                            type="password"
                            value={senha}
                            onChange={(e) =>
                                setSenha(e.target.value)
                            }
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar senha</label>

                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) =>
                                setConfirmarSenha(e.target.value)
                            }
                            placeholder="Digite sua senha novamente"
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={cadastrando}
                    >
                        {cadastrando
                            ? "Criando conta..."
                            : "Criar conta"}
                    </button>

                </form>

                <p className="auth-footer">
                    Já possui uma conta?{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/login")}
                    >
                        Entrar
                    </button>
                </p>

            </div>

        </div>
    );
}