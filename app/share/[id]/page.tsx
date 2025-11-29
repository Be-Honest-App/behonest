import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import SplitPost from '@/app/components/SplitPost';
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
    const postDoc = (await Post.findById(id).lean()) as PostProps | null;
    if (!postDoc) return null;

    return {
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
}

interface PostPageProps {
    params: { id: string };
}

export default async function SharePage({ params }: PostPageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) notFound();

    return (
        <main className="min-h-screen mt-20 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20">
            <div className="relative max-w-2xl mx-auto p-4 pt-16 pb-20">

                {/* Back Button + Center Title */}
                <div className="flex items-start justify-between mb-6 gap-4 text-orange-400 hover:text-orange-300">
                    <BackButton />
                    <div className="flex-1 text-center">
                        <h1 className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-black text-2xl sm:text-3xl leading-tight">
                            Honest Story
                        </h1>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Post Card */}
                <article className="mx-auto px-3 py-4 sm:px-6 sm:py-8 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50/20 border border-orange-300/30 -mt-5">

                    <SplitPost
                        content={post.content}
                        time={post.time}
                        tag={post.tag}
                        businessName={post.businessName}
                    />

                </article>
            </div>
        </main>
    );
}
