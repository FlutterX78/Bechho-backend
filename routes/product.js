const express = require("express");
const User = require("../model/userModel");
// const config = require("../config");
// const jwt = require("jsonwebtoken")
const middleware = require("../middleware")
const Product = require("../model/productModel");
var ObjectId = require('mongodb').ObjectID;
const router = express.Router();
assert = require('assert');
const path = require('path')
const multer = require("multer");
const bodyParser = require("body-parser")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, req.decoded.username + '-' + Date.now() + ".jpg");
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    // fileFilter: fileFilter
});
router.route("/addimage/:id").patch(middleware.checkToken, upload.single("img"), (req, res) => {
    Product.findOneAndUpdate(
        { id: req.params.id },
        {
            $push: {
                img: req.file.path
            },
        },
        { new: true },
        (err, product) => {
            if (err) return res.status(500).send(err);
            const response = {
                message: "image added successfully updated",
                data: product,
            };
            return res.status(200).send(response);
        }
    );
});


//add product
router.route("/addproduct").post(middleware.checkToken, (req, res) => {
    console.log("adding product");
    const product = new Product({
        productuserId: req.decoded.username,
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
    });
    product.save().then(() => {
        console.log("Successfull");
        res.status(200).json({ ObjectID: ObjectId });
    }).catch((err) => {
        res.status(403).json({ msg: err });
    });
});



// router.route("/carbid/:name").patch((req, res) => {
//     Product.findOneAndUpdate({ name: req.params.name },
//         {
//             $push: {
//                 bid: req.body.bid
//             }
//         },
//         (err, result) => {
//             if (err) return res.status(500).json({ msg: err });
//             if (!result) return res.status(404).json(("Not found"));
//             const msg = "Done"
//             return res.status(200).json(msg);
//         }
//     )
// });

router.route("/mybids").get(middleware.checkToken, (req, res) => {
    User.find({ username: req.body.username },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            if (!result) return res.status(404).json(("Not found"));
            if (result) return res.send(result);
            const msg = "Done"
            return res.status(200).json(msg);
        });
})

//bidding
router.route("/bid/:id").patch(middleware.checkToken, (req, res) => {
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
        Product.findOneAndUpdate({ _id: ObjectId(req.params.id) },
            {

                $push: { bid: { price: req.body.price, userBidding: req.decoded.username }, }

            },
            (err, result) => {
                if (err) return res.status(500).json({ msg: err });
                if (!result) return res.status(404).json(("Not found"));
                const msg = "Done"
                return res.status(200).json(msg);
            }
        )
});

router.route("/getallproducts").get(middleware.checkToken, (req, res) => {
    Product.find({},
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            if (!result) return res.status(404).json(("Not found"));
            if (result) return res.send(result);
            const msg = "Done"
            return res.status(200).json({ result });
        });

});


//get all products of user
router.route("/getproducts").get(middleware.checkToken, (req, res) => {
    Product.find({ productuserId: req.decoded.username }
        ,
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            if (!result) return res.status(404).json(("Not found"));
            if (result) return res.send(result);
            const msg = "Done"
            return res.status(200).json({ data: result });
        });

});

// router.route("/checkusername/:username").get((req, res) => {
//     User.findOne({ username: req.params.username }, (err, result) => {
//         if (err) return res.status(500).json({ msg: err });
//         if (result !== null) {
//             return res.json({
//                 Status: true
//             });
//         } else {
//             return res.json({
//                 Status: false
//             });
//         }
//     });
// });

// router.route("/bid/id").get(function(req, res) {
//     smartphones.findById("5f4541bdf4ec8513e9e58790", function(err, result) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(result);
//       }
//     });
//   });
module.exports = router;