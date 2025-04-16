const TOKEN_KEY = 'token';

const isLogin = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};
const setRole = (role: string) => {
    localStorage.setItem("role", role)
}

const isAdmin = () => {
    const role = localStorage.getItem("role");
    return  role ==="1"
}

const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};


export {isLogin, getToken, setToken, clearToken, setRole, isAdmin};
