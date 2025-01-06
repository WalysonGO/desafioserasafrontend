import axios, { AxiosInstance } from 'axios';

export const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8000',
});

export const setAuthToken = (token: string): void => {
    if (token) {
        console.log(token);
        
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosClient.defaults.headers.common['Authorization'];
    }
};  
