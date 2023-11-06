import classes from './HeroBullets.module.css';
import { Container, Title, Text, Card, Image, Badge, Button, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import './style.css'
import { useEffect, useState } from 'react';
import {SquirtleLoading} from '../../components/SquirtleLoading/SquirtleLoading';


export const Financiamentos = () => {
    const mockedData = [
        {
            id: 1,
            objeto: "GOL 1.6 MSI 8V 2022",
            status: "pendente",
            ultima_parcela: "06/11/2022",
            status_ult_parcela: "PAGO",
            descricao: 'Carro muito novo, pouco usado, carro de idosa, carro de garagem, usado somente aos fins de semana, carro de rodovia, nunca foi uber e nunca levou tiro',
            total_parcelas: 48,
            parcelas_pagas: 8,
        },
        {
            id: 2,
            objeto: "GOL 1.6 MSI 8V 2021",
            status: "pendente",
            ultima_parcela: "06/11/2022",
            status_ult_parcela: "PAGO",
            descricao: 'Carro muito novo, pouco usado, carro de idosa, carro de garagem, usado somente aos fins de semana, carro de rodovia, nunca foi uber e nunca levou tiro',
            total_parcelas: 48,
            parcelas_pagas: 21,
        },
        {
            id: 3,
            objeto: "GOL 1.6 MSI 8V 2020",
            status: "pendente",
            ultima_parcela: "06/11/2022",
            status_ult_parcela: "PAGO",
            descricao: 'Carro muito novo, pouco usado, carro de idosa, carro de garagem, usado somente aos fins de semana, carro de rodovia, nunca foi uber e nunca levou tiro',
            total_parcelas: 36,
            parcelas_pagas: 15,
        }
    ]
    const [loading, setLoading] = useState(true);

    //simulando carregamento da chamada api
    useEffect(() => {
        setTimeout(() =>{
            setLoading(false)
            console.log("Carregado!")
        }, 2000)
    },[]);

    
    return (
        loading ? <SquirtleLoading/> : (
            <Container size="md">
                <div className='mainContainer'>
                    {mockedData.map((e) => (
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
                                    <Badge color="pink" variant="light">
                                        {e.status}
                                    </Badge>
                                    <Badge color='white' variant='light'>
                                        {`${e.parcelas_pagas}/${e.total_parcelas}`}
                                    </Badge>
                                    <Text fw={500}>{e.objeto}</Text>
                                </Group>
                                <Text size='sm' c="dimmeds" /* truncate="end" */ lineClamp={4}>
                                    {e.descricao}
                                </Text>
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