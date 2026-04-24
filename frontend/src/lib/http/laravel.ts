import axios from "axios"

export default function createLaravelApi(accessToken?: string | null){
    const baseURL = process.env.LARAVEL_API_URL

    if(!baseURL){
        throw new Error('Laravel API mo defined')
    }

    return axios.create({
        baseURL,
        headers:{
            Accept:"application/json",
            ...(accessToken? {Authorization: `Bearer ${accessToken}`} : {})
        }
    })
}