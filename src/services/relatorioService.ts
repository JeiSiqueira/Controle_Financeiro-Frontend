import api from "./api";

export interface RelatorioMensal {
    ano: number;
    mes: number;
    mesNome: string;
    entradas: number;
    saidas: number;
    resultado: number;
    situacao: string;
}

export interface TransacaoRelatorio {
    data: string;
    descricao: string;
    categoria: string;
    tipo: string;
    valor: number;
}

export interface Relatorio {
    dataInicial: string;
    dataFinal: string;
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    situacao: string;
    mensal: RelatorioMensal[];
    transacoes: TransacaoRelatorio[];
}

interface RelatorioResponse {
    success: boolean;
    data: Relatorio;
}

export async function buscarRelatorio(
    dataInicial: string,
    dataFinal: string
): Promise<Relatorio> {
    const response = await api.get<RelatorioResponse>("/Relatorios", {
        params: {
            dataInicial,
            dataFinal,
        },
    });

    return response.data.data;
}

export async function exportarRelatorio(
    dataInicial: string,
    dataFinal: string
): Promise<void> {
    const response = await api.get("/Relatorios/exportar", {
        params: {
            dataInicial,
            dataFinal,
        },
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = `Relatorio_Financeiro_${ dataInicial }_${ dataFinal }.xlsx`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}

