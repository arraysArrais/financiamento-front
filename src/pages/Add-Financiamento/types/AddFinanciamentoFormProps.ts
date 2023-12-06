import { DateValue } from "@mantine/dates";

export type FormProps = {
    objeto: string;
    descricao: string;
    vencimento_primeira_parcela: DateValue | undefined;
    valor_parcela: number;
    qtd_parcelas: number;
    img_obj: File | null;
    pagador: any;
    responsavel: any;
}