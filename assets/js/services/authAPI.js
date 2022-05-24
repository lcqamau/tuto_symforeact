import axios from "axios";
import CustomersAPI from "./customersAPI";
import jwtDecode from "jwt-decode";

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
};

function authenticate(credentials){
    return axios
        .post("/api/login_check", credentials)
        .then(response =>response.data.token)
        .then(token => {
            //Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            //On previens axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        });
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup(){
    const token = window.localStorage.getItem("authToken");

    if(token) {
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if(token) {
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime()) {
            return true; 
        }
        return false;
        }
    return false;

}


export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
}