import {API_URL} from "../../configs";
import {toast} from "react-toastify";
import request from "../Interceptor";

const token = localStorage.getItem('accessToken');
export const addTodo = async (title, description, id) => {
    return await request.post(`${API_URL}/todos/`,
        {title, description, parentId: id ?? null},
        {
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
export const updateTodo = async (id, title, description) => {
    return await request.put(`${API_URL}/todos/${id}`,
        {title, description},
        {
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
export const toggleTodo = async (id) => {
    return await request.post(`${API_URL}/todos/toggle`,
        {id},
        {
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
export const deleteTodo = async (id) => {
    return await request.delete(`${API_URL}/todos/${id}`,
        {
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
export const getAll = async (params) => {
    return await request.get(`${API_URL}/todos/?${new URLSearchParams(params).toString()}`,
        {
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
export const getOne = async (id) => {
    return await request.get(`${API_URL}/todos/${id}`,
        {
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

export const inviteTodo = async (id, emails) => {
    return await request.post(`${API_URL}/todos/invite/${id}`,
        {emails},
        {
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
export const deleteTodoInvite = async (id, userId) => {
    return await request.delete(`${API_URL}/todos/invite/${id}/${userId}`,
        {
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
