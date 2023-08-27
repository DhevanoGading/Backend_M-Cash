const { sign, verify } = require("jsonwebtoken");
const KEY = "jwtuserlogin";

module.exports = {
  generateTokens: (user) => {
    const accessToken = sign(
      {
        user_id: user.user_id,
        username: user.username,
        name: user.name,
      },
      KEY
    );
    return accessToken;
  },

  validateToken: (req, res, next) => {
    // const accessToken = req.headers.authorization;
    const accessToken = req.cookies["access_token"];

    if (!accessToken || accessToken === undefined || accessToken === "")
      return res.status(401).json({ error: "User not Autenticated!" });

    try {
      const validToken = verify(accessToken, KEY);
      if (validToken) {
        req.authenticated = true;
        req.user = validToken;
        return next();
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
