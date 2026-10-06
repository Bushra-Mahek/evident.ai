import api from "./axios.js";

export const getMetrics = async () => {
    const response = await api.get("/metrics");
    return response.data.metrics;
};