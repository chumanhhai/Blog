const jwt = require("jsonwebtoken");
const User = require("../models/users");

async function authen (req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(data.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({ error: "Please authenticate." });
    }
}

module.exports = authen;