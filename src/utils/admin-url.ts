const url = (): string => {
    return import.meta.env.VITE_API_ADMIN_URL
}
const base = (): string => {
    return import.meta.env.VITE_API_BASE_URL
}
export const baseUrl = base();

export const adminUrl = url();

