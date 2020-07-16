var express = require('express');
var models = require('../models');
var router = express.Router();
const shopifyAPI = require('shopify-node-api');
var config = require('../settings.json');
const apiKey = config.oauth.api_key;

//Uninstalling shop when app is uninstalled
router.post('/uninstall_shop', function (req, res, next) {
    console.log("/get_webhook/uninstall_shop");
    var shop_data = req.body;
    var shop_domain = shop_data.myshopify_domain;
    models.shopData.findOne({
        "shop_domain": shop_domain,
        "status": {
            "$ne": "uninstalled"
        }
    }, function (e, shopd) {
        if (shopd) {
            models.shopData.remove({
                "shop_domain": shop_domain
            }, function (e, data) {
                res.sendStatus(200);
            });

        }
    });
});

// router.post('/shop/update', function (req, res, next) {
//     console.log("/shop/update", req.query);
//     console.log("/shop/update", req.body);
//     var shop_data = req.body;
//     var shop_domain = shop_data.myshopify_domain;
//     models.shopData.findOne({
//         "shop_domain": shop_domain,
//         "status": {
//             "$ne": "uninstalled"
//         }
//     }, function (e, shopd) {
//         if (shopd) {
//             models.shopData.remove({
//                 "shop_domain": shop_domain
//             }, function (e, data) {
//                 res.sendStatus(200);
//             });

//         }
//     });
// });


//Create Callback for customers/redact Webhook for customer redact
router.post('/customer_redact_data', function (req, res, next) {
    res.sendStatus(200);
});

//Create Callback for shop/redact Webhook for customer redact
router.post('/shop_redact_data', function (req, res, next) {
    res.sendStatus(200);
});

//Create Callback for customers/data_request Webhook for customer redact
router.post('/customer_data_request', function (req, res, next) {
    res.sendStatus(200);
});

module.exports = router;