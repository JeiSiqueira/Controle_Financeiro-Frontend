import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        try {
            const response = await api.post("/Auth/login", {
                email,
                senha,
            });

            const token = response.data.data.token;

            localStorage.setItem("token", token);

            setMensagem("Login realizado com sucesso!");

            console.log("Token:", token);

            navigate("/dashboard");

        } catch (error: any) {
            console.error("ERRO COMPLETO:", error);
            console.error("STATUS:", error.response?.status);
            console.error("RESPONSE:", error.response?.data);

            setMensagem(
                error.response?.data?.message ||
                "Erro ao efetuar login."
            );
        }
    }

    return (
        <div>
            <h1>Controle Financeiro</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>E-mail</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Senha</label>

                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <button type="submit">
                    Entrar
                </button>
            </form>

            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}