/** @format */

import express from "express";
const router = express.Router();
import userController from "./usercontroller.js";
import blogController from "./blogcontroller.js";
import filterController from './searchController.js'

//--------------------search and filtering routes for blog posts--------

router.get('/posts',filterController.filterBlogsBasedOnCategories);
router.get('/search', filterController.searchBlogs);
router.get('/posts', filterController.blogPostPagination);

//------------user routes-------------------------------

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.patch("/update/:id", userController.updateUserProfile);
router.get("/user/:id", userController.getUserProfile);

//-----------------blog routes-----------------------------

router.post("/posts", blogController.writeBlogPost);
router.get('/posts', blogController.getAllBlogs);

router.get('/posts/:id', blogController.getSingleBlog);
router.delete('/posts/:id', blogController.deleteBlogPost);
router.patch('/posts/:id', blogController.updateBlogPost);

//------------------------------------------------------------

export default router;
