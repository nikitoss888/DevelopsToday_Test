import { fetchAPI } from "./api";

export const getMissions = async () => {
    const response = await fetchAPI("/missions");
    return response.json();
};
