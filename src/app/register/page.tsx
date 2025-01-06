"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import classes from '../page.module.css';
import { useUserCreate } from '@/_hooks/useUserCreate';

const Register: React.FC = () => {
    const { data: session, status } = useSession();
    const { mutate: userCreate, isLoading, error } = useUserCreate()
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
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

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>, values: { email: string; password: string }) => {
        event.preventDefault();
        if (!form.validate().hasErrors && form.values.email !== '' && form.values.password !== '') {
            userCreate(form.values);
            if (!error) {
                router.push('/');
            }
        } else {
            form.validate();
        }
    };

    return (
        <Container size={420} my={40}>
            <Title className={classes.title}>
                Gestão de Dívidas Pessoais
            </Title>
            <Text color="dimmed" size="sm" mt={5}>
                Acesse sua conta{' '}
                <Anchor size="sm" href="/" component="a" className={classes.link}>
                    Acessar
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
                    <Button type="submit" fullWidth mt="xl" color="#ba005a" onClick={(e: any) => handleRegister(e, form.values)} className={classes.button}>
                        {isLoading ? <Loader color="white" size="xs" /> : 'Cadastrar'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;