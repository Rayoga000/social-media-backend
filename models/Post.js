const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

const validatePost = (post) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string(),
    likes: Joi.array(),
  });
  return schema.validate(post);
};

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost };
