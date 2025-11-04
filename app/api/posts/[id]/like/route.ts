// app/api/posts/[id]/like/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { liked } = await req.json(); // { liked: true/false }
    await dbConnect();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (liked) {
      post.likes += 1;
      // post.likedBy?.push(userId); // Add auth later
    } else {
      post.likes -= 1;
    }
    await post.save();

    const updatedPost = {
      _id: post._id.toString(),
      likes: post.likes,
      likedBy: post.likedBy || [],
      shares: post.shares,
    };

    await pusherServer.trigger('posts-channel', 'update-like', updatedPost);

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}