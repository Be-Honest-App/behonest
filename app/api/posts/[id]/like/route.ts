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
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Awaitable Promise type
) {
  await dbConnect();

  try {
    const awaitedParams = await params;  // Await here
    const { id } = awaitedParams;  // Now safe to destructure
    const body = await request.json();
    const { fingerprintHash } = body; // Required from client

    if (!fingerprintHash) {
      return NextResponse.json({ error: 'Missing fingerprint' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // IP extraction
    const clientIp =
      request.headers
        .get('x-forwarded-for')
        ?.split(',')[0]
        ?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Super-secure key: post + IP + fingerprint hash
    const limitKey = `like:${id}:${clientIp}:${fingerprintHash}`;
    const exists = await redis.get(limitKey); // Check if already liked

    if (exists) {
      return NextResponse.json(
        { error: 'Already liked this post' },
        { status: 429 }
      );
    }

    // Set key with 1-hour TTL
    await redis.set(limitKey, 1, { ex: 3600 });

    // Increment
    post.likes += 1;
    await post.save();

    // Broadcast
    await pusherServer.trigger('posts-channel', 'update-like', {
      id: post._id.toString(),
      likes: post.likes,
    });

    return NextResponse.json({ success: true, data: { id, likes: post.likes } }, { status: 201 });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}