import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {"Content-Type": "application/json"}

});

api.interceptors.request.use(
    (config)=>{
        const token = getToken();
        if(token){
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error)
    }
    
);

api.interceptors.response.use(
    (response) =>{
        return response;
    },

    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("token");
            window.location.href= "/login";
        }

        return Promise.reject(error);
    }
);



export default api;