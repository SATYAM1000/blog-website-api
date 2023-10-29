/** @format */

import express from "express";
import BlogModel from "./blogSchema.js";

const filterBlogsBasedOnCategories = async (req, res) => {
	try {
		const { category, author, tags } = req.query;
		const filters = {}; // here filter is an empty object
		if (category) {
			filters.category = category;
		}

		if (author) {
			filters.author = author;
		}

		if (tags) {
			filters.tags = tags;
		}

		const blogs = await BlogModel.find(filters);
		if (blogs.length === 0) {
			return res
				.status(404)
				.json({ status: "success", message: "No matching blog posts found" });
		}
		res.status(200).json(blogs);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
};

const searchBlogs = async (req, res) => {
	try {
		const { query } = req.query;
		console.log(req.query);

		if (!query) {
			return res
				.status(400)
				.json({ status: "failed", message: "Search query is required" });
		}

		const searchResults = await BlogModel.find({
			$or: [
				{ title: { $regex: new RegExp(query, "i") } },
				{ content: { $regex: new RegExp(query, "i") } },
				{ author: { $regex: new RegExp(query, "i") } },
				{ category: { $regex: new RegExp(query, "i") } },
			],
		});
		console.log(searchResults);

		if (searchResults.length === 0) {
			return res
				.status(404)
				.json({ status: "success", message: "No matching blog posts found" });
		}

		res.status(200).json(searchResults);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
};

const blogPostPagination = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1; // Page number
		const limit = parseInt(req.query.limit) || 3; // Number of items per page

		// Calculate the skip value to skip records on previous pages
		const skip = (page - 1) * limit;

		const totalBlogs = await BlogModel.countDocuments();
		const totalPages = Math.ceil(totalBlogs / limit);

		// Perform the actual query with pagination
		const blogs = await BlogModel.find().skip(skip).limit(limit);

		res.status(200).json({
			status: "success",
			page,
			totalPages,
			blogs,
		});
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
};

export default { filterBlogsBasedOnCategories, searchBlogs,blogPostPagination };
