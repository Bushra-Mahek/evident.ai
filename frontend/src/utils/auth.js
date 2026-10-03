export function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export function getToken(){
    return localStorage.getItem("token");
}

export function isAuthenticated(){
    return !!getToken;
}

export function saveSession(token, user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
}

export function getUser(){
    const stored = localStorage.getItem("user");
    if(!stored){
        return null;
    }
    try{
        return JSON.parse(stored);
    }
    catch{
        return null;
    }
}