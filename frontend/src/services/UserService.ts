import { App } from "@/types";
import { API_URL, authHeader } from "./Common";


export const UserService = {
    getUsers() {
        return fetch(API_URL + '/users', { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getUser(id : string | undefined) {
        return fetch(`${API_URL}/users/${id}`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createUser(user : App.UserType) {
        return fetch(`${API_URL}/users`, 
            {   method: 'POST', 
                headers: authHeader(),
                body: JSON.stringify(user)
            })
            
            .catch( (error) => console.log(error));
    },    
    updateUser(id: string, user : App.UserType) {
        return fetch(`${API_URL}/users/${id}`, 
            {   method: 'PUT', 
                headers: authHeader(),
                body: JSON.stringify(user)
            })
            .catch( (error) => console.log(error));
    },    
    deleteUser(id : string | undefined) {        
        return fetch(`${API_URL}/users/${id}`, {method: "DELETE", headers: authHeader() })    
        .catch( (error) => console.log(error));
    }
};