const API_URL = "http://127.0.0.1:8000";

export const fetchAPI = async (endpoint, options = {
    method: 'GET',
    headers: {},
    body: null,
}) => {
    if (!endpoint.startsWith('/')) {
        throw new Error("Endpoint must start with '/'");
    }
    if (!options.headers) {
        options.headers = {};
    }
    if (!options.method) {
        options.method = 'GET';
    }
    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
    }
    if (options.headers['Content-Type'] === undefined) {
        options.headers['Content-Type'] = 'application/json';
    }
    if (options.headers['Accept'] === undefined) {
        options.headers['Accept'] = 'application/json';
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
}