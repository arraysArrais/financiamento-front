import { ParcelaProps } from "./Parcelas.type";

export type FinanciamentoProps = {
    id: number;
    status: string;
    parcelas_pagas: number;
    parcelas: ParcelaProps[];
    objeto: string;
}