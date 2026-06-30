const BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.1.12:3000" ;
export default BASE_URL;

let onUnauthorized = null;
export const registerUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export const apiFetch = async(path, options = {}) => {
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    });

    if (res.status === 401) onUnauthorized?.();

    return res
};