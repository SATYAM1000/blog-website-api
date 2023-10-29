import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true, 
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
        default: 'satyam55',
    },
    category: {
        type: String,
        trim: true,
    },
    tags: [{ type: String }] 
}, { timestamps: true });

const BlogModel = mongoose.model('Blog', blogSchema);

export default BlogModel;
