const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth');
  if(!token) return res.status(401).send("Invalid token");

  try {
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decode;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token")
  }
};