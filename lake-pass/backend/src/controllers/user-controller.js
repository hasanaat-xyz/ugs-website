import User from "../models/user-model.js";

export const listUsers = async (req, res) => {
  const users = await User.find({ marinaId: req.marinaId }).select("-password");
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, marinaId: req.marinaId });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "owner" && req.user.role !== "owner") {
    return res.status(403).json({ message: "Only owners can modify owner roles" });
  }
  user.role = req.body.role;
  await user.save();
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    marinaId: user.marinaId,
  });
};
