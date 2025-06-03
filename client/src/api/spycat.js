import { fetchAPI } from "./api";

const API_URL = "/spycat/";

export const postSpycat = async (data) =>
    await fetchAPI(`${API_URL}`, {
        method: 'POST',
        body: data,
    });

export const getSpycat = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'GET',
    });

export const getSpycatList = async (skip = 0, limit = 10) =>
    await fetchAPI(`${API_URL}?${new URLSearchParams({ skip, limit })}`, {
        method: 'GET',
    });

export const putSpycat = async (id, data) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'PUT',
        body: data,
    });

export const deleteSpycat = async (id) =>
    await fetchAPI(`${API_URL}${id}`, {
        method: 'DELETE',
    });
