var express = require('express');
var models = require('../models');
var router = express.Router();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
const shopifyAPI = require('shopify-node-api');
var ObjectID = require('mongodb').ObjectID;
var toHex = require('colornames');
const request = require("request-promise");
var products;

var multer = require("multer");
var bodyParser = require('body-parser');
var randomstring = require("randomstring");
const fs = require('fs')
var path = require('path')

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

//multer disk storage
var jsonParser = bodyParser.json();
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log("file is :", file);
        // var extention = file.filename.split(".")[1];
        // console.log("extention is :", extention);
        callback(null, "product_" + randomstring.generate(12).toLowerCase() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
}).single('files');

//Get the products for selected kit
router.get('/get_products_data/:selected_kit_id', function (req, res) {
    // console.log("/products/get_products_data");
    shop = req.session.shop;
    var selected_kit_id = new ObjectID(req.params.selected_kit_id);
    models.productData.find({
        "kit_id": selected_kit_id,
        shop: shop
    }, [], {
        sort: {
            '_id': -1
        }
    }, function (e, data) {
        res.send({
            products: data
        });
    });
});

//Get product count
// router.get('/check_product_count/:selected_kit_id', function (req, res, next) {
//     console.log("/products/check_product_count");
//     shop = req.session.shop;
//     var selected_kit_id = new Object(req.params.selected_kit_id);
//     models.productData.find({
//         "kit_id": selected_kit_id,
//         shop: shop
//     }, [], {
//         sort: {
//             '_id': -1
//         }
//     }, function (e, data) {
//         if (data.length > 0) {
//             res.send(data.length);
//         } else {
//             res.send(0);
//         }

//     });
// });



//Get all shopify products with selected ids
router.get('/get_all_products', function (req, res) {
    var filter_products = [];
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/products/count.json', function (err, count, headers) {
        count = count.count;
        var totalPages = Math.ceil(count / 250);
        var totalProducts = [];
        var i = 1;

        function loadNextProducts() {
            Shopify.get('/admin/api/2020-04/products.json?limit=250&page=' + i, function (err, products, headers) {
                products = products.products;
                totalProducts.push(...products);
                if (i == totalPages) {
                    res.send({
                        "products": totalProducts
                    });
                } else {
                    i++;
                }
            });
        }

        Shopify.get('/admin/api/2020-04/products.json?limit=250&page=' + i, function (err, products, headers) {
            products = products.products;
            totalProducts.push(...products);
            if (i < totalPages) {
                i++;
                loadNextProducts();
            } else {
                res.send({
                    "products": totalProducts
                });
            }
        });
    });
});

//Get all shopify products with selected ids
router.post('/get_product', function (req, res) {
    var product_id = req.body.product_id;
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/products/' + product_id + '.json', function (err, products, headers) {
        products = products.product;
        res.send({
            "product_data": products
        });
    });
});

router.post('/get_products', function (req, res) {
    console.log("/products/get_products==>", res);
    var filter_products = [];
    var products_data = [];

    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/smart_collections.json?limit=250', function (err, collections, headers) {
        collections = collections.smart_collections;
        console.log('collections :', collections);
        if (collections.length > 0) {
            function getProductInfo() {
                if (i <= collections.length - 1) {
                    var collection = collections[i];
                    Shopify.get('/admin/api/2020-04/products.json?collection_id=' + collection.id, function (err, products, headers) {
                        var params = {
                            collection: collection,
                            products: products
                        };
                        products_data.push(params);
                        i++;
                        getProductInfo();
                    });
                } else {
                    res.send({
                        "data": products_data
                    });
                }
            }
            var i = 0;
            getProductInfo();
        } else {
            setTimeout(() => {
                res.send({
                    "data": products_data
                });
            }, 1000);
        }
    });
});

//Update product
router.post('/edit_product', function (req, res) {
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    upload(req, res, function (err) {
        console.log('err :', err);
        var product_data = JSON.parse(req.body.product_data);
        var product_id = product_data.product_id;
        var product_img_action = product_data.add_edit_product_img_action;
        var product_img_id = product_data.add_edit_product_img_id;


        postdata = {
            "product": {
                "title": product_data.product_name,
                "body_html": product_data.product_description,
            }
        };

        Shopify.put('/admin/api/2020-04/products/' + product_id + '.json', postdata, function (err, products, headers) {
            products = products.product;
            if (err) {
                res.send({
                    "msg": 'Error updating product',
                    "product_data": products
                });
            } else {
                postdata = {
                    "image": {
                        "attachment": product_data.product_image_base64,
                        "filename": product_data.product_image_name,
                        "alt": 'Jozi-builder Image',
                    }
                };

                if (product_img_action == 'update') {
                    Shopify.put('/admin/api/2020-04/products/' + product_id + '/images/' + product_img_id + '.json', postdata, function (err, products, headers) {
                        products = products.product;
                        if (err) {
                            res.send({
                                "msg": 'Error updating product',
                                "product_data": products
                            });
                        }
                        res.send({
                            "msg": 'Success',
                            "product_data": products
                        });
                    });
                } else {
                    Shopify.post('/admin/api/2020-04/products/' + product_id + '/images.json', postdata, function (err, products, headers) {
                        products = products.product;
                        if (err) {
                            res.send({
                                "msg": 'Error updating product',
                                "product_data": products
                            });
                        }
                        res.send({
                            "msg": 'Success',
                            "product_data": products
                        });
                    });
                }
            }
        });
    });
});

//Deleting Category from category table and database
router.post('/delete', function (req, res, next) {
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    var product_array = req.body.product_array;
    var new_product_array = [];
    for (var i = 0; i < product_array.length; i++) {
        var id = product_array[i];
        Shopify.delete('/admin/api/2020-04/products/' + id + '.json', function (err, products, headers) {
            console.log('err :', err);
            console.log('products :', products);
        });
    }
    res.send({
        msg: 'Success'
    });
});

//Add Products,Listed Products and Collections into database
router.post('/add_kit_products', function (req, res) {
    // console.log("/products/add_kit_products");
    var kit_id = req.body.kit;
    var product_type = req.body.product_type;
    var collectionID = req.body.collectionID;
    var variant_id = "";
    var image_src = "";
    var kit;
    kit_id = new ObjectID(kit_id); // wrap in ObjectID

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

    Shopify.get('/admin/api/2020-04/products.json?limit=250?page=1', function (err, products, headers) {
        products.products.forEach(function (item, index1) {
            variant_id = "";
            //Create product
            position = 0;
            var product_id = (item['id']).toString();
            if (req.body.productArray.indexOf(product_id) >= 0) {
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
                    if (!err) {
                        // console.log('product successfully saved.');
                    }
                });
            }
        });
        res.send({
            msg: "Success"
        });
    });
});




//Search Products by title in modal Popup
// router.get('/get_products_by_title/:product_title/', function (req, res, next) {
//     console.log("/products/get_products_by_title...");
//     var Shopify = new shopifyAPI({
//         shop: req.session.shop,
//         shopify_api_key: apiKey,
//         access_token: req.session.access_token
//     });
//     var filter_products = [];
//     var product_ids = [];
//     Shopify.get('/admin/api/2020-04/products.json?limit=250?page=1', function (err, products, headers) {
//         products = products.products;
//         models.productData.find({
//             "kit_id": kit_id,
//             shop: shop
//         }, function (e, data) {
//             for (var j = 0; j < data.length; j++) {
//                 product_ids.push(data[j]["product_id"]);
//             }
//             for (var i = 0; i < products.length; i++) {
//                 if (product_ids.indexOf(products[i].id.toString()) < 0) {
//                     filter_products.push(products[i]);
//                 }
//             }
//             res.send({
//                 "products": filter_products
//             });
//         });
//     });
// });


//Routes for product type
router.post("/update_product_type", function (req, res) {
    // console.log("/products/update_product_type...");
    var product_id = req.body.product_id;
    var selected_kit_id = new ObjectID(req.body.selected_kit_id);
    var product_type = req.body.product_type;
    var shop = req.session.shop;
    models.productData.updateMany({
        "shop": shop,
        "kit_id": selected_kit_id,
        "product_id": product_id
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

//Deleting Products
router.post('/delete_products', function (req, res) {
    // console.log("/products/delete_products...");
    var product_array = req.body.product_array;
    var collection_array = req.body.collection_array;
    var selected_kit_id = req.body.selected_kit_id;
    models.productData.remove({
        kit_id: new ObjectID(selected_kit_id),
        product_id: {
            "$in": product_array
        }
    }, function (e, data) {
        models.productData.remove({
            kit_id: new ObjectID(selected_kit_id),
            collectionID: {
                "$in": collection_array
            }
        }, function (e, data1) {
            res.send({
                msg: 'Success'
            });
        });
    });
});


//load_product
router.get('/load_product', function (req, res, next) {
    console.log("/products/load_product...");
    var Shopify = new shopifyAPI({
        shop: req.query.shop,
        shopify_api_key: apiKey,
        access_token: req.query.access_token,
        verbose: false
    });
    Shopify.get('/admin/api/2020-04/products.json?limit=250?page=1', function (err, products, headers) {
        console.log("Products :==>", products.products);
        res.send({
            "products": products.products
        });
    });
});


//Get all color options in Backend
router.get('/get_colors', function (req, res, next) {
    console.log("/products/get_colors...");
    if (req.query.color_id) {
        models.colors.findOne({
            "shop": req.session.shop,
            "_id": new ObjectID(req.query.color_id)
        }, function (err, colors_data) {
            res.send(colors_data);
        });
    } else {
        models.colors.find({
            "shop": req.session.shop
        }, function (err, colors_data) {
            res.send(colors_data);
        });
    }

});

//save_colors for all products
router.get('/save_colors', function (req, res, next) {
    // console.log("/products/save_colors...");
    var Shopify = new shopifyAPI({
        shop: req.session.shop,
        shopify_api_key: apiKey,
        access_token: req.session.access_token,
        verbose: false
    });
    var color_records = [];
    var colors_array = [];
    var db_colors_array = [];
    var record;
    var color_name;
    var colors_hexcodes = [];
    var hex_code;
    Shopify.get('/admin/api/2020-04/products.json?limit=250', function (err, products, headers) {
        if (products) {
            models.colors.find({
                shop: req.session.shop
            }, function (err, data) {
                if (data && data.length > 0) {
                    data.forEach(function (color_item, index2) {
                        db_colors_array.push(color_item.color_name);
                    });
                }
                var product_data = products.products;
                product_data.forEach(function (item, index1) {
                    var options = item.options;
                    for (var i = 0, len = options.length; i < len; i++) {
                        if ((options[i].name).toLowerCase().indexOf("color") >= 0) {
                            for (var j = 0, len1 = options[i].values.length; j < len1; j++) {
                                if (colors_array.indexOf(options[i].values[j]) < 0) {
                                    colors_array.push(options[i].values[j]);
                                    hex_code = toHex(options[i].values[j]);
                                    color_name = options[i].values[j];
                                    if (hex_code != undefined) {
                                        record = {
                                            shop: req.session.shop,
                                            color_name: options[i].values[j],
                                            color_numbers: 1,
                                            colors_hexcodes: [hex_code]
                                        };
                                    } else {
                                        record = {
                                            shop: req.session.shop,
                                            color_name: options[i].values[j],
                                            color_numbers: 1,
                                            colors_hexcodes: ["#000000"]
                                        };
                                    }

                                    if (db_colors_array.indexOf(options[i].values[j]) < 0) {
                                        color_records.push(record);
                                    }


                                }
                            }
                        }
                    }
                });
                if (color_records.length > 0) {
                    models.colors.insertMany(color_records, function (err, response) {
                        if (!err) {
                            res.send("success");
                        }
                    });
                } else {
                    res.send("not_found");
                }
            });
        }
    });
});

//Update Color Swatch hexacodes
router.post('/update_color_swatch', function (req, res) {
    // console.log("/products/update_color_swatch...");
    var shop = req.session.shop;
    var color_id = req.body.color_id;
    var colors_hexcodes = req.body.colors_hexcodes;
    var color_numbers = req.body.color_numbers;
    models.colors.updateOne({
        "shop": shop,
        "_id": new ObjectID(color_id)
    }, {
        $set: {
            "colors_hexcodes": colors_hexcodes,
            "color_numbers": color_numbers
        }
    }, function (err, response) {
        if (!err) {
            res.send("success");
        }
    });
});

//Add to cart custom API
// router.post('/add_cart', function (req, res) {
//     console.log("/products/add_cart...");
//     var quantity = req.body.quantity;
//     var variant_id = req.body.id;
//     var param = {
//         "quantity": quantity,
//         "id": 15027801129009
//     };
//     request({
//             url: "https://daquini-store.myshopify.com/cart/add.js",
//             method: "POST",
//             headers: {
//                 'X-Shopify-Access-Token': '7b521026cccf6bdf2d814f5c7bb76e01',
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(JSON.stringify(param)),
//             },
//             body: JSON.stringify(param)
//         },
//         function (err, resp, body) {
//             if (!err) {
//                 res.send("success");
//             }
//         });
// });

module.exports = router;