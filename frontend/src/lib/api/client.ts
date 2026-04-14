import axios from "axios";

export const api = axios.create({
    baseURL:process.env.BACKEND_API_URL,
    timeout:8000,
    headers:{
        "Content-Type": "application/json",
    }
})

