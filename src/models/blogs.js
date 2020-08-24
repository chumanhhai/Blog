const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    categories: {
        type: Array,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
    }
})

schema.statics.customUpdate = async function (_id, data, owner) {
    const blog = await Blog.findOne({ _id, owner });
    if (!blog) {
        throw new Error();
    }
    for (let key in data) {
        blog[key] = data[key];
    }
    await blog.save();
    return blog;
}

const Blog = mongoose.model("Blog", schema);

module.exports = Blog;
