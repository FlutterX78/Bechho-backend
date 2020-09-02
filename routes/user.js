const express = require("express");
const User = require("../model/userModel");
const config = require("../config");
const jwt = require("jsonwebtoken")
const middleware = require("../middleware")
// const Product = require("../model/productModel");

const router = express.Router();


//check username existence
router.route("/:username").get(middleware.checkToken, (req, res) => {
    User.findOne({
        username: req.params.username
    }),
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            res.json({
                data: result,
                username: req.params.username
            });
        }
});

// checkusername uniqueness
router.route("/checkusername/:username").get((req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result !== null) {
            return res.json({
                Status: true
            });
        } else {
            return res.json({
                Status: false
            });
        }
    });
});




//login
router.route("/login").post((req, res) => {
    User.findOne({ username: req.body.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result === null) {
            return res.status(403).json("Username does not exist")
        }
        if (result.password === req.body.password) {
            let token = jwt.sign({ username: req.body.username }, config.key, {
                expiresIn: "24h",
            });
            res.json({
                token: token,
                msg: "Success"
            })
        } else {
            res.status(403).json("Password is incorrect")
        }
    });
})

//sign up of user
router.route("/register").post((req, res) => {
    console.log("inside the register");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        products: []
    });
    user.save().then(() => {
        console.log("user registered");
        res.status(200).json("ok");
    }).catch((err) => {
        res.status(403).json({ msg: err });
    });
});



// update password
router.route("/update/:username").patch(middleware.checkToken, (req, res) => {
    User.findOneAndUpdate({
        username: req.params.username
    },
        {
            $set: { password: req.body.password }
        },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            const msg = "Password updated successfully"
            return res.status(200).json(msg);
        },
    )
});

router.route("/mybids/:id").patch(middleware.checkToken, (req, res) => {
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    var cc = checkForHexRegExp.test(req.params.id)
    if (!cc) {
        return res.json(("Product not found"));
    }
    User.findOneAndUpdate({ username: req.decoded.username },
        {
            $push: { mybids: { productId: req.params.id, bidOffer: req.body.price, }, }
        }
    ),
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            if (!result) return res.status(404).json(("Not found"));
            const msg = "Done"
            return res.status(200).json(msg);
        }

});


module.exports = router;