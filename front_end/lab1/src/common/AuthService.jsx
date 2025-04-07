import Cookies from 'js-cookie';

export const getAuthData = () => {
    return Cookies.get("token");
};

export const setAuthData = (data) => {
    Cookies.set("token", `Token ${data.token}`)
}