const express = require("express");
const { check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Data = require("../model/Data");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/add",
    [
        check("username", "Invalid Username").notEmpty(),
        check("name", "Invalid Name Field").notEmpty(),
        check("age", "Invalid Age Field").notEmpty(),
        check("gender", "Invalid Gender Field").notEmpty(),
        check("adult", "Invalid Adult Field").notEmpty(),

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
            /*let user = await Data.findOne({
                username
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }*/

            let user = new Data({
                username,
                name,
                age,
                gender,
                adult
            });

            await user.save();

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

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const data = await Data.findById(req.user.id);
        res.json(data);
    } catch (e) {
        res.send({ message: "Error in fetching user data" });
    }
});


module.exports = router;