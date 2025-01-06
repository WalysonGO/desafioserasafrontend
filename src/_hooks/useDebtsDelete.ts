import { useMutation, UseMutationResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';
import { notifications } from '@mantine/notifications';

export interface ResponseDebt {
    message: string;
}

interface Debt {
    debt_id: string;
}

// Função para atualizar a dívida  
const fetchDebtDelete = async (debt_id: string): Promise<ResponseDebt> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }

    await axiosClient.delete<ResponseDebt>(`/debts/${debt_id}/`);

    return {
        message: 'Dívida deletada com sucesso!',
    };
};

// Hook para usar a atualização da dívida  
export function useDebtDelete(): UseMutationResult<ResponseDebt, Error, string> {
    return useMutation<ResponseDebt, Error, string>(fetchDebtDelete, {
        onSuccess: () => {
            notifications.show({
                title: 'Sucesso',
                message: 'Dívida deletada com sucesso!',
                color: 'green',
            });
        },
        onError: (error) => {
            console.error('Erro ao atualizar dívida:', error);
            notifications.show({
                title: 'Erro',
                message: error.message || 'Ocorreu um erro ao deletar a dívida.',
                color: 'red',
            });
        }
    });
}