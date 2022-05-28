const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth_token");
  if (!token) return res.status(401).send("No premission");

  try {
    const verify = jwt.verify(token, process.env.TOKEN_USER);
    req.user = verify;
    next();
  } catch (err) {
    res.status(400).send("No token found!");
  }
};
