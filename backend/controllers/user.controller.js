import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }
        if (password < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 character"
            })
        }
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        return res.status(200).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" }).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "Logout successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {
            firstName,
            lastName,
            occupation,
            bio,
            instagram,
            facebook,
            linkedin,
            github
        } = req.body;

        const file = req.file;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.photoUrl = cloudResponse.secure_url;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (occupation) user.occupation = occupation;
        if (bio) user.bio = bio;
        if (instagram) user.instagram = instagram;
        if (facebook) user.facebook = facebook;
        if (linkedin) user.linkedin = linkedin;
        if (github) user.github = github;

        await user.save();

        const updatedUser = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password") // Exclude password field
        res.status(200).json({
            success: true,
            message: "User list fetched successfully",
            total: users.length,
            users
        })
    } catch (error) {
        console.error("Error fetching user List:", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        })
    }
}