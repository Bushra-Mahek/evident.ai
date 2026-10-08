import api from "./axios.js";

export const getCertificates = async () => {
    const response = await api.get("/certificates");
    return response.data;
};

export const getCertificate = async (id) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
};