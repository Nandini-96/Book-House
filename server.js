import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';



//load variables
dotenv.config();

//start server
// const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());



//Home Route
app.get("/",(req,res) => {
res.sendFile("index.htm",{root: "public"});
});
// Success
app.get("/success",(req,res) => {
    res.sendFile("success.htm",{root:"public"});
});
// cancel
app.get("/cancel",(req,res) => {
    res.sendFile("cancel.htm",{root:"public"});
});
// stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;
// console.log(1);

app.post("/checkout", async(req,res) => {
   // try{
        
 
 //create checkout session
 const session = await stripeGateway.checkout.sessions.create({
    
    payment_method_types: ["card"],
    line_items: req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g,"")*100);
        console.log('item-price:',item.price);
        console.log('unitAmount:',unitAmount);
        return {
            price_data:{
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.productImage]
                },
                unit_amount: unitAmount,
            },
            quantity:item.quantity,
        };
     })
    //  console.log("lineItems:",lineItems);
    ,
    mode: "payment" ,
    success_url: `${DOMAIN}/success.htm`,
    cancel_url: `${DOMAIN}/cancel.htm`,
   
    //Asking Address In stripe checkout page
    billing_address_collection: 'required',
 });
 res.json({url: session.url});
// } catch(e){
//     // If there is an error send it to the client
//     res.status(500).json({ error: e.message })


});

app.listen(3000, () => {
    console.log("listening on port 3000");
});