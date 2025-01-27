"use client";

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import {
    Container,
    Title,
    Text,
    Anchor,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classes from './page.module.css';

const Home: React.FC = () => {
    const [btnLoginLoading, setBtnLoginLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: 'teste@teste.com',
            password: '12345678',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
            password: (value) => (value.length >= 6 ? null : 'Senha muito curta'),
        },
    });

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>, values: { email: string; password: string }) => {
        event.preventDefault();
        setBtnLoginLoading(true);
        const result: any = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
        });

        if (result.status === 401 || result.error) {
            setBtnLoginLoading(false);
            notifications.show({
                title: 'Erro',
                message: 'E-mail ou Senha inválidos',
                color: 'red',
            })
        } else {
            setBtnLoginLoading(false);
            // router.push('/dashboard');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title className={classes.title}>
                Gestão de Dívidas Pessoais
            </Title>
            <Text color="dimmed" size="sm" mt={5}>
                Não tem uma conta?{' '}
                <Anchor size="sm" href="/register" component="a" className={classes.link}>
                    Crie uma agora
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md" className={classes.paper}>
                <form className={classes.form}>
                    <TextInput
                        label="E-mail"
                        placeholder="email@example.com"
                        required
                        {...form.getInputProps('email')}
                        className={classes.input}
                    />
                    <PasswordInput
                        label="Senha"
                        placeholder="Sua senha segura"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                        className={classes.input}
                    />
                    <Button type="submit" fullWidth mt="xl" color="#ba005a" onClick={(e: any) => handleLogin(e, form.values)} className={classes.button}>
                        {btnLoginLoading ? <Loader color="white" size="xs" /> : 'Acessar'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Home;