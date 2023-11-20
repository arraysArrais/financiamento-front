import './style.css'
import { Text, Card, Image, Badge, Button, Group, Modal, Loader, } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WalkLoading } from '../../components/Loadings/WalkLoading/WalkLoading';
import useApi from "../../services/financiamentoService"
import { FinanciamentoProps } from './types/Financiamento.type';
import ImagePlaceholder from '../../assets/image-placeholder.jpg'
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconTrash, IconEye, IconPencil } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications';
import ParcelaTable from '../../components/DataTable/DataTable';
import { Parcela } from '../../components/DataTable/types/ParcelaProps'

export const Financiamentos = () => {
    const apiServices = useApi();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanciamentoProps[]>([]);
    const [parcelaModal, { open: openParcelaModal, close: closeParcelaModal }] = useDisclosure(false); //modal tabela de parcelas
    const [parcelaData, setParcelaData] = useState<Parcela[]>([]);
    const [parcelasLoading, setParcelasLoading] = useState(false);

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
    }, []);

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

    return (
        loading ? <WalkLoading /> : (
            <Group justify='center'>
                <Modal opened={parcelaModal} onClose={closeParcelaModal} title="Parcelas" size={'md'} centered>
                    {parcelasLoading ? <Group justify='center' style={{ padding: 10 }}><Loader color="violet" type="oval" /></Group> : <ParcelaTable data={parcelaData} />}
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
                            <Text size='xs' c="dimmed" /* truncate="end" */ lineClamp={2}>DESCRIÇÃO MOCKADA DESCRIÇÃO MOCKADA</Text>
                            <Group grow className='btns'>
                                {/* <Button variant="light" color="blue" fullWidth mt="md" radius="md" className='cardBtn' onClick={open}>Y</Button> */}
                                <Button /* className='btn' */ variant='light' onClick={() => {
                                    setParcelaData([]) //esvazia state para evitar efeitos indesejados
                                    openParcela(e.id)
                                }}><IconEye size={16} /></Button>
                                <Button /* className='btn' */ variant='light' onClick={openDeleteModal} color="red"><IconTrash size={16} /></Button>
                                <Button /* className='btn' */ variant='light' color="yellow"><IconPencil size={16} /></Button>
                            </Group>
                        </Card>
                    ))}
                </>
            </Group>

        )

    )


}