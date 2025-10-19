import mongoose, { Schema, models } from 'mongoose';

const postSchema = new Schema({
    tag: {
        type: String,
        required: true,
    },
    businessName: {
        type: String, // Optional (no required: true; saves as null if omitted)
    },
    time: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    likedBy: { type: [String], default: [] }, // ✅ new field to store browser/user IDs
}, {
    timestamps: true,
});

export default models.Post || mongoose.model('Post', postSchema);