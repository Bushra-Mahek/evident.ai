import api from './axios.js';


export const authApiLogin = async(email,password)=>{
    const response = await api.post("/auth/login",{
        email,
        password
    });
    return response.data;
}

export const authApiRegister = async(fullName,email,password,role,companyId)=>{
    const response = await api.post("auth/register",{
        fullName: fullName,
            email,
            password,
            role,
            companyId: companyId || null
    });
    return response.data;
}