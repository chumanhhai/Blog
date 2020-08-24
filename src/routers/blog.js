const Blog = require("../models/blogs");
const authen = require("../services/authenticate");
const express = require("express");

const router = new express.Router();

router.post("/blog", authen, async (req, res) => {
    const blog = new Blog({
        author: req.user.name,
        owner: req.user._id,
        createdAt: new Date().getTime(),
        ...req.body
    });
    try {
        await blog.save();
        res.send(blog);
    } catch (error) {
        res.status(400).send();
    }
})

router.get("/blogs/:category", async (req, res) => {
    try {
        const blogs = await Blog.find({ "categories": req.params.category }, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort: {
                createdAt: -1
            }
        });
        res.send(blogs);
    } catch (error) {
        res.status(400).send();
    }
})

router.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find({ }, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort: {
                createdAt: -1
            }
        });
        res.send(blogs);
    } catch (error) {
        res.status(400).send();
    }
})

router.get("/blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            throw new Error();
        }
        res.send(blog);
    } catch (error) {
        res.status(400).send();
    }
})

router.get("/blogsOfUser", authen, async (req, res) => {
    try {
        const blogs = await Blog.find({ owner: req.user._id }, null, {
            sort: {
                createdAt: -1
            }
        });
        if (!blogs) {
            throw new Error();
        }
        res.send(blogs);
    } catch (error) {
        res.status(400).send();
    }
})

router.patch("/blog/:id", authen, async (req, res) => {
    try {
        const blog = await Blog.customUpdate(req.params.id, req.body, req.user._id);
        res.send(blog);
    } catch (error) {
        res.status(400).send();
    }
})

router.delete("/blog/:id", authen, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!blog) {
            throw new Error();
        }
        res.send(blog);
    } catch (error) {
        res.status(400).send();
    }
})

router.delete("/blog", authen, async (req, res) => {
    try {
        await Blog.deleteMany({ owner: req.user._id });
        res.send();
    } catch (error) {
        res.status(400).send();
    }
})

module.exports = router;
