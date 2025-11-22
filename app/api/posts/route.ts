import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const createdPost = await Post.create(data);

        // Compute updated top tags after new post (separate aggregations for type safety)
        // Tags aggregation
        const tagsAgg = await Post.aggregate([
            { $group: { _id: '$tag', count: { $sum: 1 } } },
            { $match: { _id: { $ne: '' } } }, // Filter empty
            { $sort: { count: -1 } },
            { $limit: 2 } // Half for tags
        ]);

        // Business names aggregation
        const businessAgg = await Post.aggregate([
            { $group: { _id: '$businessName', count: { $sum: 1 } } },
            { $match: { _id: { $nin: [null, ''], $type: 'string' } } }, // Filter non-empty strings
            { $sort: { count: -1 } },
            { $limit: 2 } // Half for business
        ]);

        // Merge and sort combined (top 4 total)
        const allTopTags = [
            ...tagsAgg.map(({ _id, count }) => ({ name: _id, count })),
            ...businessAgg.map(({ _id, count }) => ({ name: _id, count }))
        ].sort((a, b) => b.count - a.count).slice(0, 4);

        // Broadcast new post + updated tags
        await pusherServer.trigger('posts-channel', 'new-post', createdPost);
        await pusherServer.trigger('posts-channel', 'update-tags', { topTags: allTopTags });

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

        // Same aggregation as POST for consistency
        const tagsAgg = await Post.aggregate([
            { $group: { _id: '$tag', count: { $sum: 1 } } },
            { $match: { _id: { $ne: '' } } },
            { $sort: { count: -1 } },
            { $limit: 2 }
        ]);

        const businessAgg = await Post.aggregate([
            { $group: { _id: '$businessName', count: { $sum: 1 } } },
            { $match: { _id: { $nin: [null, ''], $type: 'string' } } },
            { $sort: { count: -1 } },
            { $limit: 2 }
        ]);

        const allTopTags = [
            ...tagsAgg.map(({ _id, count }) => ({ name: _id, count })),
            ...businessAgg.map(({ _id, count }) => ({ name: _id, count }))
        ].sort((a, b) => b.count - a.count).slice(0, 4);

        return NextResponse.json({ data: posts, topTags: allTopTags });
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