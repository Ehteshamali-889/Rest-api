const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/products");


router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if(!product){
        return res.status(404).json({
          message:'Product not found'
        })
      }
      const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order Stored",
        createdOrder: {
          product: result.product,
          quantity: result.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    })
  
  
});

router.get("/:orderId", (req, res, next) => { 
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
    // res.status(200).json({
    //   message: "Single Order Id",
    // });
});



router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: "Deleted Orders",
  //   orderId:req.params.orderId
  // });
});

module.exports = router;
