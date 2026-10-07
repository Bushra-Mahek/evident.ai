import api from "./axios.js";

export const runValidation = async (disclosureId) => {
    const response = await api.post(
        `/validation/${disclosureId}/validate`
    );

    return response.data;
};

export const getValidationResults = async (disclosureId) => {
    const response = await api.get(
        `/validation/${disclosureId}`
    );

    return response.data;
};