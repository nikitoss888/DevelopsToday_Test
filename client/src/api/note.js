import { fetchAPI } from "./api";

const API_URL = "/note/";

export const postNote = async (target_id, data) =>
    await fetchAPI(`/target/${target_id}${API_URL}`, {
        method: 'POST',
        body: data,
    });

export const getNote = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'GET',
    });

export const getNoteList = async (target_id) =>
    await fetchAPI(`/target/${target_id}${API_URL}`, {
        method: 'GET',
    });

export const putNote = async (id, data) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'PUT',
        body: data,
    });

export const deleteNote = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'DELETE',
    });