import { Container, Title, Text, Card, Image, Badge, Button, Group } from '@mantine/core';
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
            <Container size="md">
                <div className='mainContainer'>
                    {data.map((e) => (
                        <div className='cardContainer' key={e.id}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Image
                                        src="https://www.autocerto.com/fotos/337/894685/20.jpg"
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
                                    <Text fw={500}>{e.objeto}</Text>
                                </Group>
                                <Text size='xs' c="dimmeds" /* truncate="end" */ lineClamp={4}>DESCRIÇÃO MOCKADA DESCRIÇÃO MOCKADA</Text>
                                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                                    Detalhe
                                </Button>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
        )
    )


}