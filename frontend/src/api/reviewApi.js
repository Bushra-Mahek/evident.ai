import api from "./axios.js";

export const getPendingReviews = async () => {
    const response = await api.get("/disclosures/pending-review");
    return response.data;
};

export const getDisclosureReview = async (id) => {
    const response = await api.get(`/disclosures/${id}/review`);
    return response.data;
};

export const verifyDisclosure = async (id) => {
    const response = await api.patch(`/verifications/${id}/verify`);
    return response.data;
};

export const rejectDisclosure = async (id, notes) => {
    const response = await api.patch(
        `/verifications/${id}/reject`,
        { notes }
    );
    return response.data;
};

export const getCompletedReviews = async () => {
    const response = await api.get("/disclosures/completed-reviews");
    return response.data;
};

export const getDisclosureTimeline = async (id) => {
    const response = await api.get(`/disclosures/${id}/timeline`);
    return response.data;
};