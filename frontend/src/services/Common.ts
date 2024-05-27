const CURRENT_HOST = `${window.location.protocol}//${window.location.hostname}:8080`; //On production, substitute 8080 for ${window.location.port}

export const API_URL = `${CURRENT_HOST}/api/v1`;
export const AUTH_URL = `${CURRENT_HOST}/auth`;

export const authHeader : any = () => {
    let token = localStorage.getItem("token");
    if (token){
        return {'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'Cache-Control': 'no-cache'};
    } else {
        return { Authorization: '' }; 
    }
}