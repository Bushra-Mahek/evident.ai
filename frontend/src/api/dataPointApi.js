import api from "./axios.js";

export const createDataPoint = async (data) => {
    const response = await api.post("/data-points", data);
    return response.data;
};

export const getDataPointsByDisclosure = async (disclosureId) => {
    const response = await api.get(
        `/data-points/disclosure/${disclosureId}`
    );
    return response.data;
};

export const updateDataPoint = async (id, data) => {
    const response = await api.put(`/data-points/${id}`, data);
    return response.data;
};