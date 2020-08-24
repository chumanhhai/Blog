const express = require("express");
const User = require("../models/users");
const authen = require("../services/authenticate");

const router = new express.Router();

router.post("/register", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error });
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body);
        const token = await user.generateToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: "Invalid account." });
    }
})

router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send();
    }
})

router.get("/user", authen, async (req, res) => {
    res.send(req.user);
})

router.patch("/user", authen, async (req, res) => {
    try {
        await req.user.customUpdate(req.body);
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
})

router.delete("/user", authen, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
})

module.exports = router;