import axios from "axios";

export const browserApi = axios.create({
    baseURL: "/api",
    headers:{
        Accept: "application/json"
    }
})