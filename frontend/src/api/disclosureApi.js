import api from './axios.js';

export const getDisclosure = async (id)=>{
    const response = await api.get(`/disclosures/${id}`);
    return response.data;
}

export const getDisclosures = async ()=>{
    const response = await api.get("/disclosures");
    return response.data;
}

export const createDisclosure = async (reportingYear)=>{
    const response = await api.post("/disclosures",{
        reportingYear
    });
    return response.data;
};

export const updateDisclosure = async (id,data)=>{
    const response = await api.put(`/disclosures/${id}`,data);
    return response.data;
}

export const deleteDisclosure = async (id)=>{
    const response = await api.delete(`/disclosures/${id}`);
    return response.data;
}

export const submitDisclosure = async (id)=>{
    const response = await api.post(`/disclosures/${id}/submit`);
    return response.data;
};

export const getDisclosureReview = async (id) => {
    const response = await api.get(`/disclosures/${id}/review`);
    return response.data;
};