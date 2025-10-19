import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        const createdPost = await Post.create(data);

        // ✅ Broadcast the new post
        await pusherServer.trigger('posts-channel', 'new-post', createdPost);

        return NextResponse.json({ success: true, data: createdPost });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const posts = await Post.find().sort({ createdAt: -1 });
        return NextResponse.json({ data: posts });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
