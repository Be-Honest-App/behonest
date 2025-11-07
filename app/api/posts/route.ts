import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// CREATE POST
export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const createdPost = await Post.create(data);

        // Broadcast new post to clients
        await pusherServer.trigger('posts-channel', 'new-post', createdPost);

        return NextResponse.json({ success: true, data: createdPost });
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

// GET POSTS (supports optional tag filtering with partial matches)
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag'); // e.g. /api/posts?tag=feed

        let filter = {};
        if (tag && tag.trim() !== '') {
            // Case-insensitive, partial match using regex
            filter = { tag: { $regex: tag, $options: 'i' } };
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ data: posts });
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
