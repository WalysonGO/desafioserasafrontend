import { useMutation, UseMutationResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';
import { notifications } from '@mantine/notifications';

interface Debt {
    id: string;
    title: string;
    amount: number;
    due_date: Date | string;
    status?: string;
    observations: string;
}

export interface ResponseDebt {
    id: string;
    title: string;
    amount: number;
    due_date: string;
    status: string;
    observations: string;
    created_at: string;
    updated_at: string;
}

// Função para atualizar a dívida  
const fetchDebtUpdate = async (debt: Debt): Promise<ResponseDebt> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }
    const dueDate = new Date(debt.due_date);
    const formattedDate = dueDate.toISOString().split('T')[0].split('-').reverse().join('/')
    
    const res = await axiosClient.put<ResponseDebt>(`/debts/${debt.id}/`, {
        ...debt, id: undefined, due_date: formattedDate
    });

    return {
        id: res.data.id,
        title: res.data.title,
        amount: res.data.amount,
        due_date: res.data.due_date,
        status: res.data.status,
        observations: res.data.observations,
        created_at: res.data.created_at,
        updated_at: res.data.updated_at,
    };
};

// Hook para usar a atualização da dívida  
export function useDebtUpdate(): UseMutationResult<ResponseDebt, Error, Debt> {
    return useMutation<ResponseDebt, Error, Debt>(fetchDebtUpdate, {
        onSuccess: () => {
            notifications.show({
                title: 'Sucesso',
                message: 'Dívida atualizada com sucesso!',
                color: 'green',
            });
        },
        onError: (error) => {
            console.error('Erro ao atualizar dívida:', error);
            notifications.show({
                title: 'Erro',
                message: error.message || 'Ocorreu um erro ao atualizar a dívida.',
                color: 'red',
            });
        }
    });
}