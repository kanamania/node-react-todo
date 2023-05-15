import {API_URL} from "../../configs";
import axios from 'axios';
import {toast} from "react-toastify";

const token = localStorage.getItem('accessToken') ?? null;
export const login = (email, password) => {
    return axios.post(`${API_URL}/auth/login`,
        {email, password})
        .then(res => {
            if(res.data.status === 'success') {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                return res.data;
            }
        }).catch(error => {
            toast.error('Experiencing server issue at the moment. Please try again later.', {
                position: "top-right"
            });
            console.log(error);
        });
};
export const register = async (name, email, password) => {
    return await axios(`${API_URL}/auth/register`,
        {
            method: "POST",
            body: {name, email, password},
        }).catch(error => {
        toast.error('Experiencing server issue at the moment. Please try again later.', {
            position: "top-right"
        });
        console.log(error);
    });
};
export const forgot = async (email) => {
    return await axios(`${API_URL}/auth/forgot`,
        {
            method: "POST",
            body: {email},
        }).catch(error => {
        toast.error('Experiencing server issue at the moment. Please try again later.', {
            position: "top-right"
        });
        console.log(error);
    });
};
export const reset = async (email, code) => {
    return await axios(`${API_URL}/auth/reset`,
        {
            method: "POST",
            body: {email, code},
        }).catch(error => {
        toast.error('Experiencing server issue at the moment. Please try again later.', {
            position: "top-right"
        });
        console.log(error);
    });
};
export const verifyEmail = async (code) => {
    return await axios(`${API_URL}/auth/verify?code=${code}`,
        {
            method: "GET",
        }).catch(error => {
        toast.error('Experiencing server issue at the moment. Please try again later.', {
            position: "top-right"
        });
        console.log(error);
    });
};
export const getDetails = async () => {
    return await axios(`${API_URL}/users/me`,
        {
            method: "POST",
            body: {},
            headers: {
                "Authorization": `${token}`
            }
        }).catch(error => {
        toast.error('Experiencing server issue at the moment. Please try again later.', {
            position: "top-right"
        });
        console.log(error);
    });
};