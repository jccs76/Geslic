export const API_URL = "http://localhost:8080/api/v1"
export const AUTH_URL = "http://localhost:8080/auth"

export const authHeader :any = () => {

    let token = localStorage.getItem("token");
    if (token){
        return {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'};
    } else {
        return { Authorization: '' }; 
    }
}