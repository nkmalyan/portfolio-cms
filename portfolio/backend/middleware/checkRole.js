export const permitAdmin = (req, res, next) => {
  if (req.userRole !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

export const permitOwnerOrAdmin = (Model) => async (req, res, next) => {
  const doc = await Model.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  if (req.userRole === "admin" || doc.createdBy.toString() === req.userId.toString()) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};