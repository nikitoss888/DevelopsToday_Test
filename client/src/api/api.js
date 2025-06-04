const API_URL = "http://127.0.0.1:8000";

class APIError extends Error {
    constructor(message, status, content) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.content = content;
    }
}

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
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(content => {
                    throw new APIError(`HTTP error! status: ${response.status}`, response.status, content);
                });
            }
            return response;
        })
        .catch(error => {
            if (error instanceof APIError) {
                throw error; // Re-throw APIError for handling in the calling code
            }
            throw new Error(`Network error: ${error.message}`);
        });

    if (!res.ok) {
        throw new APIError(`HTTP error! status: ${res.status}`, res.status, await res.json());
    }

    return await res.json();
}