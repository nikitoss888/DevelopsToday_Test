import { fetchAPI } from "./api";

const API_URL = "/target/";

export const postTarget = async (mission_id, data) =>
    await fetchAPI(`/mission/${mission_id}${API_URL}`, {
        method: 'POST',
        body: data,
    });

export const getTarget = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'GET',
    });

export const getTargetList = async (mission_id) =>
    await fetchAPI(`/mission/${mission_id}${API_URL}`, {
        method: 'GET',
    });

export const putTarget = async (id, data) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'PUT',
        body: data,
    });

export const deleteTarget = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'DELETE',
    });