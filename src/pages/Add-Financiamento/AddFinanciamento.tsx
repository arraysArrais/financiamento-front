import { Box, Button, FileInput, Group, Stack, TextInput, Title, rem } from "@mantine/core"
import { useState } from 'react';
import { NumberInput } from '@mantine/core';
//import classes from './SliderInput.module.css';
import './style.css'
import { useForm } from "@mantine/form";
import { IconCalendar, IconCheck, IconPhoto } from "@tabler/icons-react";
import useApi from '../../services/financiamentoService';
import { notifications } from "@mantine/notifications";
import { useNavigate } from 'react-router-dom';
import { DatePickerInput, DateValue } from '@mantine/dates';
import '@mantine/dates/styles.css';


export const AddFinanciamento = () => {
    const apiServices = useApi();
    const imgIcon = <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const dateIcon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    //const moneyIcon = <IconCoin style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [file, setFile] = useState<File | null>(null);

    interface FormData {
        objeto: string;
        descricao: string;
        vencimento_primeira_parcela: DateValue | undefined;
        valor_parcela: number;
        qtd_parcelas: number;
        img_obj: File | null;
    }
    const form = useForm<FormData>({
        initialValues: {
            objeto: '',
            descricao: '',
            vencimento_primeira_parcela: undefined,
            valor_parcela: 0,
            qtd_parcelas: 0,
            img_obj: null,

        },
        validate: {
            objeto: (value) => value.length > 32 ? null : 'Nome do objeto precisa ter pelo menos 20 caracteres',
            descricao: (value) => value.length > 20 ? null : 'Descricao do objeto precisa ter pelo menos 50 caracteres',
            vencimento_primeira_parcela: (value) => (value !== undefined && value !== null) ? null : 'Deve ser preenchido uma data',
            qtd_parcelas: (value) => ((value <= 48) && (value !== undefined) && (!isNaN(value) && (value !== 0))) ? null : 'Este campo deve ser preenchido. O valor máximo é 48. Mais que isso tá passando necessidade.',
            valor_parcela: (value) => (value !== undefined && (!isNaN(value) && (value !== 0)) ? null : 'O valor da parcela precisa ser preenchido'),
            img_obj: (value) => (value !== undefined && value !== null) ? null : 'O arquivo de imagem deve ser anexado.'
        }
    });

    const [numberInput, setNumberInput] = useState<number>(0);
    const [createFinanciamento, setCreateFinanciamento] = useState<any>({});

    const [isDisabled, setIsDisabled] = useState(false);
    //const [date, setDate] = useState<Date | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (/* event: React.FormEvent<HTMLFormElement> */) => {
        setIsDisabled(true)
        let newCreateFinanciamento = { ...createFinanciamento, img_objeto: file }
        //console.log('valor que será enviado para a API: ', newCreateFinanciamento);
        const notificacao = notifications.show({
            loading: true,
            title: 'Notificação',
            message: 'Criando financiamento',
            autoClose: false,
            withCloseButton: false,
            color: 'green'
        });

        let result = await apiServices.createFinanciamento(newCreateFinanciamento);

        if (result) {
            notifications.update({
                id: notificacao,
                color: 'green',
                title: 'Operação finalizada',
                message: result.message,
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 2000,
            });

            navigate('/financiamentos');
        }
    };

    return (
        <Group justify="center">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap={"lg"}>
                    <Title>Cadastrar novo financiamento</Title>
                    <TextInput {...form.getInputProps('objeto')} label="Objeto" placeholder="Nome do objeto a ser financiado" name="objeto" value={form.values.objeto} onChange={(e) => {
                        const updatedValue = e.currentTarget.value;
                        const updatedEditFinanciamento = { ...createFinanciamento, objeto: updatedValue };
                        form.setFieldValue('objeto', e.currentTarget.value)
                        setCreateFinanciamento(updatedEditFinanciamento);
                        console.log(createFinanciamento)
                    }}
                    />
                    <TextInput {...form.getInputProps('descricao')} label="Descricao" placeholder="Descrição do objeto a ser financiado" name="descricao" value={form.values.descricao} onChange={(e) => {
                        const updatedValue = e.currentTarget.value;
                        const updatedEditFinanciamento = { ...createFinanciamento, descricao: updatedValue };
                        form.setFieldValue('descricao', e.currentTarget.value)
                        setCreateFinanciamento(updatedEditFinanciamento);
                        console.log(createFinanciamento)
                    }} />
                    <Box>
                        {/* <input {...form.getInputProps('vencimento_primeira_parcela')} type='date' className="dataInput" name="vencimento_primeira_parcela" 
                        value={form.values.vencimento_primeira_parcela} 
                        onInput={(e) => {
                            const updatedValue = e.currentTarget.value;
                            const updatedEditFinanciamento = { ...createFinanciamento, vencimento_primeira_parcela: updatedValue };
                            form.setFieldValue('vencimento_primeira_parcela', e.currentTarget.value)
                            setCreateFinanciamento(updatedEditFinanciamento);
                            console.log(createFinanciamento)
                        }}/> */}
                        <DatePickerInput
                            {...form.getInputProps('vencimento_primeira_parcela')}
                            locale="pt"
                            clearable={true}
                            valueFormat="YYYY-MM-DD"
                            leftSection={dateIcon}
                            label="Vencimento"
                            placeholder="Vencimento da primeira parcela"
                            value={form.values.vencimento_primeira_parcela}
                            onChange={(e) => {
                                form.setFieldValue('vencimento_primeira_parcela', e)
                                const updatedEditFinanciamento = { ...createFinanciamento, vencimento_primeira_parcela: e };
                                setCreateFinanciamento(updatedEditFinanciamento);
                                console.log(createFinanciamento)
                            }}
                        />
                    </Box>

                    <NumberInput
                        {...form.getInputProps('qtd_parcelas')}
                        label="Quantidade de parcelas"
                        placeholder="Insira um valor entre 1 e 48"
                        name="qtd_parcelas"
                        min={1}
                        max={48}
                        value={form.values.qtd_parcelas}
                        onChange={(e) => {
                            const updatedValue = +e.valueOf();
                            const updatedEditFinanciamento = { ...createFinanciamento, qtd_parcelas: updatedValue };
                            form.setFieldValue('qtd_parcelas', updatedValue)
                            setCreateFinanciamento(updatedEditFinanciamento);
                        }}
                    />
                    <NumberInput
                        {...form.getInputProps('valor_parcela')}
                        value={form.values.valor_parcela}
                        onChange={(e) => {
                            form.setFieldValue('valor_parcela', +e)
                            setNumberInput(+e)
                            const updatedEditFinanciamento = { ...createFinanciamento, valor_parcela: +numberInput };
                            setCreateFinanciamento(updatedEditFinanciamento);
                            console.log(createFinanciamento)
                            console.log("form:", form.values.valor_parcela)
                        }}
                        label="Valor da parcela"
                        prefix="R$ "
                        decimalScale={2}
                        defaultValue={0.00}
                        fixedDecimalScale
                        decimalSeparator=","
                        hideControls
                    />
                    <FileInput
                        {...form.getInputProps('img_obj')}
                        size="xs"
                        label="Imagem"
                        //withAsterisk
                        //error="É preciso inserir um comprovante de pagamento do boleto"
                        placeholder="Imagem do Objeto a ser financiado"
                        accept='image/png,image/jpeg'
                        leftSection={imgIcon}
                        onChange={(e) => {
                            setFile(e)
                            form.setFieldValue('img_obj', e)
                            console.log(e)
                        }}
                        clearable
                        value={file}
                    />

                    <Button type="submit" disabled={isDisabled}>Enviar</Button>
                    {/* <Box>
                        <div className={classes.wrapper}>

                            <Slider
                                max={8000}
                                step={0.78}
                                min={0}
                                label={null}
                                value={numberInput}
                                onChange={(e) => {
                                    const updatedSliderValue = +e;
                                    setNumberInput(updatedSliderValue);
                                    form.setFieldValue('valor_parcela', updatedSliderValue)
                                    const updatedEditFinanciamento = { ...createFinanciamento, valor_parcela: updatedSliderValue };
                                    setCreateFinanciamento(updatedEditFinanciamento)
                                }}
                                size={2}
                                className={classes.slider}
                                classNames={classes}
                            />
                            <br />

                        </div>
                    </Box> */}


                </Stack>
            </form>
        </Group>
    )
}