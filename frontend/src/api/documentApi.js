import api from "./axios.js";

export const getDocumentsByDisclosure = async (disclosureId) => {
    const response = await api.get(
        `/documents/disclosure/${disclosureId}`
    );

    return response.data;
};


export const uploadDocument = async (disclosureId, file) => {

    const formData = new FormData();

    formData.append("disclosureId", disclosureId);
    formData.append("document", file);

    const response = await api.post(
        "/documents",
        formData
    );

    return response.data;
};


export const getDocument = async (id) => {

    const response = await api.get(
        `/documents/${id}`
    );

    return response.data;
};