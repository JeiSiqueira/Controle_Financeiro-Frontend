import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const nome = localStorage.getItem("userName");

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("usuarioId");

        navigate("/");
    }

    return (
        <nav className="navbar">

            <div
                className="navbar-logo"
                onClick={() => navigate("/dashboard")}
            >
                 Controle Financeiro
            </div>

            <div className="navbar-links">

                <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>

                <button onClick={() => navigate("/transacoes")}>
                    Transações
                </button>

                <button onClick={() => navigate("/categorias")}>
                    Categorias
                </button>

            </div>

            <div className="navbar-user">

                <span>
                     {nome || "Usuário"}
                </span>

                <button
                    className="logout-button"
                    onClick={sair}
                >
                    Sair
                </button>

            </div>

        </nav>
    );
}

export default Navbar;