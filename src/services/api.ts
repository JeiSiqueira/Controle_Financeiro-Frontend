import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5015/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("AUTHORIZATION FOI ADICIONADO");
    } else {
        console.log("SEM TOKEN");
    }

    console.log("================================");

    return config;
});

export default api;