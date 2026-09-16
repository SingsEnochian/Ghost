import type {GhostPost} from '../book/types';

interface GhostApiPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    html?: string;
    published_at?: string;
}

interface GhostApiResponse {
    posts: GhostApiPost[];
}

const apiUrl = import.meta.env.VITE_GHOST_CONTENT_API_URL as string | undefined;
const apiKey = import.meta.env.VITE_GHOST_CONTENT_API_KEY as string | undefined;

export const ghostConfigured = Boolean(apiUrl && apiKey);

export async function loadGhostPosts(limit = 5): Promise<GhostPost[]> {
    if (!apiUrl || !apiKey) {
        return [];
    }

    const root = apiUrl.replace(/\/$/, '');
    const url = new URL(`${root}/ghost/api/content/posts/`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('include', 'tags,authors');

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ghost Content API returned ${response.status}`);
    }

    const data = (await response.json()) as GhostApiResponse;
    return data.posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        html: post.html,
        publishedAt: post.published_at
    }));
}
