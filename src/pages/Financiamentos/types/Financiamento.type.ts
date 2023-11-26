import { ParcelaProps } from "./Parcelas.type";

export type FinanciamentoProps = {
    id: number;
    status: string;
    descricao: string;
    parcelas_pagas: number;
    parcelas: ParcelaProps[];
    img_objeto_tipo: string;
    img_string: string;
    objeto: string;
}