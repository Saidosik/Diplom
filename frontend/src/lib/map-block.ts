// lib/map-blocks.ts

import { PublicationBlockContent } from "@/features/publications/types";

export function mapBlock(block: PublicationBlockContent): PublicationBlockContent | null {
  const base = {
    id: block.id,
    sort_order: block.sort_order,
    type: block.type,
  };

  // Простейшая валидация (можно заменить на Zod при желании)
  switch (block.type) {
    case 'heading':
      if (typeof block.properties.text === 'string' && typeof block.properties.level === 'number') {
        return { ...base, properties: block.properties as any };
      }
      break;
    case 'code':
      if (typeof block.properties.code === 'string') {
        return { ...base, properties: block.properties as any };
      }
      break;
    // ... все остальные типы
    default:
      return null;
  }
  return null;
}