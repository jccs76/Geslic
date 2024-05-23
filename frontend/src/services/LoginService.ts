import { App } from "@/types";
import { AUTH_URL } from "./Common";

export const LoginService = {
    login(credentials : App.LoginType) {
        return fetch(AUTH_URL + '/login', 
            {   method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials)
            })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    }
}