const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You must be loged in" })
    }
    const token = authorization
    jwt.verify(token, JWT_TOKEN, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be authorized" })
        }

        const { _id } = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next()
            })
    })
}