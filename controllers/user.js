const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/User");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await new User({
      ...req.body,
      password: hashedPassword,
      email: email.toLowerCase(),
    });
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: "User not found!" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ err: "Incorrect password!" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    if (req.body.userId == req.params.id) {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...others } = user._doc;
      return res.status(200).json(others);
    }
    return res.status(400).json({ err: "Invalid credentials" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.body.userId == req.params.id || req.user.isAdmin) {
      if (!req.body.password) {
        return res.status(400).json({ err: "You must type password field!" });
      }
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(user);
    }
    return res.status(400).json({ err: "Invalid credentials!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.body.userId == req.params.id || req.user.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json(user);
    }
    return res.status(400).json({ err: "Invalid credentials!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const followUser = async (req, res) => {
  try {
    const followedUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (followedUser.followers.includes(req.body.userId)) {
      return res.status(400).json({ err: "You already follow this user" });
    }
    await followedUser.updateOne({ $push: { followers: req.body.userId } });
    await currentUser.updateOne({ $push: { following: req.body.userId } });
    return res.status(200).json({ msg: "Follow success!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const unfollowedUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!unfollowedUser.followers.includes(req.body.userId)) {
      return res.status(400).json({ err: "you already unfollowed this user" });
    }
    await unfollowedUser.updateOne({ $pull: { followers: req.body.userId } });
    await currentUser.updateOne({ $pull: { following: req.body.userId } });
    return res.status(200).json({ msg: "unfollow success!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
};
