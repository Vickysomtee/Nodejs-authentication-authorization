require('dotenv').config()
const  jwt = require('jsonwebtoken');
const redisClient = require('../redis_connect')

// Authorization Middleware

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader) return res.status(401).json("Access Denied")


  try {
    const token = authHeader.split(" ")[1]

    // Verify the token
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verifiedToken;
    req.token = token

    // Check if the token has been blacklisted
    redisClient.get(`bl_${verifiedToken.id.toString()}`, (error, data) => {
      if  (error) throw error

      if (data === token) return res.status(401).json({message: "Blacklisted token"});
      next()
    })
  } catch (error) {
    res.status(403).json({message: error.message})
  }
}

// Verify the Refresh token
const verifyRefreshToken = (req, res, next) => {
  const token = req.body.token;

  if(token === null) return res.statas(401).json({message: "Invalid Request"})

  try{
    //verify the damn token
    const verifiedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    //Check if the verified token is in the redis database
    redisClient.get(verifiedToken.id.toString(), (error, data) => {
      if (error) throw error

      if (data === null) return res.status(401).json({message: " Invalid request. Token is not in store"});
      if(JSON.parse(data).token != token) res.status(401).json({message: "Invalid request. Token is not correct"})

      next();
    })

  } catch (error) {
    res.status(401).status({message: " Your session is not valid"})
  }
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken
}