import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await dbConnect();

    const post = await Post.findById(id);
    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    post.shares += 1;
    await post.save();

    await pusherServer.trigger('posts-channel', 'update-post', {
        _id: post._id,
        likes: post.likes,
        shares: post.shares,
    });

    return NextResponse.json({ success: true, data: post });
}
