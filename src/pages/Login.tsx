import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        setMensagem("");

        if (!email || !senha) {
            setMensagem("Preencha o e-mail e a senha.");
            return;
        }

        try {
            setCarregando(true);

            const response = await api.post("/Auth/login", {
                email,
                senha,
            });

            const token = response.data.data.token;

            localStorage.setItem("token", token);

            const usuarioResponse = await api.get("/Auth/me");

            console.log("USUÁRIO LOGADO:", usuarioResponse.data);

            const usuario = usuarioResponse.data.data;

            localStorage.setItem("usuarioId", usuario.id);
            localStorage.setItem("userName", usuario.nome);
            localStorage.setItem("userEmail", usuario.email); 

            setMensagem("Login realizado com sucesso!");

            navigate("/dashboard");

        } catch (error: any) {

            console.error("========== ERRO LOGIN ==========");
            console.error(error);
            console.error(error.response?.data);
            console.error("================================");

            setMensagem(
                error.response?.data?.message ||
                "E-mail ou senha inválidos."
            );

        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-page">

            <section className="login-visual">

                <div className="visual-content">

                    <div className="brand">

                        <div className="brand-icon">
                            $
                        </div>

                        <span>
                            Controle Financeiro
                        </span>

                    </div>

                    <div className="visual-text">

                        <h1>
                            Organize suas finanças.
                        </h1>

                        <p>
                            Tenha mais controle sobre suas receitas,
                            despesas e objetivos financeiros.
                        </p>

                    </div>

                    <div className="finance-card">

                        <div className="finance-card-header">

                            <span>
                                Saldo disponível
                            </span>

                            <span>
                                •••
                            </span>

                        </div>

                        <strong>
                            R$ 4.850,00
                        </strong>

                        <div className="finance-bars">

                            <div className="bar bar-one"></div>
                            <div className="bar bar-two"></div>
                            <div className="bar bar-three"></div>
                            <div className="bar bar-four"></div>
                            <div className="bar bar-five"></div>

                        </div>

                        <div className="finance-card-footer">

                            <span>
                                Receitas
                            </span>

                            <span>
                                Despesas
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            <section className="login-form-section">

                <div className="login-container">

                    <div className="mobile-brand">

                        <div className="brand-icon">
                            $
                        </div>

                        <span>
                            Controle Financeiro
                        </span>

                    </div>

                    <div className="login-header">

                        <span className="welcome-label">
                            BEM-VINDO DE VOLTA
                        </span>

                        <h2>
                            Acesse sua conta
                        </h2>

                        <p>
                            Entre para acompanhar suas finanças.
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="senha">
                                    Senha
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() =>
                                        setMensagem(
                                            "A recuperação de senha será adicionada em breve."
                                        )
                                    }
                                >
                                    Esqueci minha senha
                                </button>

                            </div>

                            <input
                                id="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(event) =>
                                    setSenha(event.target.value)
                                }
                            />

                        </div>

                        <button
                            className="login-button"
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Entrando..."
                                : "Entrar"}
                        </button>

                    </form>

                    {mensagem && (
                        <p
                            className={
                                mensagem.includes("sucesso")
                                    ? "login-message success"
                                    : "login-message"
                            }
                        >
                            {mensagem}
                        </p>
                    )}

                    <div className="register-section">

                        <span>
                            Ainda não possui uma conta?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/cadastro")}
                        >
                            Criar uma conta
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}