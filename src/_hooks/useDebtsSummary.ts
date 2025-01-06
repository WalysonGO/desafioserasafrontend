import { useQuery, UseQueryResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';

interface DebtsSummary {
    total_debts: number;
    total_overdue: number;
    total_pending: number;
    total_paid: number;
    percentage_paid: number;
    percentage_pending: number;
    percentage_overdue: number;
    total_debt_value: number;
    total_pending_value: number;
    total_paid_value: number;
    total_overdue_value: number;
    average_debt_value: number;
}

const fetchDebtsSummary = async (): Promise<DebtsSummary> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }

    const date = new Date();
    const date_now = `${date.getDate() }/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const { data } = await axiosClient.get<DebtsSummary>('/debts/summary?date_to=' + date_now);
    
    return data;
};

export const useDebtsSummary = (): UseQueryResult<DebtsSummary> => {
    return useQuery<DebtsSummary, Error>('debtsSummary', fetchDebtsSummary, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
        refetchInterval: 60000,
    });
};