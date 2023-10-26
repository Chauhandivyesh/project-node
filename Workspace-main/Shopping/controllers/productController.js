const { product } = require("../models");
const { statusCode } = require("../global"); 
const { OK: success, NOT_FOUND: notFound } = statusCode;

const productDetails = {
  //add product
  async addProduct(req, res) {
    const {
      productId,productName,
      qty,
      description,
      productImage,
      dateOfProduct,
      ExpiryDate,
    } = req.body;

    try {
      const existingProduct = await product.findOne({ productId });

      if (existingProduct) {
        const exists = statusCode.ALREADY_EXISTS;
        return res.status(exists.statuscode).json({
          exists,
        });
      } else {
        // Create and save the new product
        const newItem = new product({
          productId,
          productName,
          qty,
          description,
          productImage,
          dateOfProduct,
          ExpiryDate,
        });

        const item = await newItem.save();
        return res.status(success.statuscode).json({
          success,
          item,
        });
      }
    } catch (err) {
      return res.send(err)
    }
  },

  //select product
  async selectItem(req, res) {
    try {
      const findProduct = await product.findOne({
        productId: req.params.productId,
      });
      if (!findProduct) {
        return res.status(notFound.statuscode).json({
          notFound,
        });
      } else {
        return res.status(success.statuscode).json({
          success,
          findProduct,
        });
      }
    } catch (err) {
      return res.send(err)
    }
  },

  // delete product
  async deleteItem(req, res) {
    try {
      const findProduct = await product.findOne({
        productId: req.params.productId,
      });
      if (!findProduct) {
        return res.status(notFound.statuscode).json({
          notFound,
        });
      } else {
        const deleteItem = await product.deleteOne({
          productId: req.params.productId,
        });
        return res.status(success.statuscode).json({
          success,
          deleteItem,
        });
      }
    } catch (err) {
      return res.send(err)
    }
  },

  // update product
  async updateItem(req, res) {
    try {
      const productId = req.params.productId; 
      const { productName, qty, description } = req.body;
    
      const findProduct = await product.findOne({ productId });
    
      if (!findProduct) {
        return res.status(notFound.statuscode).json({
          notFound,
        });
      }
    
      const updateItem = await product.updateOne(
        { productId },
        { $set: { productName, qty, description } }
      );
    
      return res.status(success.statuscode).json({
        success,
        updateItem,
      });
    } catch (err) {
      return res.send(err);
    }
  }    
};

module.exports = productDetails;
