import { useEffect, useState } from "react";
import api from "../services/api";

interface Claim {
    type: string;
    value: string;
}

export default function Me() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarUsuario() {
            try {
                const response = await api.get("/Auth/me");

                setClaims(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                setErro("Não foi possível carregar o usuário.");
            }
        }

        buscarUsuario();
    }, []);

    return (
        <div>
            <h1>Usuário autenticado</h1>

            {erro && <p>{erro}</p>}

            {claims.map((claim, index) => (
                <p key={index}>
                    <strong>{claim.type}:</strong> {claim.value}
                </p>
            ))}
        </div>
    );
}