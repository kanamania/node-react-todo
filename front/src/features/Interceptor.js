import axios from "axios";
import {toast} from "react-toastify";

const handleError = (error) => {
    toast.error('Experiencing server issue at the moment. Please try again later.', {
        position: "top-right"
    });
};
const handleResponse = (response) => {
    if (response.status === 401) {
        setTimeout(() => {
            console.log('called ')
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }, 500);
    }
    return response;
};
const request = axios.create();
request.interceptors.request.use(
    (config) => {
        config.headers = {'Authorization': localStorage.getItem('accessToken')};
        return config;
    },
    (error) => {
        handleError(error);
        return Promise.reject(error);
    }
);
request.interceptors.response.use(
    (response) => handleResponse(response),
    (error) => {
        handleError(error);
        return Promise.reject(error);
    }
);

export default request;