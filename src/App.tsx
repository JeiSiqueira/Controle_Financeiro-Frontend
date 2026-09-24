import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import NovaTransacao from "./pages/NovaTransacao";
import Transacoes from "./pages/Transacoes";
import EditarTransacao from "./pages/EditarTransacao";
import Relatorios from "./pages/Relatorios";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/nova-transacao"
                    element={<NovaTransacao />}
                />

                <Route
                    path="/editar-transacao/:id"
                    element={<EditarTransacao />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/transacoes"
                    element={<Transacoes />}
                />

                <Route
                    path="/relatorios"
                    element={<Relatorios />}
                />

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;