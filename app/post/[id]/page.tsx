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
        <main className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20">
            <div className="relative max-w-2xl mx-auto p-4 pt-16 pb-20">
                {/* Back Button & Header */}
                <div className="flex items-start justify-between mb-6 gap-4 text-orange-400 hover:text-orange-300">
                    <BackButton />
                    <div className="flex-1 text-center">
                        <h1 className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-black text-2xl sm:text-3xl leading-tight">
                            Honest Story
                        </h1>
                    </div>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                {/* Post Card */}
                <article className="mx-auto px-2 py-4 md:px-6 md:py-8 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50/20 border border-orange-300/30 my-0 -mt-5">
                    {/* Header */}
                    <header className="p-6 pb-4 border-b border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-row items-center space-x-3">
                                {/* Tag circle */}
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-white font-bold text-sm">
                                        {post.tag.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {/* Tag and business info */}
                                <div className="flex items-center space-x-2 min-w-0">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200/50 truncate">
                                        {post.tag}
                                    </span>
                                    {post.businessName && (
                                        <span className="text-sm font-medium text-gray-600 truncate max-w-xs sm:max-w-sm">
                                            • {post.businessName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>


                    {/* Content - Full, non-truncated */}
                    <div className="p-6">
                        <h2 className="text-gray-900 font-bold text-2xl sm:text-3xl mb-6 leading-tight break-words">
                            {post.title}
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700 mb-8 prose-headings:text-gray-900 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-ul:ml-6 prose-ol:ml-6 prose-li:mb-1">
                            <PostContent content={post.content} full={true} />
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