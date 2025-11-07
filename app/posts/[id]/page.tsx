// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb'; // Your DB connect function
import Post from '@/models/Post'; // Your Mongoose model
import PostActions from '@/app/components/PostActions';
import PostContent from '@/app/components/PostContent'; 

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

// Define formatRelativeTime inline (server-safe with Date.now())
function formatRelativeTime(isoString: string): string {
    const now = Date.now();
    const postDate = new Date(isoString).getTime();
    const diffMs = now - postDate;

    if (isNaN(postDate)) return 'Invalid date';
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) { // Awaitable params
    const { id } = await params; // Await before accessing
    const post = await getPost(id);

    if (!post) {
        notFound(); // Triggers Next.js 404
    }

    return (
        <article className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md my-8">
            {/* Post header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-600">{post.tag}</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(post.time)}</span>
            </div>

            {/* Post body */}
            <h1 className="text-gray-800 font-semibold text-xl mb-1">{post.title}</h1>
            <PostContent content={post.content} />

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