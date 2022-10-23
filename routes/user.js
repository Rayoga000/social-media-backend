const express = require("express");
const {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} = require("../controllers/user");
const router = express.Router();

router.get("/:id", getUser);
router.post("/signup", signup);
router.post("/login", login);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
