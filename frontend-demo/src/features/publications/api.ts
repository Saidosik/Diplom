import { browserApi } from "@/lib/http/browser";
import { Publication, PublicationQuery } from "./types";
import { ApiCollection } from "@/features/types";

export async function getPublications(query: PublicationQuery = {}): Promise<Publication[]> {
    const response = await browserApi.get<ApiCollection<Publication>>('laravel/publications', {
        params: query,
    })
    
    return response.data.data
}