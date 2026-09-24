import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [menuAberto, setMenuAberto] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const nome = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    useEffect(() => {
        function fecharMenu(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuAberto(false);
            }
        }

        document.addEventListener("mousedown", fecharMenu);

        return () => {
            document.removeEventListener("mousedown", fecharMenu);
        };
    }, []);

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("usuarioId");

        setMenuAberto(false);

        navigate("/login", { replace: true });
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


                <button onClick={() => navigate("/transacoes")}>
                    Transações
                </button>

                <button onClick={() => navigate("/nova-transacao")}>
                    Nova transação
                </button>

                <button onClick={() => navigate("/relatorios")}>
                    Relatórios 
                </button>

            </div>

            <div className="navbar-user" ref={menuRef}>

                <button
                    className="user-button"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    <span>{nome || "Usuário"}</span>

                    <span
                        className={`user-arrow ${menuAberto ? "aberta" : ""
                            }`}
                    >
                        ▾
                    </span>
                </button>

                {menuAberto && (
                    <div className="user-menu">

                        <div className="user-info">
                            <strong>{nome || "Usuário"}</strong>

                            <span>
                                {email || "E-mail não informado"}
                            </span>
                        </div>

                        <div className="user-menu-divider" />

                        <button
                            className="logout-button"
                            onClick={sair}
                        >
                            <span>↪</span>
                            Sair
                        </button>

                    </div>
                )}

            </div>

        </nav>
    );
}

export default Navbar;