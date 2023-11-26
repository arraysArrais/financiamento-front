import './style.css'
import { Text, Card, Image, Badge, Button, Group, Modal, Loader, TextInput, rem, } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WalkLoading } from '../../components/Loadings/WalkLoading/WalkLoading';
import useApi from "../../services/financiamentoService"
import { FinanciamentoProps } from './types/Financiamento.type';
import ImagePlaceholder from '../../assets/image-placeholder.jpg'
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconTrash, IconEye, IconPencil, IconCheck } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications';
import ParcelaTable from '../../components/DataTable/DataTable';
import { Parcela } from '../../components/DataTable/types/ParcelaProps'
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

export const Financiamentos = () => {
    const apiServices = useApi();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanciamentoProps[]>([]);
    const [parcelaModal, { open: openParcelaModal, close: closeParcelaModal }] = useDisclosure(false); //modal tabela de parcelas
    const [editFinanciamentoModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false); //modal de edição
    const [parcelaData, setParcelaData] = useState<Parcela[]>([]);
    const [parcelasLoading, setParcelasLoading] = useState(false);
    //const [editLoading, setEditLoading] = useState(false);
    const [editFinanciamento, setEditFinanciamento] = useState<any>({})

    const schema = z.object({
        nome: z.string().min(20, { message: 'Nome deve ter pelo menos 20 caracteres' }),
        descricao: z.string().min(50, { message: 'Descrição deve ter pelo menos 50 caracteres' }), 
    });

    const form = useForm({
        validate: zodResolver(schema),
        initialValues: {
            nome: '',
            descricao: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            var result = await apiServices.getFinanciamentos()
            setTimeout(async () => {
                if (result) {
                    setLoading(false)
                    setData(result)
                }
                console.log(result)
            }, 2000)
        }
        fetchData();
    }, [data]);

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Excluir financiamento',
            centered: true,
            children: (
                <Text size="sm">
                    Tem certeza que deseja excluir este financiamento?
                </Text>
            ),
            labels: { confirm: 'Sim', cancel: "Não" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                notifications.show({
                    title: 'Notificação',
                    message: 'Excluindo financiamento',
                    color: 'indigo',
                    //icon:
                    loading: true

                })
            },
        });

    const openParcela = async (financiamento_id: number) => {
        openParcelaModal() // abre o modal
        setParcelasLoading(true);

        try {
            const result = await apiServices.getParcelas(financiamento_id);
            setParcelaData(result);
        } catch (error) {
            console.log('Erro ao buscar parcelas do financiamento ' + financiamento_id)
        } finally {
            setTimeout(() => {
                setParcelasLoading(false);
            }, 500);

        }
    };

    const handleEditFinanciamento = async (financiamento_id: number) => {
        setEditFinanciamento({ id: financiamento_id });
        openEditModal()
    }

    const editFinancimanentoAction = async () => {
        closeEditModal()
        console.log("EDIT FINANCIAMENTO!!", editFinanciamento)

        const notificacao = notifications.show({
            loading: true,
            title: 'Notificação',
            message: 'Atualizando financiamento',
            autoClose: false,
            withCloseButton: false,
            color: 'yellow'
        });

        let response = await apiServices.updateFinanciamento(editFinanciamento.id, editFinanciamento)

        if (response) {
            notifications.update({
                id: notificacao,
                color: 'yellow',
                title: 'Operação finalizada',
                message: response.message,
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 2000,
            });
        }
    }

    return (
        loading ? <WalkLoading /> : (
            <Group justify='center'>
                <Modal opened={parcelaModal} onClose={closeParcelaModal} title="Parcelas" size={'md'} centered>
                    {parcelasLoading ? <Group justify='center' style={{ padding: 10 }}><Loader color="violet" type="oval" /></Group> : <ParcelaTable data={parcelaData} closeParcelaModal={closeParcelaModal} />}
                    {/* {parcelaData.length > 0 ? <ParcelaTable data={parcelaData} /> : <Group justify='center' style={{ padding: 10 }}><Loader color="violet" type="oval" /></Group>} */}
                </Modal>
                <Modal opened={editFinanciamentoModal} onClose={closeEditModal} title="Editar financiamento" size={'md'} centered>
                        <div>
                            <form onSubmit={form.onSubmit(editFinancimanentoAction)}>
                                <TextInput label="Nome" placeholder='Insira um nome legal' value={form.values.nome} onChange={(e) => {
                                    const updatedValue = e.currentTarget.value;
                                    const updatedEditFinanciamento = { ...editFinanciamento, objeto: updatedValue };
                                    form.setFieldValue('nome', e.currentTarget.value)
                                    setEditFinanciamento(updatedEditFinanciamento);
                                }} error={form.errors.nome} />
                                <br />
                                <TextInput label="Descrição" placeholder='Descreva o objeto com detalhes (ou não)' value={form.values.descricao} onChange={(e) => {
                                    const updatedValue = e.currentTarget.value;
                                    const updatedEditFinanciamento = { ...editFinanciamento, descricao: updatedValue };
                                    form.setFieldValue('descricao', e.currentTarget.value)
                                    setEditFinanciamento(updatedEditFinanciamento);
                                }} error={form.errors.descricao} />
                                <br />
                                <Button color='orange' type='submit'>Editar</Button>
                            </form>
                        </div>
                    {/* {parcelaData.length > 0 ? <ParcelaTable data={parcelaData} /> : <Group justify='center' style={{ padding: 10 }}><Loader color="violet" type="oval" /></Group>} */}
                </Modal>
                <>
                    {data.map((e) => (
                        <Card shadow="sm" padding="lg" radius="md" className='cardFinanciamento' withBorder key={e.id}>
                            <Card.Section>
                                {(e.img_string !== 'N/A')
                                    ?
                                    <Image
                                        src={`data:${e.img_objeto_tipo};base64,${e.img_string}`}
                                        height={160}
                                    />
                                    :
                                    <Image
                                        src={ImagePlaceholder}
                                        height={160}
                                    />}
                            </Card.Section>
                            <Group justify="space-between" mt="md" mb="xs" align='left'>
                                {(e.status == 'Em dia') ?
                                    <Badge color="green" variant="light">
                                        {e.status}
                                    </Badge>
                                    :
                                    <Badge color="pink" variant="light">
                                        {e.status}
                                    </Badge>}
                                <Badge color='white' variant='light'>
                                    {`${e.parcelas_pagas}/${e.parcelas.length}`}
                                </Badge>
                                <Text fw={500} lineClamp={1} size='md'>{e.objeto}</Text>
                            </Group>
                            <Text size='xs' c="dimmed" /* truncate="end" */ lineClamp={2}>{e.descricao}</Text>
                            <Group grow className='btns'>
                                {/* <Button variant="light" color="blue" fullWidth mt="md" radius="md" className='cardBtn' onClick={open}>Y</Button> */}
                                <Button /* className='btn' */ variant='light' onClick={() => {
                                    setParcelaData([]) //esvazia state para evitar efeitos indesejados
                                    openParcela(e.id)
                                }}><IconEye size={16} /></Button>
                                <Button /* className='btn' */ variant='light' onClick={openDeleteModal} color="red"><IconTrash size={16} /></Button>
                                <Button /* className='btn' */ variant='light' onClick={() => { handleEditFinanciamento(e.id) }} color="yellow"><IconPencil size={16} /></Button>
                            </Group>
                        </Card>
                    ))}
                </>
            </Group>

        )

    )


}