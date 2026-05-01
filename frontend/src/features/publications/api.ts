import { browserApi } from "@/lib/http/browser";
import { Publication, PublicationQuery, PublicationSlug } from "./types";
import { ApiCollection } from "../types";
import { isAxiosError } from "axios";


export async function getPublications(query: PublicationQuery = {}): Promise<Publication[]> {
    const response = await browserApi.get<ApiCollection<Publication>>('laravel/publications', {
        params: query,
    })
    
    return response.data.data
}

export async function getPublicationDetail(slug: PublicationSlug): Promise<Publication> {
    // console.log(slug.slug)
    const response = await browserApi.get<{data: Publication}>(`laravel/publications/${slug.slug}`, {
    })
    return response.data.data

}