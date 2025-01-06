import { useMutation, UseMutationResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';
import { notifications } from '@mantine/notifications';

interface User {
    email: string;
    password: string;
}

export interface ResponseUser {
    message: string;
}

const fetchUserCreate = async (user: User): Promise<ResponseUser> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }

    const res = await axiosClient.post<ResponseUser>(`/users/register`, { ...user });

    return {
        message: res.data.message
    };
};

export function useUserCreate(): UseMutationResult<ResponseUser, Error, User> {
    return useMutation<ResponseUser, Error, User>(fetchUserCreate, {
        onSuccess: () => {
            notifications.show({
                title: 'Sucesso',
                message: 'Usuario criado com sucesso!',
                color: 'green',
            });
        },
        onError: (error) => {
            if (error.message === 'Request failed with status code 400') {
                notifications.show({
                    title: 'Erro',
                    message: 'E-mail ou Senha inválidos',
                    color: 'red',
                });
            } else {
                notifications.show({
                    title: 'Erro',
                    message: 'Ocorreu um erro ao criar o usuário.',
                    color: 'red',
                });
            }
        } 
    });
}