import User from "../models/userModel.js";

const validateUser = async (email) => {
  if (!email) return null;

  const user = await User.findOne({ email });
  if (!user) return null;

  return user;
};

export default validateUser;
