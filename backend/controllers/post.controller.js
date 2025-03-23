import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";


// Function to create a post
export const createPost = async (req, res) => {

    try {
        const {title, description} = req.body;
        const userId = req.userId;

        if (!title || !description) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        if (!userId) {
            return res.status(400).json({
                message: "Could not fetch user",
                success: false
            })
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        const post = await postModel.create({
            title,
            description,
            author: userId
        })

        res.status(200).json({
            message: "Post created successfully",
            post,
            success: true
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }

}


// Function to get all posts
export const getAllPosts = async (req, res) => {
    try {
        
        const userId = req.userId;
        const posts = await postModel.find({ author: { $ne: userId } })
        .populate("user", "name email")
        .populate({
            path: "comments",
            populate: { path: "user", select: "name email" }
        })
        .populate("likes", "name");

        res.status(200).json({
            posts,
            success: true
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }
}


export const addLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required in headers" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: "User already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({ success: true, message: "Post liked", post });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error liking post", error: error.message });
    }
};


export const removeLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId; 

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required in headers" });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ success: false, message: "User has not liked this post" });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        res.status(200).json({ success: true, message: "Like removed", post });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing like", error: error.message });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId; 

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required in headers" });
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this post" });
        }

        await commentModel.deleteMany({ post: postId });

        await postModel.findByIdAndDelete(postId);

        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting post", error: error.message });
    }
};

// all user Posts

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        const userPosts = await postModel.find({ author: userId })
            .populate("author", "name") 
            .populate({
                path: "comments",
                populate: { path: "author", select: "name" } 
            })
            .sort({ createdAt: -1 }); 

        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user posts", error });
    }
};


// get single post

export const getSinglePost = async (req, res) => {
    try {
        const { postId } = req.params; 

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const post = await postModel.findById(postId)
            .populate("author", "name") 
            .populate({
                path: "comments",
                populate: { path: "author", select: "name" } 
            });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error });
    }
};




//search post

export const searchPosts = async (req, res) => {
    try {
        const { query } = req.params; 

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const posts = await postModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, 
                { description: { $regex: query, $options: "i" } }
            ]
        }).populate("author", "name");

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error searching posts", error });
    }
};



// trending posts

export const getTrendingPosts = async (req, res) => {
    try {
        const trendingPosts = await postModel.find()
            .populate("author", "name")
            .sort({ "likes.length": -1 }) 
            .limit(10); 

        res.status(200).json(trendingPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending posts", error });
    }
};

