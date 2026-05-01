"use client"

import { PublicationView } from "@/features/publications/components/publication-view"
import { PublicationSlug } from "@/features/publications/types"
import { useParams } from 'next/navigation'
export default function PublicationDetailPage(){
const params =  useParams<PublicationSlug>()
return(
    <PublicationView {...params}/>
)
}