import { fetchAPI } from "./api";

const API_URL = "/mission/";

export const postMission = async (data) =>
    await fetchAPI(`${API_URL}`, {
        method: 'POST',
        body: data,
    });

export const getMission = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'GET',
    });

export const getMissionList = async (skip = 0, limit = 10) =>
    await fetchAPI(`${API_URL}?${new URLSearchParams({ skip, limit })}`, {
        method: 'GET',
    });

export const putMission = async (id, data) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'PUT',
        body: data,
    });

export const deleteMission = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'DELETE',
    });