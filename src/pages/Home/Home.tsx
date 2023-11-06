import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Notification } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import image from './image.svg';
import classes from './HeroBullets.module.css';


export const Home = () => {
    return (

        <Container size="md">
            {/*  <Notification color="violet" title="Seja bem vindo!" onClose={() => notifications.clean()}>
                You are now obligated to give a star to Mantine project on GitHub
            </Notification> */}
            <Button onClick={() =>
                notifications.show({
                    title: 'Default notification',
                    message: 'Hey there, your code is awesome! 🤥',
                })
            }>
                Teste de notificação
            </Button>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Gerenciar um financimento grande é <span className={classes.highlight}>horrível</span>, né?
                    </Title>
                    <Text c="dimmed" mt="md">
                        Por isso desenvolvi um app para cuidar disso para você.
                    </Text>

                    <List
                        mt={30}
                        spacing="sm"
                        size="sm"
                        icon={
                            <ThemeIcon size={20} radius="xl">
                                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </ThemeIcon>
                        }
                    >
                        <Group>
                            <List.Item><b>Metodologia Go Horse</b> – Muita solução de contorno <s>gambiarra</s>.</List.Item>
                            <List.Item><b>Grátis e open source</b> – Achou um lixo? Faz melhor e abre um PR.</List.Item>
                            <List.Item><b>Notificações em tempo real</b> – Seja notificado após baixa na fatura.</List.Item>
                        </Group>
                    </List>

                    <Group mt={30}>
                        <Button radius="xl" size="md" className={classes.control}>Primeiros passos</Button>
                        <Button variant="default" radius="xl" size="md" className={classes.control}>Código fonte</Button>
                    </Group>
                </div>
                <Image src={image} className={classes.image} />
            </div>
        </Container>
    );
}