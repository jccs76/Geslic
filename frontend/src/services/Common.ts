export const API_URL = "http://localhost:8080/api/v1"
export const AUTH_URL = "http://localhost:8080/auth"

export const authHeader : any = () => {
    
    let token = localStorage.getItem("token");
    if (token){
        return {'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'Cache-Control': 'no-cache'};
    } else {
        return { Authorization: '' }; 
    }
}