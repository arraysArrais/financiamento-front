import { Text, Card, Image, Badge, Button, Group, Flex } from '@mantine/core';
import './style.css'
import { useEffect, useState } from 'react';
import { WalkLoading } from '../../components/Loadings/WalkLoading/WalkLoading';
import useApi from "../../services/financiamentoService"
import { FinanciamentoProps } from './types/Financiamento.type';

export const Financiamentos = () => {
    const apiServices = useApi();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanciamentoProps[]>([]);

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
    return (
        loading ? <WalkLoading /> : (
            <Flex gap={50} className='rolo' justify={'center'}>
                <>
                    {data.map((e) => (
                        <Card shadow="sm" padding="lg" radius="md" className='cardFinanciamento' withBorder key={e.id}>
                            <Card.Section>
                                <Image
                                    src={"https://www.autocerto.com/fotos/337/894685/20.jpg"}
                                    height={160}
                                    alt="Norway"
                                />
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
                            <Text size='xs' c="dimmeds" /* truncate="end" */ lineClamp={2}>DESCRIÇÃO MOCKADA DESCRIÇÃO MOCKADA</Text>
                            <Button variant="light" color="blue" fullWidth mt="md" radius="md" className='cardBtn'>Detalhe</Button>
                        </Card>
                    ))}
                </>
            </Flex>
        )
    )


}