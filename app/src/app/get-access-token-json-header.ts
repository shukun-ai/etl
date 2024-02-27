export const getAccessTokenJsonHeader = (accessToken?: string): HeadersInit => {
    if (accessToken) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    } else {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }
}