import './style.css'
import { Text, Card, Image, Badge, Button, Group, Modal, Table, Flex } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WalkLoading } from '../../components/Loadings/WalkLoading/WalkLoading';
import useApi from "../../services/financiamentoService"
import { FinanciamentoProps } from './types/Financiamento.type';
import ImagePlaceholder from '../../assets/image-placeholder.jpg'
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconTrash, IconEye, IconPencil } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications';

export const Financiamentos = () => {
    const apiServices = useApi();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanciamentoProps[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

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

    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
        </Table.Tr>
    ));
    return (
        loading ? <WalkLoading /> : (
            
                <Group justify='center'>
                    <Modal opened={opened} onClose={close} title="Parcelas" centered>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Element position</Table.Th>
                                    <Table.Th>Element name</Table.Th>
                                    <Table.Th>Symbol</Table.Th>
                                    <Table.Th>Atomic mass</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
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
                                    <Button /* className='btn' */ variant='light' onClick={open}><IconEye size={16} /></Button>
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