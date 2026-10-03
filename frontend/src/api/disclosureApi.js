import api from './axios.js';

export const getDisclosure = async ()=>{
    const response = await api.get("disclosure");
    return response.data;

}