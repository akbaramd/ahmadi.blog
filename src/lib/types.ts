// src/lib/types.ts
import {Category} from "@/lib/categories";

export interface MDXMetadata {
    title: string;
    publishDate: string;
    categories: Category[];
}
