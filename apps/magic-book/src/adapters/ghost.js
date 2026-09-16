function readConfig() {
    const params = new URLSearchParams(window.location.search);
    return {
        apiUrl: params.get('ghostUrl') || localStorage.getItem('magic-book:ghost-url') || '',
        apiKey: params.get('ghostKey') || localStorage.getItem('magic-book:ghost-key') || ''
    };
}

export function ghostConfigured() {
    const {apiUrl, apiKey} = readConfig();
    return Boolean(apiUrl && apiKey);
}

export async function loadGhostPosts(limit = 5) {
    const {apiUrl, apiKey} = readConfig();
    if (!apiUrl || !apiKey) return [];

    const root = apiUrl.replace(/\/$/, '');
    const url = new URL(`${root}/ghost/api/content/posts/`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('include', 'tags,authors');

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ghost Content API returned ${response.status}`);
    const data = await response.json();
    return data.posts || [];
}
