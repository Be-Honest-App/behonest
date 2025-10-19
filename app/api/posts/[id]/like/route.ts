import { NextResponse } from 'next/server';
import connectDB  from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();

  try {
    const { unlike } = await req.json();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // ✅ Increment or decrement like count
    if (unlike) {
      post.likes = Math.max(post.likes - 1, 0);
    } else {
      post.likes += 1;
    }

    await post.save();

    // ✅ Broadcast real-time update via Pusher
    await pusherServer.trigger('posts-channel', 'update-post', {
      _id: post._id.toString(),
      likes: post.likes,
      shares: post.shares,
    });

    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    console.error('Error in /like route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
