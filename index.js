const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://dbUser:@Ctiva7106@cluster0.qkeib.gcp.mongodb.net/AppDb?retryWrites=true&w=majority", { useNewUrlParser: true })

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDb connected");
});

const app = express();

const Port = process.env.PORT || 5000;

app.use(express.json())
const userRoute = require("./routes/user");
app.use("/user", userRoute);

const productRoute = require("./routes/product");
app.use("/product", productRoute);


app.route("/").get((req, res) => {
    res.json("Your rest api");
})

app.listen(Port, () => { console.log(`your server is running on ${Port}`) })