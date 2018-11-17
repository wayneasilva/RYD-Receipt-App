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
    item1: {name: String, price: Number, tax: Number, Total: Number},
    item2: {name: String, price: Number, tax: Number, Total: Number},
    item3: {name: String, price: Number, tax: Number, Total: Number},
    item4: {name: String, price: Number, tax: Number, Total: Number},
    item5: {name: String, price: Number, tax: Number, Total: Number},
    item6: {name: String, price: Number, tax: Number, Total: Number},
    item7: {name: String, price: Number, tax: Number, Total: Number},
    item8: {name: String, price: Number, tax: Number, Total: Number},
    item9: {name: String, price: Number, tax: Number, Total: Number},
    item10: {name: String, price: Number, tax: Number, Total: Number},
    notes: String
});

const Receipt = mongoose.model("receipt", receiptSchema);

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
//must calculate totals and include tax etc and submit to server**

// //CREATE ROUTE
app.post("/receipts", (req, res) => {
    // req.body.receipt.body = req.sanitize(req.receipt.blog.body);
    let saleData = req.body.receipt;
    let taxRate = 0.075;
     
    let itemNames = [];

    let pricesPreTax = [];
    let pricesPreTaxConv = [];

    let finalNames = [];
    let taxes = [];
    let itemTotals = [];

    let subTotal = 0;
    
    //This line pushes our 10 item prices into an array.
    pricesPreTax.push(
        saleData['item1']['price'], 
        saleData['item2']['price'], 
        saleData['item3']['price'], 
        saleData['item4']['price'], 
        saleData['item5']['price'], 
        saleData['item6']['price'], 
        saleData['item7']['price'], 
        saleData['item8']['price'], 
        saleData['item9']['price'], 
        saleData['item10']['price']
    );

    //This line pushes all item name values into an array for later use.
    itemNames.push(
        saleData['item1']['name'], 
        saleData['item2']['name'], 
        saleData['item3']['name'], 
        saleData['item4']['name'], 
        saleData['item5']['name'], 
        saleData['item6']['name'], 
        saleData['item7']['name'], 
        saleData['item8']['name'], 
        saleData['item9']['name'], 
        saleData['item10']['name']
    );

    //create a new array with only the names with a value other than ''
    function removeEmptyNames(itemNames) {
        itemNames.forEach((name) => {
            if (name !== '') {
                finalNames.push(name);
            }
        })
        // console.log(finalNames);
    }
    
    //This function will convert our pricePreTax array values to float from string
    function convertToFloat(pricesPreTax) {
        pricesPreTax.forEach((price) => {
            if (price !== '') {
                let convertedPrice = parseFloat(price);
                pricesPreTaxConv.push(convertedPrice);
            }
        })
    }
    
    //This function will take our converted pricePreTaxConv array vales and add them to our subTotal variable
    function calculateSubtotal(pricesPreTaxConv) {
        pricesPreTaxConv.forEach((price) => {
            subTotal += price;
        })
        // console.log(subTotal);
    }

    //This function will return an array with each element being the item price + tax.
    function calculateItemPlusTax(pricesPreTaxConv) {
        pricesPreTaxConv.forEach((price) => {
            let tax = price * taxRate;

            taxes.push(tax);
            itemTotals.push(price + tax);
            // console.log(itemTotals);
        })
    }

    function buildReceipt() {
        let finalSaleReceipt = {};

        finalSaleReceipt['receiptNumber'] = saleData['receiptNumber'];
        finalSaleReceipt['firstName'] = saleData['firstName'];
        finalSaleReceipt['lastName'] = saleData['lastName'];
        finalSaleReceipt['phone'] = saleData['phone'];
        finalSaleReceipt['item1'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item2'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item3'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item4'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item5'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item6'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item7'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item8'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item9'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['item10'] = {name: 'none', price: 'none', tax: 'none', total: 'none'};
        finalSaleReceipt['notes'] = saleData['notes'];

        //propArray will hold ourProperties for mutation
        let propArray = [];
        // let priceArray = [];
        // let taxArray = [];
        // let totalArray = [];

        //Iterate through finalSaleReceipt properties and push ['item1'] through ['item10'] to propArray
        for (let prop in finalSaleReceipt) {
            if (finalSaleReceipt[prop].hasOwnProperty('name') === true) {
                propArray.push(finalSaleReceipt[prop]);
            } 
            else {
                // write error catch later
            }
        }

        //Push each item name into propArray
        for (let i = 0; i < finalNames.length; i++) {
            propArray[i]['name'] = finalNames[i];
            propArray[i]['price'] = pricesPreTaxConv[i];
            propArray[i]['tax'] = taxes[i];
            propArray[i]['total'] = itemTotals[i];
        }
        
        // console.log(propArray);
        finalSaleReceipt['item1'] = propArray[0];
        finalSaleReceipt['item2'] = propArray[1];
        finalSaleReceipt['item3'] = propArray[2];
        finalSaleReceipt['item4'] = propArray[3];
        finalSaleReceipt['item5'] = propArray[4];
        finalSaleReceipt['item6'] = propArray[5];
        finalSaleReceipt['item7'] = propArray[6];
        finalSaleReceipt['item8'] = propArray[7];
        finalSaleReceipt['item9'] = propArray[8];
        finalSaleReceipt['item10'] = propArray[9];
        
        res.render("saleConfirmation", {finalSaleReceipt: finalSaleReceipt});
    }

    convertToFloat(pricesPreTax);
    removeEmptyNames(itemNames);
    calculateSubtotal(pricesPreTaxConv);
    calculateItemPlusTax(pricesPreTaxConv);
    buildReceipt();
    // console.log(finalSaleReceipt);

    // console.log(req);
    // console.log("########################")
    // console.log(req.body);
    // console.log("########################")
    // console.log(req.body.receipt);
    // console.log("########################")
    // Receipt.create(req.body.receipt, (err, newReceipt) => {
    //     if (err) {
    //         res.render("new");
    //     }
    //     else {
    //         res.redirect("/receipts");
    //     }
    // })
})

//SHOW ROUTE
app.get("/receipts/:id", (req, res) => {
    Receipt.findById(req.params.id, (err, foundReceipt) => {
        if (err) {
            // res.redirect("/receipts");
        }
        else {
            res.render("show", {receipt: foundReceipt});
        }
    })
})

//EDIT ROUTE
app.get("/receipts/:id/edit", (req, res) => {
    Receipt.findById(req.params.id, (err, foundReceipt) => {
        if (err) {
            res.redirect("/receipts");
        }
        else {
            res.render("edit", {receipt: foundReceipt});
        }
    })
})

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