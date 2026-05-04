import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, "SECRETKEY");

    req.user = decoded; // ✅ contains id + role

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
export default authMiddleware;