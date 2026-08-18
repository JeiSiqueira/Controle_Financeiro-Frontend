import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovaTransacao from "./pages/NovaTransacao";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/nova-transacao"
                    element={<NovaTransacao />}
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/nova-transacao" element={<NovaTransacao />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;