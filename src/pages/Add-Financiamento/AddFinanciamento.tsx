import { Box, Button, FileInput, Group, Stack, Text, TextInput, Title, rem } from "@mantine/core"
import { useEffect, useState } from 'react';
import { NumberInput } from '@mantine/core';
//import classes from './SliderInput.module.css';
import './style.css'
import { useForm } from "@mantine/form";
import { IconCalendar, IconCheck, IconCoin, IconPhoto, IconUser, Icon123, IconAbc } from "@tabler/icons-react";
import useApi from '../../services/financiamentoService';
import { notifications } from "@mantine/notifications";
import { useNavigate } from 'react-router-dom';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { Select } from '@mantine/core';
import { UserProps } from "../Financiamentos/types/Users.type";
import { FormProps } from "./types/AddFinanciamentoFormProps";



export const AddFinanciamento = () => {
    const apiServices = useApi();
    const imgIcon = <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const dateIcon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const userIcon = <IconUser style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const moneyIcon = <IconCoin style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const numberIcon = <Icon123 style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const letterIcon = <IconAbc style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<UserProps[] | never[]>([]);

    const form = useForm<FormProps>({
        initialValues: {
            objeto: '',
            descricao: '',
            vencimento_primeira_parcela: undefined,
            valor_parcela: 0,
            qtd_parcelas: 0,
            img_obj: null,
            pagador: '',
            responsavel: ''
        },
        validate: {
            objeto: (value) => (value.length > 29 && value.length < 40) ? null : 'Nome do objeto precisa ter pelo menos 30 caracteres e no máximo 40',
            descricao: (value) => value.length > 20 ? null : 'Descricao do objeto precisa ter pelo menos 20 caracteres',
            vencimento_primeira_parcela: (value) => (value !== undefined && value !== null) ? null : 'Deve ser preenchido uma data',
            qtd_parcelas: (value) => ((value <= 48) && (value !== undefined) && (!isNaN(value) && (value !== 0))) ? null : 'Este campo deve ser preenchido. O valor máximo é 48. Mais que isso tá passando necessidade.',
            valor_parcela: (value) => (value !== undefined && (!isNaN(value) && (value !== 0)) ? null : 'O valor da parcela precisa ser preenchido'),
            img_obj: (value) => (value !== undefined && value !== null) ? null : 'O arquivo de imagem deve ser anexado.',
            pagador: (value) => (value !== undefined && value !== null && value !== "") ? null : 'Favor selecionar um usuário responsável pelo pagamento das faturas',
            responsavel: (value) => (value !== undefined && value !== null && value !== "") ? null : 'Favor selecionar o usuário que cederá o nome para o financiamento'
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            let response = await apiServices.getUsers();
            setUsers(response);
        }
        fetchData();
    }, [])

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
                    <TextInput {...form.getInputProps('objeto')} leftSection={letterIcon} label="Objeto" placeholder="Nome do objeto a ser financiado" name="objeto" value={form.values.objeto} onChange={(e) => {
                        const updatedValue = e.currentTarget.value;
                        const updatedEditFinanciamento = { ...createFinanciamento, objeto: updatedValue };
                        form.setFieldValue('objeto', e.currentTarget.value)
                        setCreateFinanciamento(updatedEditFinanciamento);
                        console.log(createFinanciamento)
                    }}
                    />
                    <TextInput {...form.getInputProps('descricao')} leftSection={letterIcon} label="Descrição" placeholder="Descrição do objeto a ser financiado" name="descricao" value={form.values.descricao} onChange={(e) => {
                        const updatedValue = e.currentTarget.value;
                        const updatedEditFinanciamento = { ...createFinanciamento, descricao: updatedValue };
                        form.setFieldValue('descricao', e.currentTarget.value)
                        setCreateFinanciamento(updatedEditFinanciamento);
                        console.log(createFinanciamento)
                        console.log(form)
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
                    <Group>
                        <Select
                            {...form.getInputProps('responsavel')}
                            label="Responsável"
                            placeholder="Nome do responsável"
                            data={users.map((user) => ({ value: user.id.toString(), label: user.fullname }))}
                            value={form.values.responsavel}
                            onChange={(e) => {
                                form.setFieldValue('responsavel', e)
                                let id;
                                if (e) {
                                    id = +e
                                }
                                const updatedEditFinanciamento = { ...createFinanciamento, id_responsavel: id };
                                setCreateFinanciamento(updatedEditFinanciamento);
                                console.log(updatedEditFinanciamento)
                                console.log(form)
                            }}
                            searchable
                            nothingFoundMessage="Responsável não encontrado"
                            leftSection={userIcon}
                        />
                        <Select
                            {...form.getInputProps('pagador')}
                            label="Pagador"
                            placeholder="Pagador das faturas"
                            data={users.map((user) => ({ value: user.id.toString(), label: user.fullname }))}
                            value={form.values.pagador}
                            onChange={(e) => {
                                form.setFieldValue('pagador', e)
                                let id;
                                if (e) {
                                    id = +e
                                }
                                const updatedEditFinanciamento = { ...createFinanciamento, id_pagador: id };
                                setCreateFinanciamento(updatedEditFinanciamento);
                                console.log(updatedEditFinanciamento)
                            }}
                            searchable
                            nothingFoundMessage="Pagador não encontrado"
                            leftSection={userIcon}
                        />
                    </Group>
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
                        leftSection={numberIcon}
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
                        }}
                        label="Valor da parcela"
                        prefix="R$ "
                        decimalScale={2}
                        defaultValue={0.00}
                        fixedDecimalScale
                        decimalSeparator=","
                        hideControls
                        leftSection={moneyIcon}
                    />
                    <Text size="xs">
                        Valor total do financiamento: R$ {(form.values.qtd_parcelas * form.values.valor_parcela).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>

                    <FileInput
                        {...form.getInputProps('img_obj')}
                        size="sm"
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