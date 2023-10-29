/** @format */

import express from "express";
import userModel from "./userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
	try {
		const { name, email, password, tc } = req.body;
		if (!name || !email || !password || tc === undefined) {
			return res
				.status(400)
				.json({ status: "failed", message: "Please provide all the fields" });
		}

		const existingUser = await userModel.findOne({ email: email });
		if (existingUser) {
			return res
				.status(400)
				.json({ status: "failed", message: "Email already exists" });
		}

		if (password.length < 8) {
			res
				.status(400)
				.json({ status: "failed", message: "Password is too short..." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new userModel({
			name: name,
			email: email,
			password: hashedPassword,
			tc: tc,
		});

		await newUser.save();
		res
			.status(201)
			.json({ status: "success", message: "Registration successful" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "failed", message: "Registration failed" });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (email === undefined || password === undefined) {
			res
				.status(400)
				.json({ status: "failed", messgae: "Please fill all the fields..." });
		} else {
			const user = await userModel.findOne({ email: email });
			if (user) {
				const isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					const token = await jwt.sign(
						{ userId: user._id },
						process.env.SECRET_KEY
					);
					res.status(200).json({
						status: "success",
						message: "Login successfull",
						token: token,
					});
				} else {
					res.status(400).json({
						status: "failed",
						message: "Email or Password is Wrong...",
					});
				}
			} else {
				res
					.status(400)
					.json({ status: "failed", messgae: "User not registered ..." });
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "failed", message: "Login failed" });
	}
};

const getUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res
				.status(400)
				.json({ status: "failed", message: "Please provide a User ID" });
		}

		const user = await userModel.findOne({ _id: userId });
		if (!user) {
			return res
				.status(404)
				.json({ status: "failed", message: "User not found" });
		}

		res.status(200).json({ status: "success", user });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await userModel.findOne({ _id: userId });

		if (!user) {
			return res
				.status(404)
				.json({ status: "failed", message: "User does not exist" });
		}

		const { name, email, password } = req.body;

		if (name === undefined && email === undefined && password === undefined) {
			return res.status(400).json({
				status: "failed",
				message: "Please provide the field you want to update",
			});
		}
		if (name !== undefined) {
			user.name = name;
		}
		if (email !== undefined) {
			if (validator.isEmail(email)) {
				user.email = email;
			} else {
				res
					.status(500)
					.json({ status: "failed", message: "Email not valid..." });
			}
		}
		if (password !== undefined) {
			if (password.length < 8) {
				res
					.status(500)
					.json({ status: "failed", message: "Password too short..." });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			user.password = hashedPassword;
		}

		await user.save();
		res
			.status(200)
			.json({ status: "success", message: "Profile updated successfully" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
};

export default { registerUser, loginUser, getUserProfile, updateUserProfile };
