// app/posts/[id]/page.tsx


import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import PostActions from '@/app/components/PostActions'; // Adjust path
import { PostContent } from '@/app/components/Post/Feed'; // From Feed
import { formatRelativeTime } from '@/app/components/Post/Feed'; // Reuse from Feed

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
    const post = await getPost(params.id);

    if (!post) {
        notFound(); // Triggers Next.js 404
    }

    return (
        <article className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md my-8">
            {/* Post header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-600">{post.tag}</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(post.time)}</span>
            </div>

            {/* Post body */}
            <h1 className="text-gray-800 font-semibold text-xl mb-1">{post.title}</h1>
            <PostContent content={post.content} /> {/* Now properly imported */}

            {/* Actions (client-side for interactivity) */}
            <PostActions
                postId={post._id}
                likes={post.likes}
                shares={post.shares}
                likedBy={post.likedBy ?? []}
            />
        </article>
    );
}