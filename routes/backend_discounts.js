var express = require('express');
var models = require('../models');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
const shopifyAPI = require('shopify-node-api');
/* GET home page. */

//Into discounts page
router.get('/', function (req, res) {
    console.log("Into discsounts...");
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });

    Shopify.get('/admin/api/2020-04/price_rules.json', function (err, data, headers) {
        if (!err) {
            console.log('price rules: ', data);
            res.send(data);
        } else {
            res.send('error', err);
        }
    });
});

//Get discounts related to any price rules
router.get('/get_discount_code/:id', function (req, res) {
    console.log("Into get_discount_code...");
    var priceRuleID = req.params.id;
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });

    Shopify.get('/admin/api/2020-04/price_rules/' + priceRuleID + '/discount_codes.json', function (err, data, headers) {
        if (!err) {
            //  console.log('discount codes: ', data);
            res.send(data);
        }
        // } else {
        // 	res.send('error', err);
        // }
    });
});

//Get all Shopify products into Modal Popup
router.get('/get_discount_products', function (req, res) {
    console.log("Into get_discount_products...");
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/products.json', function (err, products, headers) {
        console.log(products.products.length);
        res.send({
            "products": products.products
        });
    });
});

//Creating Discounts

router.post('/add_discount', function (req, res) {
    console.log('Into add_discount.. ');

    var target_type, target_selection, value_type, value;
    //var today = new Date();
    var discount_on = req.body.discount_on;
    var title = req.body.discountCode;
    var code = req.body.discountCode;
    var type = req.body.discount_type;
    var appliesTo = req.body.disAppliedTO;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var minimum_total_range = req.body.minimum_total_range;
    var addedProducts = req.body.discProductArray;
    var addedCollections = req.body.discCollectionArray;
    var finalProducts = [];
    var postdata;
    if (discount_on == "single") {
        if (addedProducts) {
            for (var i = 0; i < addedProducts.length; i++) {
                finalProducts.push(parseInt(addedProducts[i]));
            }
        }

        var finalCollects = [];
        if (addedCollections) {
            for (var i = 0; i < addedCollections.length; i++) {
                finalCollects.push(parseInt(addedCollections[i]));
            }
        }
        var allocation_method = 'each';

        if (type == 'percent') {
            target_type = 'line_item';
            value_type = 'percentage';
            value = parseInt(req.body.discount_percent_val);
            //allocation_method = 'each';
        } else if (type == 'fixed') {
            target_type = 'line_item';
            value_type = 'fixed_amount';
            value = parseInt(req.body.discount_fixed_val);
            //allocation_method = 'each';
        } else if (type == 'shipping') {
            target_type = 'shipping_line';
            value_type = 'percentage';
            value = 100;
        }

        //Make changes into backend_discount route.

        var entitled_collection_ids = [];
        if (appliesTo == 'all') {
            //target_selection changes 'all' to 'entitled'
            // target_selection = 'all';
            console.log("Updated api using new changes and updated changes target_selection 'all' to  'entitled'");
            target_selection = 'entitled';
            entitled_collection_ids = [];
            //Get entitled collection ids from smart collections
            console.log("shop is :" + req.session.shop);
            console.log("apiKey is :" + apiKey);
            console.log("access_token is :" + req.session.access_token);

            var Shopify = new shopifyAPI({
                shop: req.session.shop,
                shopify_api_key: apiKey,
                access_token: req.session.access_token,
                verbose: false
            });
            //get smart collection data
            Shopify.get('/admin/api/2020-04/smart_collections.json', function (err, smartCollection, headers) {
                console.log("smartCollection" + JSON.stringify(smartCollection));
                if (smartCollection) {
                    for (var i = 0; i < smartCollection.smart_collections.length; i++) {
                        console.log(smartCollection.smart_collections[i].id);
                        entitled_collection_ids.push(smartCollection.smart_collections[i].id);
                    }
                    console.log("collection ids are :" + entitled_collection_ids);
                }

            });

        } else {
            target_selection = 'entitled';
        }

        if (type == 'shipping') {
            target_selection = 'all';
        }

        var once_per_customer = true;
        var usage_limit = '';
        var customer_selection = 'all';
        // var prerequisite_subtotal_range = (0, null);
        var prerequisite_shipping_price_range = '';
        var prerequisite_saved_search_ids = [];

        var entitled_product_ids = [];
        if (appliesTo == 'collections') {
            if (type == 'shipping') {
                entitled_product_ids = [];
                var entitled_collection_ids = [];
            } else {
                entitled_product_ids = [];
                var entitled_collection_ids = finalCollects;
            }
        } else if (appliesTo == 'products') {
            if (type == 'shipping') {
                entitled_product_ids = [];
                var entitled_collection_ids = [];
            } else {
                entitled_product_ids = finalProducts;
                var entitled_collection_ids = [];
            }
        }

        var entitled_variant_ids = [];
        var entitled_country_ids = [];
        var starts_at = startDate;
        var ends_at = endDate;


        console.log("minimum_total_range :", minimum_total_range);
        if (parseInt(minimum_total_range) != 0) {
            var prerequisite_subtotal_range = {
                "greater_than_or_equal_to": minimum_total_range
            };
            console.log("prerequisite_subtotal_range :", prerequisite_subtotal_range);
            postdata = {
                "price_rule": {
                    "title": title,
                    "target_type": target_type,
                    "target_selection": target_selection,
                    "allocation_method": allocation_method,
                    "value_type": value_type,
                    "value": -(value),
                    "once_per_customer": once_per_customer,
                    "usage_limit": usage_limit,
                    "customer_selection": customer_selection,
                    "prerequisite_subtotal_range": prerequisite_subtotal_range,
                    // "prerequisite_shipping_price_range": prerequisite_shipping_price_range,
                    // "prerequisite_saved_search_ids": prerequisite_saved_search_ids,
                    "entitled_product_ids": entitled_product_ids,
                    "entitled_collection_ids": entitled_collection_ids,
                    "entitled_variant_ids": entitled_variant_ids,
                    "entitled_country_ids": entitled_country_ids,
                    "starts_at": starts_at,
                    "ends_at": ends_at
                }
            };
        } else {
            postdata = {
                "price_rule": {
                    "title": title,
                    "target_type": target_type,
                    "target_selection": target_selection,
                    "allocation_method": allocation_method,
                    "value_type": value_type,
                    "value": -(value),
                    "once_per_customer": once_per_customer,
                    "usage_limit": usage_limit,
                    "customer_selection": customer_selection,
                    // "prerequisite_subtotal_range": prerequisite_subtotal_range,
                    // "prerequisite_shipping_price_range": prerequisite_shipping_price_range,
                    // "prerequisite_saved_search_ids": prerequisite_saved_search_ids,
                    "entitled_product_ids": entitled_product_ids,
                    "entitled_collection_ids": entitled_collection_ids,
                    "entitled_variant_ids": entitled_variant_ids,
                    "entitled_country_ids": entitled_country_ids,
                    "starts_at": starts_at,
                    "ends_at": ends_at
                }
            };
        }


        console.log('postdata:', postdata);

        var Shopify = new shopifyAPI({
            shop: req.session.shop,
            shopify_api_key: apiKey,
            access_token: req.session.access_token,
            verbose: false
        });

        Shopify.post('/admin/api/2020-04/price_rules.json', postdata, function (err, data, headers) {
            //  console.log('data: ', data);
            if (data.price_rule) {
                var id = data.price_rule.id;
                var title = data.price_rule.title;
                var params = {
                    "discount_code": {
                        "code": title
                    }
                };
                Shopify.post('/admin/api/2020-04/price_rules/' + id + '/discount_codes.json', params, function (err, data, headers) {
                    console.log('data: ', data);
                    res.send({
                        msg: 'Success',
                        data: data
                    });
                });
            }
        });
    } else {

        if (type == 'percent') {

            value = parseInt(req.body.discount_percent_val);
            //allocation_method = 'each';
        } else if (type == 'fixed') {

            value = parseInt(req.body.discount_fixed_val);
            //allocation_method = 'each';
        }

        //If discount is on combo
        if (addedProducts && addedProducts.length > 0) {
            var new_discount = new models.discounts({
                shop: req.session.shop,
                discount_code: code,
                discount_type: type,
                discount_value: value,
                items: addedProducts
            });

            new_discount.save(function (err, rec) {
                if (!err) {
                    res.send("success");
                }
                if (err) {
                    console.log("error")
                }
            });
        }
    }
});

//Get Discount details to show on Edit Discount page
router.post('/get_rule', function (req, res) {
    console.log('get_rule..');
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    var priceRuleID = req.body.id;
    var discId = req.body.disc_id;
    Shopify.get('/admin/api/2020-04/price_rules/' + priceRuleID + '.json', function (err, data, headers) {
        if (!err) {
            //console.log('price rules: ', data);
            Shopify.get('/admin/api/2020-04/price_rules/' + priceRuleID + '/discount_codes/' + discId + '.json', function (err, discountData, headers) {
                res.send({
                    "rule": data,
                    "discountData": discountData
                });
            });

        } else {
            res.send('error', err);
        }
    });
});


//Updating discounts
router.post('/edit_discount', function (req, res) {
    console.log('edit_discount..');
    var target_type, target_selection, value_type, value;
    var today = new Date();
    var priceRuleID = req.body.id;
    var discountID = req.body.disc_id;
    var title = req.body.discountCode;
    var code = req.body.discountCode;
    var type = req.body.discount_type;
    var appliesTo = req.body.disAppliedTO;
    var addedCollections = req.body.discCollectionArray;
    var starts_at = req.body.startDate;
    var ends_at = req.body.endDate;
    var minimum_total_range = req.body.minimum_total_range;
    var finalCollects = [];
    if (addedCollections) {

        for (var i = 0; i < addedCollections.length; i++) {
            finalCollects.push(parseInt(addedCollections[i]));
        }
    }

    var addedProducts = req.body.discProductArray;
    var finalProducts = [];
    if (addedProducts) {
        for (var i = 0; i < addedProducts.length; i++) {
            finalProducts.push(parseInt(addedProducts[i]));
        }
    }

    var allocation_method = 'each';

    if (type == 'percent') {
        target_type = 'line_item';
        value_type = 'percentage';
        value = parseInt(req.body.discount_percent_val);
        //allocation_method = 'each';
    } else if (type == 'fixed') {
        target_type = 'line_item';
        value_type = 'fixed_amount';
        value = parseInt(req.body.discount_fixed_val);
        //allocation_method = 'each';
    } else if (type == 'shipping') {
        target_type = 'shipping_line';
        value_type = 'percentage';
        value = 100;
    }

    var entitled_collection_ids = [];
    if (appliesTo == 'all') {
        // target_selection = 'all';
        //target_selection changes 'all' to 'entitled'
        // target_selection = 'all';
        console.log("Updated api using new changes and updated changes target_selection 'all' to  'entitled'");
        target_selection = 'entitled';
        var entitled_product_ids = [];

        //Get entitled collection ids from smart collections
        console.log("shop is :" + req.session.shop);
        console.log("apiKey is :" + apiKey);
        console.log("access_token is :" + req.session.access_token);

        var Shopify = new shopifyAPI({
            shop: req.session.shop,
            shopify_api_key: apiKey,
            access_token: req.session.access_token,
            verbose: false
        });
        //get smart collection data
        Shopify.get('/admin/api/2020-04/smart_collections.json', function (err, smartCollection, headers) {
            console.log("smartCollection" + JSON.stringify(smartCollection));
            if (smartCollection) {
                for (var i = 0; i < smartCollection.smart_collections.length; i++) {
                    console.log(smartCollection.smart_collections[i].id);
                    entitled_collection_ids.push(smartCollection.smart_collections[i].id);
                }
                console.log("collection ids are :" + entitled_collection_ids);
            }

        });

    } else {
        target_selection = 'entitled';
    }

    if (type == 'shipping') {
        target_selection = 'all';
    }
    var once_per_customer = true;
    var usage_limit = '';
    var customer_selection = 'all';
    // var prerequisite_subtotal_range = (0, null);
    var prerequisite_shipping_price_range = '';
    var prerequisite_saved_search_ids = [];

    var entitled_product_ids = [];
    var entitled_collection_ids = [];
    if (appliesTo == 'collections') {
        if (type == 'shipping') {
            entitled_product_ids = [];
            entitled_collection_ids = [];
        } else {
            entitled_product_ids = [];
            entitled_collection_ids = finalCollects;
        }
    } else if (appliesTo == 'products') {
        if (type == 'shipping') {
            entitled_product_ids = [];
            entitled_collection_ids = [];
        } else {
            entitled_product_ids = finalProducts;
            entitled_collection_ids = [];
        }
    }
    var entitled_variant_ids = [];
    var entitled_country_ids = [];


    var postdata;
    console.log("minimum_total_range :", minimum_total_range);
    if (parseInt(minimum_total_range) != 0) {
        var prerequisite_subtotal_range = {
            "greater_than_or_equal_to": minimum_total_range
        };
        console.log("prerequisite_subtotal_range :", prerequisite_subtotal_range);
        postdata = {
            "price_rule": {
                "title": title,
                "target_type": target_type,
                "target_selection": target_selection,
                "allocation_method": allocation_method,
                "value_type": value_type,
                "value": -(value),
                "once_per_customer": once_per_customer,
                "usage_limit": usage_limit,
                "customer_selection": customer_selection,
                "prerequisite_subtotal_range": prerequisite_subtotal_range,
                // "prerequisite_shipping_price_range": prerequisite_shipping_price_range,
                // "prerequisite_saved_search_ids": prerequisite_saved_search_ids,
                "entitled_product_ids": entitled_product_ids,
                "entitled_collection_ids": entitled_collection_ids,
                "entitled_variant_ids": entitled_variant_ids,
                "entitled_country_ids": entitled_country_ids,
                "starts_at": starts_at,
                "ends_at": ends_at
            }
        };
    } else {
        postdata = {
            "price_rule": {
                "title": title,
                "target_type": target_type,
                "target_selection": target_selection,
                "allocation_method": allocation_method,
                "value_type": value_type,
                "value": -(value),
                "once_per_customer": once_per_customer,
                "usage_limit": usage_limit,
                "customer_selection": customer_selection,
                // "prerequisite_subtotal_range": prerequisite_subtotal_range,
                // "prerequisite_shipping_price_range": prerequisite_shipping_price_range,
                // "prerequisite_saved_search_ids": prerequisite_saved_search_ids,
                "entitled_product_ids": entitled_product_ids,
                "entitled_collection_ids": entitled_collection_ids,
                "entitled_variant_ids": entitled_variant_ids,
                "entitled_country_ids": entitled_country_ids,
                "starts_at": starts_at,
                "ends_at": ends_at
            }
        };
    }

    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleID + '.json', postdata, function (err, data, headers) {
        //  console.log('data: ', data);
        if (data.price_rule) {
            var id = data.price_rule.id;
            var title = data.price_rule.title;
            var params = {
                "discount_code": {
                    "code": title
                }
            };
            Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleID + '/discount_codes/' + discountID + '.json', params, function (err, data, headers) {
                //  console.log('data: ', data);
                res.send({
                    msg: 'Success'
                });
            });
        }
    });
});


//Deleting discounts
router.post('/delete_discount', function (req, res) {
    console.log("delete_discount..");
    var priceRuleId = req.body.id;
    var discId = req.body.discid;
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.delete('/admin/api/2020-04/price_rules/' + priceRuleId + '/discount_codes/' + discId + '.json', function (err, data, headers) {
        //  console.log('data: ', data);
        Shopify.delete('/admin/api/2020-04/price_rules/' + priceRuleId + '.json', function (err, data, headers) {
            res.send({
                msg: 'Success'
            });
        });
    });
});

//Disable discounts which are selected in discounts table
router.post('/disable_discount', function (req, res) {
    console.log("disable_discount..");
    var priceRuleId = req.body.id;
    var discId = req.body.discid;
    var ends_at = new Date();
    console.log("id :", priceRuleId);
    console.log("discId :", discId);
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/price_rules/' + priceRuleId + '/discount_codes/' + discId + '.json', function (err, discountData, headers) {
        console.log("discountData", discountData.discount_code.code);
        var postdata = {
            "price_rule": {
                "title": discountData.discount_code.code,
                "ends_at": ends_at
            }
        };
        Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleId + '.json', postdata, function (err, data, headers) {
            //  console.log('data: ', data);
            if (data.price_rule) {
                var id = data.price_rule.id;
                var title = data.price_rule.title;
                var params = {
                    "discount_code": {
                        "code": title
                    }
                };
                Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleId + '/discount_codes/' + discId + '.json', params, function (err, data, headers) {
                    // console.log('data: ', data);
                    res.send({
                        msg: 'Success'
                    });
                });
            }
        });
    });
});

//Disable discounts which are selected in discounts table
router.post('/enable_discount', function (req, res) {
    console.log("enable_discount..");
    var priceRuleId = req.body.id;
    var discId = req.body.discid;
    // var ends_at = new Date();
    console.log("id :", priceRuleId);
    console.log("discId :", discId);
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/price_rules/' + priceRuleId + '/discount_codes/' + discId + '.json', function (err, discountData, headers) {
        console.log("discountData", discountData.discount_code.code);
        var postdata = {
            "price_rule": {
                "title": discountData.discount_code.code,
                "ends_at": null
            }
        };
        Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleId + '.json', postdata, function (err, data, headers) {
            //  console.log('data: ', data);
            if (data.price_rule) {
                var id = data.price_rule.id;
                var title = data.price_rule.title;
                var params = {
                    "discount_code": {
                        "code": title
                    }
                };
                Shopify.put('/admin/api/2020-04/price_rules/' + priceRuleId + '/discount_codes/' + discId + '.json', params, function (err, data, headers) {
                    // console.log('data: ', data);
                    res.send({
                        msg: 'Success'
                    });
                });
            }
        });
    });
});


module.exports = router;