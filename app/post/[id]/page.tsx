// app/posts/[id]/page.tsx

import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb'; // Your DB connect function
import Post from '@/models/Post'; // Your Mongoose model
import PostActions from '@/app/components/PostActions';
import PostContent from '@/app/components/PostContent';
import BackButton from '@/app/components/ui/BackButton';

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

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) { // Awaitable params
    const { id } = await params; // Await before accessing
    const post = await getPost(id);

    if (!post) {
        notFound(); // Triggers Next.js 404
    }

    return (
        <main className="min-h-screen mt-20 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20 overflow-x-hidden">
            <div className="relative max-w-2xl mx-auto p-4 pt-16 pb-20">

                {/* Back + Title */}
                <div className="flex items-start justify-between mb-6 gap-4 text-orange-400 hover:text-orange-300 flex-wrap">
                    <BackButton />

                    <div className="flex-1 text-center">
                        <h1 className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-black text-2xl sm:text-3xl leading-tight">
                            Honest Story
                        </h1>
                    </div>

                    <div className="w-10"></div>
                </div>

                {/* Card */}
                <article className="mx-auto px-4 py-6 md:px-6 md:py-8 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50/20 border border-orange-300/30">

                    {/* Header */}
                    <header className="pb-4 border-b border-orange-200">
                        <div className="flex items-center gap-3 mb-3">

                            {/* Circle Icon */}
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full 
                  flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white font-bold text-sm">
                                    {post.tag.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* Tag + Business */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 min-w-0">

                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                     bg-orange-100 text-orange-700 border border-orange-200/50 flex-shrink-0">
                                    {post.tag}
                                </span>

                                {post.businessName && (
                                    <span className="text-sm font-medium text-gray-600 truncate max-w-[200px] sm:max-w-xs">
                                        • {post.businessName}
                                    </span>
                                )}

                            </div>
                        </div>
                    </header>


                    {/* Content */}
                    <div className="pt-6">
                        <h2 className="text-gray-900 font-bold text-2xl sm:text-3xl mb-6 leading-tight break-words">
                            {post.title}
                        </h2>

                        <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700 mb-8 break-words">
                            <PostContent content={post.content} full />
                        </div>
                    </div>

                    {/* Actions */}
                    <PostActions
                        postId={post._id}
                        likes={post.likes}
                        shares={post.shares}
                        likedBy={post.likedBy ?? []}
                        time={post.time}
                    />

                </article>
            </div>
        </main>

    );
}