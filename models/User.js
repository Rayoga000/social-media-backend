const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    profilePicture: Joi.string(),
    coverPicture: Joi.string(),
    followers: Joi.array(),
    following: Joi.array(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
