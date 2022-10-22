const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/User");

const signup = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

module.exports = {
  signup,
  login,
};
