// const BASE_URL = "http://localhost:3000";
const BASE_URL = "http://192.168.1.5:3000";
export default BASE_URL;

export const apiFetch = (path, options = {}) => {
    const isFormData = options.body instanceof FormData;

    return fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    });
};