export interface PostType {
    id: string;
    tag: string;
    businessName?: string | null;
    country: string;
    time: string;
    content: string;
    likes: number;
    shares: number;
    likedBy?: string[];
}