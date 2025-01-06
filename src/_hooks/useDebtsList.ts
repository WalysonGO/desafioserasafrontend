import { useQuery, UseQueryResult } from 'react-query';
import { axiosClient } from '../_utils/axiosClient';

interface Debt {
    title: string;
    amount: number;
    due_date: string;
    status: string;
    observations: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface ResponseDebt {
    data: Debt[] | [];
    total: number;
    perPage: number;
    current: number;
    next: number | null;
    prev: number | null;
}

const fetchDebts = async (page: string, perPage: string, status: string): Promise<ResponseDebt> => {
    const get_token = localStorage.getItem('accessToken');
    if (get_token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${get_token}`;
    }

    const res = await axiosClient.get<ResponseDebt>(`/debts/?page=${page}&per_page=${perPage}&status=${status ? status : 'all'}`);

    return {
        data: res.data.data,
        total: res.data.total,
        perPage: res.data.perPage,
        current: res.data.current,
        next: res.data.next,
        prev: res.data.prev
    };
};  

export function useDebtsList(page: string, perPage: string, status: string): UseQueryResult<ResponseDebt, Error>{  
    return useQuery(['debts', page, perPage, status], () => fetchDebts(page, perPage, status), {
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
        refetchInterval: 60000,
    });
};