// app/api/posts/[id]/share/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer'; // Adjust import

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await dbConnect();

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        post.shares += 1;
        await post.save();

        // Broadcast updated fields (match Feed's mutate)
        const updatedPost = {
            _id: post._id.toString(),
            likes: post.likes,
            shares: post.shares,
            likedBy: post.likedBy || [],
        };

        await pusherServer.trigger('posts-channel', 'update-share', updatedPost);

        return NextResponse.json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('Share error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}