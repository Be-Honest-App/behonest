// // app/api/posts/[id]/like/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Post from '@/models/Post';
// import { pusherServer } from '@/lib/pusherServer';

// export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await context.params;
//     const { liked } = await req.json(); // { liked: true/false }
//     await dbConnect();

//     const post = await Post.findById(id);
//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     if (liked) {
//       post.likes += 1;
//       // post.likedBy?.push(userId); // Add auth later
//     } else {
//       post.likes -= 1;
//     }
//     await post.save();

//     const updatedPost = {
//       _id: post._id.toString(),
//       likes: post.likes,
//       likedBy: post.likedBy || [],
//       shares: post.shares,
//     };

//     await pusherServer.trigger('posts-channel', 'update-like', updatedPost);

//     return NextResponse.json({ success: true, data: updatedPost });
//   } catch (error) {
//     console.error('Like error:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await dbConnect();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update likes (add user ID to likedBy if not already, for uniqueness)
    const userId = Date.now(); // Replace with real user ID from session/auth 'user-' + Date.now(); 
    if (!post.likedBy.includes(userId)) {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    await post.save();

    // Broadcast updated post to all clients
    await pusherServer.trigger('posts-channel', 'update-like', {
      _id: post._id,
      likes: post.likes,
      likedBy: post.likedBy,
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}