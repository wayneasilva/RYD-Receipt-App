const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RYD_DB", { useNewUrlParser: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE MODEL CONFIGURATION
const receiptSchema = new mongoose.Schema({
    receiptNumber: Number,
    firstName: String,
    lastName: String,
    phone: String,
    saleDate:{type: Date, default: Date.now},
    item1: {name: String, price: Number},
    item2: {name: String, price: Number},
    item3: {name: String, price: Number},
    item4: {name: String, price: Number},
    item5: {name: String, price: Number},
    item6: {name: String, price: Number},
    item7: {name: String, price: Number},
    item8: {name: String, price: Number},
    item9: {name: String, price: Number},
    item10: {name: String, price: Number},
    notes: String
});

const Receipt = mongoose.model("receipt", receiptSchema);

// Receipt.create({
//     receiptNumber: 1,
//     firstName: "Wayne",
//     lastName: "Silva",
//     phone: "8675309",
//     item1: {name: "Carb", price: 65},
//     item2: {name: "Oil Change", price: 85},
//     notes: "Test receipt for Wayne"
// })

//ROOT ROUTE
app.get("/", (req, res) => {res.send("Receipt App Home Route");})

//INDEX ROUTE
app.get("/receipts", (req, res) => {
    Receipt.find({}, (err, receipts) => {
        if (err){
            console.log("Failed to load Receipts");
        }
        
        else {
            res.render("index", {receipts: receipts});
        }
    })
})

// //NEW ROUTE
app.get("/receipts/new", (req, res) => {res.render("new");})

// //CREATE ROUTE
app.post("/receipts", (req, res) => {
    // req.body.receipt.body = req.sanitize(req.receipt.blog.body);
    Receipt.create(req.body.receipt, (err, newReceipt) => {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/receipts");
        }
    })
})

//SHOW ROUTE
app.get("/receipts/:id", function(req, res) {
    Receipt.findById(req.params.id, function(err, foundReceipt) {
        if (err) {
            // res.redirect("/receipts");
        }
        else {
            res.render("show", {receipt: foundReceipt});
        }
    })
})

// //EDIT ROUTE
// app.get("/blogs/:id/edit", function(req, res) {
//     Blog.findById(req.params.id, function(err, foundBlog) {
//         if (err) {
//             res.redirect("/blogs");
//         }
//         else {
//             res.render("edit", {blog: foundBlog});
//         }
//     })
// })

// //UPDATE ROUTE
// app.put("/blogs/:id", function(req, res) {
//     req.body.blog.body = req.sanitize(req.body.blog.body);
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
//         if (err) {
//             res.redirect("/blogs")
//         }
//         else {
//             res.redirect("/blogs/" + req.params.id);
//         }
//     })
// })

// //DESTROY ROUTE
// app.delete("/blogs/:id", function(req, res) {
//     Blog.findByIdAndRemove(req.params.id, function(err) {
//         if (err) {
//             console.log("FAILED TO DELETE");
//             res.redirect("/blogs");
//         }
//         else {
//             //Let's prompt the user to confirm the delete later.
//             res.redirect("/blogs");
//         }

//     })
// })

app.listen(3000, function() {
    console.log("Server Started!");
});