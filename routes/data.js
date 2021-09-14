const express = require("express");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Data = require("../model/Data");
const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */
router.post(
    "/modify",
    [
        check("name", "Invalid Name Field").notEmpty(),
        check("age", "Invalid Age Field").notEmpty(),
        check("gender", "Invalid Gender Field").notEmpty(),
        check("adult", "Invalid Adult Field"),
        check("id", "Invalid ID Field").notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            username,
            name,
            age,
            gender,
            adult,
            id
        } = req.body;

        try {
            let user = await Data.findByIdAndUpdate(id, {name: name, age: age, gender: gender, adult: adult},);
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/delete",
    [
        check("name", "Invalid Name Field").notEmpty(),
        check("age", "Invalid Age Field").notEmpty(),
        check("gender", "Invalid Gender Field").notEmpty(),
        check("adult", "Invalid Adult Field"),
        check("id", "Invalid ID Field").notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            username,
            name,
            age,
            gender,
            adult,
            id
        } = req.body;

        try {
            let user = await Data.findByIdAndDelete(id);
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/add",
    [
        check("username", "Invalid Username").notEmpty(),
        check("name", "Invalid Name Field").notEmpty(),
        check("age", "Invalid Age Field").notEmpty(),
        check("gender", "Invalid Gender Field").notEmpty(),
        check("adult", "Invalid Adult Field").notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            name,
            age,
            gender,
            adult
        } = req.body;

        try {
            let user = await Data.findOne({
                username: username,
                name: name,
                age: age,
                gender: gender,
                adult: adult
            });
            console.log(user)
            if (user) {
                return res.status(401).json({
                    msg: "Data Already Exists"
                });
            }

            let data = new Data({
                username,
                name,
                age,
                gender,
                adult
            });

            await data.save();

            const payload = {
                user: {
                    id: data.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        //console.log(req)
        const user = await User.findById(req.user.id)
        //console.log(user.username)
        const data = await Data.find({username: user.username})
        res.json(data);
    } catch (e) {
        res.send({message: "Error in fetching user data"});
    }
});

router.get("/getID", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        console.log(user.username)
        console.log(req.header("name"))
        console.log(req.header("age"))
        console.log(req.header("gender"))
        console.log(req.header("adult"))
        const data = await Data.find({
            username: user.username,
            name: req.header("name"),
            age: req.header("age"),
            gender: req.header("gender"),
            adult: req.header("adult")
        })
        console.log("JSON DATA = "+data.toString())
        res.json(data)
    } catch (err) {
        res.send({message: "Error in fetching user data"});
    }
})

module.exports = router;