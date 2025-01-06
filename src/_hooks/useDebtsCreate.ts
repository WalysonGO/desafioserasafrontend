import { useMutation, UseMutationResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';
import { notifications } from '@mantine/notifications';

interface Debt {
    title: string;
    amount: number;
    due_date: string;
    status?: string;
    observations: string;
}

export interface ResponseDebt {
    title: string;
    amount: number;
    due_date: string;
    status: string;
    observations: string;
    created_at: string;
    updated_at: string;
}

const fetchDebtsCreate = async (debt: Debt): Promise<ResponseDebt> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }

    const res = await axiosClient.post<ResponseDebt>(`/debts/`, { ...debt, due_date: new Date(debt.due_date).toISOString().split('T')[0] });

    return {
        title: res.data.title,
        amount: res.data.amount,
        due_date: res.data.due_date,
        status: res.data.status,
        observations: res.data.observations,
        created_at: res.data.created_at,
        updated_at: res.data.updated_at,
    };
};

export function useDebtsCreate(): UseMutationResult<ResponseDebt, Error, Debt> {
    return useMutation<ResponseDebt, Error, Debt>(fetchDebtsCreate, {
        onSuccess: (data) => {
            notifications.show({
                title: 'Sucesso',
                message: 'Dívida criada com sucesso!',
                color: 'green',
            });
        },
        onError: (error) => {
            console.error('Erro ao criar dívida:', error);
            notifications.show({
                title: 'Erro',
                message: error.message || 'Ocorreu um erro ao criar a dívida.',
                color: 'red',
            });
        } 
    });
}