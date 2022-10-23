const express = require("express");
const {
  getPost,
  addPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  getTimeline,
} = require("../controllers/post");

const router = express.Router();

router.get("/timeline", getTimeline);
router.get("/:id", getPost);
router.post("/", addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.put("/:id/unlike", dislikePost);

module.exports = router;
