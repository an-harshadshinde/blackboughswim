var express = require('express');
var models = require('../models');
var router = express.Router();
const shopifyAPI = require('shopify-node-api');
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
var ObjectID = require('mongodb').ObjectID;



//Load collections to show on data tables
router.get('/get_data/:selected_kit_id', function (req, res) {
    console.log("/collection/get_data");
    var shop = req.session.shop;
    var selected_kit_id = new ObjectID(req.params.selected_kit_id);
    var collection_array = [];
    var collections_data = [];
    var kit;
    var collection_id;
    var product_id;
    var product_type;
    var Shopify;
    models.productData.find({
        shop: shop,
        kit_id: selected_kit_id
    }, function (e, data) {
        for (var j = 0; j < data.length; j++) {
            kit = data[j].kit;
            collection_id = data[j].collectionID;
            product_id = data[j].product_id;
            product_type = data[j].product_type;
            if (collection_array.indexOf(collection_id.toString()) < 0) {
                collections_data.push({
                    "collection_id": collection_id,
                    "product_type": product_type,
                    "kit": kit,
                });
                collection_array.push(collection_id);
            }
        }
        res.send(collections_data);
    });
});

//Get all Collections in shopify products
router.get('/get_collections', function (req, res) {
    console.log("/collection/get_collections");
    var collections = new Array();
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    //get smart collection data
    Shopify.get('/admin/api/2020-04/smart_collections.json', function (err, smartCollection, headers) {
        //console.log(smartCollection);
        if (smartCollection) {
            for (var i = 0; i < smartCollection.smart_collections.length; i++) {
                collections.push(smartCollection.smart_collections[i]);
            }
        }
        //get custom collection data
        Shopify.get('/admin/api/2020-04/custom_collections.json', function (err, customCollections, headers) {
            //console.log(customCollections);
            if (customCollections) {
                for (var j = 0; j < customCollections.custom_collections.length; j++) {
                    collections.push(customCollections.custom_collections[j]);
                }
            }
            res.send(collections);
        });
    });
});

//Adding Products with particular CollectionID into database
router.post('/add_products_by_collectionID', function (req, res) {
    console.log("Into add_products_by_collectionID..");
    var id = req.body.id;
    var collectionID = req.body.collectionID;
    var kit_id = req.body.kit;
    var product_type = req.body.product_type;
    kit_id = new ObjectID(kit_id); // wrap in ObjectID
    var variant_id = "";
    var image_src = "";
    var position;
    var category;
    models.kits.findOne({
        "shop": req.session.shop,
        "_id": kit_id
    }, function (e, data) {
        if (data) {
            kit = data.kit_name;
        }
    });
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });

    Shopify.get('/admin/api/2020-04/products.json?collection_id=' + collectionID, function (err, products, headers) {
        products.products.forEach(function (item, index1) {
            variant_id = "";
            //Create product
            position = 0;
            var product_id = (item['id']).toString();
            if (item.images && item.images.length > 1) {
                for (var i = 0, len1 = item.images.length; i < len1; i++) {
                    new_position = Number(item.images[i]["position"]);
                    if (position < new_position) {
                        position = new_position;
                        variant_id = (item['variants'][0]["id"]).toString();
                        image_src = item.images[i]["src"];
                    }
                    if (i == len1 - 1) {
                        break;
                    }
                }
            } else {
                image_src = item['image']['src'];
                variant_id = item['variants'][0]["id"];
            }
            var new_product = new models.productData({
                "product_type": product_type,
                "product_name": item['title'],
                "product_price": item['variants'][0]['price'],
                "img": image_src,
                "product_id": (item['id']).toString(),
                "kit": kit,
                "collectionID": collectionID,
                "variantId": variant_id,
                "shop": req.session.shop,
                "kit_id": kit_id
            });
            new_product.save(function (err, rec) {
                if (err) {
                    console.log('error saving product..');
                } else {
                    console.log('product successfully saved.');

                }
            });
        });
    });
    res.send({
        msg: 'Success'
    });
});

//Routes for product type
router.post("/update_collection_type", function (req, res) {
    console.log("/collection/update_collection_type");
    var collection_id = req.body.collection_id;
    var selected_kit_id = new ObjectID(req.body.selected_kit_id);
    var product_type = req.body.product_type;
    var shop = req.session.shop;
    models.productData.updateMany({
        "shop": shop,
        "kit_id": selected_kit_id,
        "collectionID": collection_id
    }, {
        "$set": {
            "product_type": product_type
        }
    }, function (err, response) {
        if (!err) {
            res.send("success");
        }
    });
});

module.exports = router;