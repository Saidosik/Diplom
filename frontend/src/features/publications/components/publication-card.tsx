import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
   
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Publication } from "../types";

export function publicationCard(publications: Publication[]) {
    return (
        <>
            {publications.map(publication => (
                <Card key={publication.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>{publication.title}</CardTitle>
                                <CardDescription>
                                    
                                        {publication.excerpt}
                                </CardDescription>
                            </div>
                        </div>
                         <CardAction><Link href={`publications/${publication.slug}`}>{publication.slug}</Link></CardAction>
                    </CardHeader>

                    <CardContent>
                    </CardContent>

                    <CardFooter>
                        <Button>Открыть</Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}