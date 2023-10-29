/** @format */

import express from "express";
import BlogModel from "./blogSchema.js";

const writeBlogPost = async (req, res) => {
	try {
		const { title, content, author, category, tags } = req.body;
		const blog = await BlogModel.findOne({ title: title });
		if (blog) {
			res
				.status(201)
				.json({ status: "success", message: "Blog already exists..." });
		} else {
			const doc = new BlogModel({
				title: title,
				content: content,
				author: author,
				category: category,
				tags: tags,
			});

			await doc.save();
			res
				.status(201)
				.json({ status: "success", message: "Blog post created successfully" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Writing blog post failed" });
	}
};

const getAllBlogs = async (req, res) => {
	try {
		const blogs = await BlogModel.find({});
		if (blogs.length > 0) {
			res.status(200).json(blogs);
		} else {
			res.status(204).json({ status: "success", message: "No posts exist" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Failed to retrieve blog posts" });
	}
};

const getSingleBlog = async (req, res) => {
	try {
		const blogId = req.params.id;
		const blog = await BlogModel.findOne({ _id: blogId });

		if (blog) {
			res.status(200).json(blog);
		} else {
			res
				.status(404)
				.json({ status: "failed", message: "Blog post not found" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Failed to retrieve blog post" });
	}
};

const deleteBlogPost = async (req, res) => {
	try {
		const blogId = await req.params.id;
		const blog = await BlogModel.findOne({ _id: blogId });
		if (blog) {
			await BlogModel.deleteOne({ _id: blogId });
			res
				.status(200)
				.json({ status: "success", message: "Blog post deleted..." });
		} else {
			res
				.status(404)
				.json({ status: "failed", message: "Blog post not found" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error..." });
	}
};

const updateBlogPost = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findOne({ _id: blogId });

        if (blog) {
            const { title, content, category, tags, author } = req.body;
            let updated = false;

            if (title !== undefined) {
                blog.title = title;
                updated = true;
            }
            if (content !== undefined) {
                blog.content = content;
                updated = true;
            }
            if (category !== undefined) {
                blog.category = category;
                updated = true;
            }
            if (tags !== undefined) {
                blog.tags = tags;
                updated = true;
            }
            if (author !== undefined) {
                blog.author = author;
                updated = true;
            }

            if (updated) {
                await blog.save();
                res.status(200).json({ status: "success", message: "Blog post updated successfully" });
            } else {
                res.status(200).json({ status: "failed", message: "No fields to update" });
            }
        } else {
            res.status(404).json({ status: "failed", message: "Blog post not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};


export default { writeBlogPost, getAllBlogs, getSingleBlog, deleteBlogPost , updateBlogPost};
