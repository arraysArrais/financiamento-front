import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Loader,
} from '@mantine/core';
import { GoogleButton } from './Buttons/GoogleButton';
import { TwitterButton } from './Buttons/TwitterButton';
import useAuth from "../../auth/api"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const authApi = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(){
    setIsLoading(true);
    let loginResponse = await authApi.login(emailInput, passwordInput);
    setIsLoading(false);
    /* console.log(loginResponse) */
    navigate('/')
  }
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Bem vindo(a), faça login com
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
       {/*  <TwitterButton radius="xl">Twitter</TwitterButton> */}
      </Group>

      <Divider label="ou entre com email e senha" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
          <TextInput
            required
            label="E-mail"
            placeholder="Seu e-mail"
            value={form.values.email}
            onChange={(event) => {
              form.setFieldValue('email', event.currentTarget.value)
              setEmailInput(event.currentTarget.value)
            }}
            error={form.errors.email && 'E-mail inválido'}
            radius="md"
          />

          <PasswordInput
            required
            label="Senha"
            placeholder="Sua senha"
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue('password', event.currentTarget.value)
              setPasswordInput(event.currentTarget.value)
            }}
            error={form.errors.password && 'Senha deve ter no mínimo 6 caracteres'}
            radius="md"
          />
        <Group justify="center" mt="xl">
          {isLoading ? <Loader/> : <Button type='submit' onClick={handleLogin} radius="xl">Entrar</Button>}
        </Group>
      </form>
    </Paper>
  );
}
