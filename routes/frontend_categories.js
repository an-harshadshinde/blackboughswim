var express = require('express');
var models = require('../models');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
const request = require("request-promise");

//Get builder page for Frontend App
router.get('/get_builder', function (req, res, next) {
    console.log("/category/get_builder");
    var shop = req.query.shop;
    models.shopData.findOne({
            shop_domain: shop
        },
        function (err, sdata) {
            request({
                    url: "http://appengine.applicationnexus.com/products/load_product?shop=" + sdata.shop_domain + "&access_token=" + sdata.access_token,
                    method: "GET"
                },
                function (err, resp, body) {
                    // if (err) {
                    //   console.log("error is" + err);
                    // } else {
                    // if (body == "accepted") {
                    var currencySymbol = sdata["currencySymbol"];
                    models.kits.findOne({
                            shop: shop,
                            _id: new ObjectID(req.query.kit_id)
                        },
                        function (e, data) {
                            models.productData.find({
                                    shop: shop,
                                    kit_id: data._id
                                },
                                function (err, response) {
                                    models.settings.find({
                                            shop: shop
                                        },
                                        function (e, settingsData) {
                                            models.colors.find({
                                                "shop": shop
                                            }, function (err, colors_data) {
                                                res.render("daquini_builder_new", {
                                                    productData: response,
                                                    kits: data,
                                                    settings: settingsData,
                                                    shopData: sdata,
                                                    s_product: body,
                                                    shop: req.query.shop,
                                                    colors_data: colors_data,
                                                    currencySymbol: currencySymbol
                                                });
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
});

module.exports = router;