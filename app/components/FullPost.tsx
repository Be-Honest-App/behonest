// app/posts/[id]/page.tsx

import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb'; // Your DB connect function
import Post from '@/models/Post'; // Your Mongoose model
import PostDetailClient from '@/app/components/PostDetailClient';

interface PostProps {
    _id: string;
    tag: string;
    businessName?: string | null;
    time: string;
    title: string;
    content: string;
    likes: number;
    shares: number;
    likedBy?: string[];
}

// function formatRelativeTime(isoString: string): string {
//     const now = Date.now();
//     const postDate = new Date(isoString).getTime();
//     const diffMs = now - postDate;

//     if (isNaN(postDate)) return 'Invalid date';
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

//     return new Date(isoString).toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//     });
// }

async function getPost(id: string): Promise<PostProps | null> {
    await dbConnect();
    const postDoc = await Post.findById(id).lean() as PostProps | null; // Type assertion for lean() output

    if (!postDoc) return null;

    // Ensure full PostProps shape with type safety
    const post: PostProps = {
        _id: postDoc._id.toString(),
        tag: postDoc.tag || '',
        businessName: postDoc.businessName || null,
        time: postDoc.time || new Date().toISOString(),
        title: postDoc.title || '',
        content: postDoc.content || '',
        likes: postDoc.likes || 0,
        shares: postDoc.shares || 0,
        likedBy: postDoc.likedBy || [],
    };

    return post;
}

export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const post = await getPost(id);

    if (!post) {
        notFound(); // Triggers Next.js 404
    }

    // Render a client component for interactive parts
    return <PostDetailClient post={post} />;
}