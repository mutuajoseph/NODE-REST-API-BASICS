const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    const token = req.header("auth-token")
    if(!token) return res.status(401).send({message: "Unauthorized"})

    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.user = verify
        next() 
    } catch (err) {
        return res.status(400).send({message: "Invalid Token"})
    }
}