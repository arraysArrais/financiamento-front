import { Box, Button, FileInput, Group, Stack, Text, TextInput, Title, rem } from "@mantine/core"
import { /* FormEvent, useEffect, */ useState } from 'react';
import { NumberInput, Slider } from '@mantine/core';
import classes from './SliderInput.module.css';
import './style.css'
import { useForm, /* zodResolver */ } from "@mantine/form";
import { IconCheck, IconPhoto } from "@tabler/icons-react";
import useApi from '../../services/financiamentoService';
import { notifications } from "@mantine/notifications";
//import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

export const AddFinanciamento = () => {
    /*     const schema = z.object({
            objeto: z.string().min(20, { message: 'Objeto deve ter pelo menos 20 caracteres' }),
            descricao: z.string().min(50, { message: 'Descrição deve ter pelo menos 50 caracteres' }),
            quantidade: z.number().min(1, { message: 'O financiamento deve ter pelo menos 1 parcela' }).max(48, {message: 'O financiamento deve ter no máximo 48 parcelas'})
        });
     */
    const apiServices = useApi();
    const icon = <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [file, setFile] = useState<File | null>(null);
    const form = useForm({
        /* validate: zodResolver(schema), */
        initialValues: {
            objeto: '',
            descricao: '',
            vencimento_primeira_parcela: '2023-11-10',
            valor_parcela: 0,
            qtd_parcelas: 0,

        },
        validate: {
            objeto: (value) => value.length > 20 ? null : 'Nome do objeto precisa ter pelo menos 20 caracteres',
            descricao: (value) => value.length > 50 ? null : 'Descricao do objeto precisa ter pelo menos 50 caracteres',
            qtd_parcelas: (value) => (value <= 48) ? null : 'A Quantidade máxima de parcelas é de 48'
        }
    });

    const [numberInput, setNumberInput] = useState<number>(600);
    const [createFinanciamento, setCreateFinanciamento] = useState<any>({});
    const navigate = useNavigate();

    /*     useEffect(() => {
            const updatedEditFinanciamento = { ...createFinanciamento, valor_parcela: numberInput };
            setCreateFinanciamento(updatedEditFinanciamento);
            console.log("atualizado:", updatedEditFinanciamento);
          }, [numberInput, createFinanciamento]); */

    const handleSubmit = async (/* event: React.FormEvent<HTMLFormElement> */) => {
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
                        <Text size="sm">Vencimento primeira parcela</Text>
                        <input {...form.getInputProps('vencimento_primeira_parcela')} type='date' className="dataInput" name="vencimento_primeira_parcela" value={form.values.vencimento_primeira_parcela} onInput={(e) => {
                            const updatedValue = e.currentTarget.value;
                            const updatedEditFinanciamento = { ...createFinanciamento, vencimento_primeira_parcela: updatedValue };
                            form.setFieldValue('vencimento_primeira_parcela', e.currentTarget.value)
                            setCreateFinanciamento(updatedEditFinanciamento);
                            console.log(createFinanciamento)
                        }} />
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

                    <Box>
                        <div className={classes.wrapper}>
                            <NumberInput
                                value={+numberInput}
                                onChange={(e) => {
                                    setNumberInput(+e.valueOf)
                                    //const updatedValue = numberInput;
                                    const updatedEditFinanciamento = { ...createFinanciamento, valor_parcela: +numberInput };
                                    form.setFieldValue('valor_parcela', +numberInput)
                                    setCreateFinanciamento(updatedEditFinanciamento);
                                    console.log(createFinanciamento)
                                    console.log(numberInput)
                                }}
                                //value={form.values.valor_parcela}
                                label="Valor da parcela"
                                step={50}
                                min={0}
                                max={8000}
                                hideControls
                                classNames={{ input: classes.input, label: classes.label }}
                            />
                            <Slider
                                max={8000}
                                step={1}
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

                            <FileInput
                                size="xs"
                                label="Imagem"
                                //withAsterisk
                                //error="É preciso inserir um comprovante de pagamento do boleto"
                                placeholder="Imagem do Objeto a ser financiado"
                                accept='image/png,image/jpeg'
                                rightSection={icon}
                                onChange={setFile}
                                value={file}
                            />
                        </div>
                    </Box>

                    <Button type="submit">Enviar</Button>
                </Stack>
            </form>
        </Group>    
    )
}