const { productController, imageController } = require('../controllers')
const express = require('express')
const router = express.Router()

router.post('/addProduct', productController.addProduct);
router.get('/selectProduct/:productId', productController.selectItem);
router.delete('/deleteItem/:productId',productController.deleteItem)
router.put('/updateItem/:productId', productController.updateItem)
router.post('/uploadImage', imageController.uploadImage)

module.exports = router;