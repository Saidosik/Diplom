import { CodeRender } from "@/components/ui/CodeBlock";
import { Publication, PublicationBlockContent } from "../types";

export default function PublicationBlockRender(blocks: PublicationBlockContent[]) {

    console.log(blocks)
    return (
        <div className="">
            {
                blocks.map((block) => {
                    switch (block.type) {
                        case 'heading':
                            // Доступ к тексту: block.properties.text
                            // Доступ к уровню заголовка: block.properties.level
                            return <h2 key={block.id}>{block.properties.text}</h2>;

                        case 'paragraph':
                            // У параграфа в properties, скорее всего, тоже поле text
                            return <p key={block.id}>{block.properties.text}</p>;

                        case 'link':
                            // У ссылки в properties могут быть url и text
                            return (
                                <a key={block.id} href={block.properties.url}>
                                    {block.properties.title}
                                </a>
                            );
                        case 'image':
                            // У ссылки в properties могут быть url и text
                            return (
                                <a key={block.id} href={block.properties.url}>
                                    {block.properties.caption}
                                </a>
                            );
                        case 'image':
                            // У ссылки в properties могут быть url и text
                            return (
                                // CodeRender(block)
                                "sdfsf"
                            );


                        default:
                            return <div key={block.id}>Неизвестный блок: {block.type}</div>;
                    }
                })
            }
        </div>
    )


}