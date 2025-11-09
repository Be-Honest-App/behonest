// app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { action, ghostId } = await request.json();
    if (!action || !ghostId || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action or ghostId' }, { status: 400 });
    }

    await dbConnect();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const index = post.likedBy.indexOf(ghostId);
    let updatedLikes = post.likes;
    const updatedLikedBy = [...post.likedBy]; // Fixed: 'const' (never reassigned)

    if (action === 'like') {
      if (index === -1) { // Not liked yet
        updatedLikes += 1;
        updatedLikedBy.push(ghostId);
      }
    } else { // unlike
      if (index !== -1) { // Was liked
        updatedLikes -= 1;
        updatedLikedBy.splice(index, 1);
      }
    }

    // Save only if changed
    const changed = post.likes !== updatedLikes || post.likedBy.length !== updatedLikedBy.length;
    if (changed) {
      post.likes = updatedLikes;
      post.likedBy = updatedLikedBy;
      await post.save();
    }

    // Broadcast (matches your Feed's mutate shape)
    const broadcastData = {
      _id: post._id.toString(),
      likes: updatedLikes,
      likedBy: updatedLikedBy,
    };
    await pusherServer.trigger('posts-channel', 'update-like', broadcastData);

    // Return partial for client
    return NextResponse.json({
      success: true,
      data: { likes: updatedLikes, likedBy: updatedLikedBy }
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}