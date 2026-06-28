const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000" || "http://192.168.1.90:3000" ;
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