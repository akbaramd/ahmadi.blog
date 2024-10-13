import { readdir } from "fs/promises";
import { type Category } from "./categories"; // Ensure this is your Category type
import { MDXMetadata } from "./types"; // Import the MDXMetadata type

export interface Post extends MDXMetadata { // Extend Post with MDXMetadata
    slug: string;
}

export const postsPerPage = 3;

export async function getPosts(): Promise<Post[]> {
    // Retrieve slugs from post routes
    const slugs = (
        await readdir("./src/app/(posts)", { withFileTypes: true })
    ).filter((dirent) => dirent.isDirectory());

    // Retrieve metadata from MDX files
    const posts = await Promise.all(
        slugs.map(async ({ name }) => {
            // Specify that the imported module contains metadata of type MDXMetadata
            console.log(`./../app/(posts)/${name}/page.mdx`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const res = await import(`../app/(posts)/${name}/page.mdx`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { metadata }: { metadata: MDXMetadata } =res; 
            return { slug: name, ...metadata };
        })
    );

    // Sort posts from newest to oldest
    posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

    return posts;
}

export async function getPostsByCategory({
                                             category,
                                         }: {
    category: Category;
}): Promise<Post[]> {
    const allPosts = await getPosts();

    // Filter posts by specified category
    const posts = allPosts.filter(
        (post) => post.categories.includes(category)
    );

    return posts;
}

export async function getPaginatedPosts({
                                            page,
                                            limit,
                                        }: {
    page: number;
    limit: number;
}): Promise<{ posts: Post[]; total: number }> {
    const allPosts = await getPosts();

    // Get a subset of posts based on page and limit
    const paginatedPosts = allPosts.slice((page - 1) * limit, page * limit);

    return {
        posts: paginatedPosts,
        total: allPosts.length,
    };
}

export async function getPaginatedPostsByCategory({
                                                      page,
                                                      limit,
                                                      category,
                                                  }: {
    page: number;
    limit: number;
    category: Category;
}): Promise<{ posts: Post[]; total: number }> {
    const allCategoryPosts = await getPostsByCategory({ category });

    // Get a subset of posts based on page and limit
    const paginatedCategoryPosts = allCategoryPosts.slice(
        (page - 1) * limit,
        page * limit
    );

    return {
        posts: paginatedCategoryPosts,
        total: allCategoryPosts.length,
    };
}
