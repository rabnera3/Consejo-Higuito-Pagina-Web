export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover_image: string | null;
    published_at: string;
    author_name: string;
    category: string | null;
}

export interface BlogResponse {
    success: boolean;
    data: BlogPost[];
}

const API_URL = 'http://localhost:8080/api';

export const blogService = {
    getRecentPosts: async (): Promise<BlogPost[]> => {
        try {
            const response = await fetch(`${API_URL}/blog?status=published`);

            if (!response.ok) {
                throw new Error('Error al obtener los posts');
            }

            const data: BlogResponse = await response.json();

            if (!data.success) {
                throw new Error('Error en la respuesta del servidor');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    }
};
