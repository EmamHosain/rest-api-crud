export const getHeaderConfig = (token) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            'Content-Type': 'multipart/form-data',
        }
    }
    return config;
}