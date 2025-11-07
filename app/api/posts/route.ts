import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(req: Request) {
    try {
        await dbConnect();
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
        await dbConnect();
        const posts = await Post.find().sort({ createdAt: -1 });
        return NextResponse.json({ data: posts });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     await dbConnect()

//     try {
//         const { id } = params

//         if (!id) {
//             return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
//         }

//         const deletedPost = await Post.findByIdAndDelete(id)

//         if (!deletedPost) {
//             return NextResponse.json({ error: 'Post not found' }, { status: 404 })
//         }

//         return NextResponse.json({
//             success: true,
//             message: 'Post deleted successfully',
//             data: deletedPost
//         })
//     } catch (error) {
//         console.error('Delete post error:', error)
//         return NextResponse.json({ error: 'Server error' }, { status: 500 })
//     }
// }