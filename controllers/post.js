const { Post, validatePost } = require("../models/Post");
const { User } = require("../models/User");

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const addPost = async (req, res) => {
  try {
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }
    const post = await new Post(req.body);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updatePost = async (req, res) => {
  try {
    const oldPost = await Post.findById(req.params.id);
    if (oldPost.userId !== req.body.userId) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const oldPost = await Post.findById(req.params.id);
    if (oldPost.userId !== req.body.userId) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    const post = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    const likedPost = await Post.findById(req.params.id);
    if (likedPost.likes.includes(req.body.userId)) {
      return res.status(400).json({ err: "Already liked this post" });
    }
    await likedPost.updateOne({ $push: { likes: req.body.userId } });
    return res.status(200).json({ msg: "liked post successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const dislikePost = async (req, res) => {
  try {
    const oldPost = await Post.findById(req.params.id);
    if (oldPost.userId !== req.body.userId) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    const dislikedPost = await Post.findById(req.params.id);
    if (!dislikedPost.likes.includes(req.body.userId)) {
      return res.status(400).json({ err: "Already unliked this post" });
    }
    await dislikedPost.updateOne({ $pull: { likes: req.body.userId } });
    return res.status(200).json({ msg: "unliked post successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getTimeline = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const currentUserPosts = await Post.find({ userId: currentUser._id });
    const followingPosts = await Promise.all(
      currentUser.following.map((followingId) => {
        return Post.find({ userId: followingId });
      })
    );
    return res.status(200).json(currentUserPosts.concat(...followingPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getPost,
  addPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  getTimeline,
};
