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

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) notFound();

    return (
        <main className="max-w-xl mx-auto p-6 bg-white">
            <div className="text-orange-400 hover:text-orange-200 mb-4">
                <BackButton />
            </div>

            <div className="flex justify-center items-center mt-4">
                <h1 className="flex justify-center items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold px-6 py-3 rounded-xl text-2xl shadow-lg">
                    Honest Story
                </h1>
            </div>

            <article className="mx-auto p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50/20 border border-orange-300/30 my-0 -mt-5">
                <SplitPost
                    content={post.content}
                    time={post.time}
                    tag={post.tag}
                    businessName={post.businessName}
                />
            </article>
        </main>
    );
}
