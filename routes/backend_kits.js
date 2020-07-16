var express = require('express');
var models = require('../models');
var router = express.Router();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
var ObjectID = require('mongodb').ObjectID;
var multer = require("multer");
var bodyParser = require('body-parser');
var randomstring = require("randomstring");
const fs = require('fs');
var path = require('path');
const ExportToCsv = require('export-to-csv').ExportToCsv;

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
        callback(null, "kit_" + randomstring.generate(12).toLowerCase() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
}).single('files');



//Listing Kits at Kits table
router.get('/', function (req, res, next) {
    shop = req.session.shop.split(".")[0];
    models.kits.find({
        shop: shop
    }, function (e, data) {
        res.send({
            kits: data
        });
    });
});


//Get style data to show on edit page
router.post("/get_kit", function (req, res) {
    var kit_id = new ObjectID(req.body.kit_id);
    models.kits.findOne({
        "_id": kit_id
    }, function (e, data) {
        res.send({
            "kit_data": data
        });
    });
});

//Uploading Style image File and data
router.post('/add_kit', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }

        var kit_data = JSON.parse(req.body.kit_data);
        var shop = kit_data.shop;
        var kit_name = kit_data.kit_name;
        var description = kit_data.kit_description;
        var show_name = kit_data.show_kit_name;
        var show_description = kit_data.show_kit_description;
        var show_filters = kit_data.kit_manage_filter;
        var styles = kit_data.selected_kit_styles;
        var kit_image = '';

        if (req.file) {
            kit_image = req.file.filename;
        }

        models.kits.findOne({
            "shop": shop,
            "kit_name": kit_name
        }, function (e, data) {
            if (!data) {
                var new_kit = new models.kits({
                    "shop": shop,
                    "kit_name": kit_name,
                    "description": description,
                    "show_name": show_name,
                    "show_description": show_description,
                    "show_filters": show_filters,
                    "styles": styles,
                    "image": kit_image,
                });
                new_kit.save(function (err, rec) {
                    if (err) {
                        res.send({
                            msg: 'error'
                        });
                    } else {
                        res.send({
                            msg: 'Success',
                            redirect: '/kits'
                        });
                    }
                });
            } else {
                var msg = "Kit already present, Please select different kit name.";
                res.send({
                    msg: msg
                });
            }
        });
    });
});


//Edit Kit and updated it into database
router.post('/edit_kit', function (req, res) {
    var style_image;
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }

        var kit_data = JSON.parse(req.body.kit_data);
        var shop = kit_data.shop;
        var kit_name = kit_data.kit_name;
        var kit_description = kit_data.kit_description;
        var add_kit_show_hide_name = kit_data.add_kit_show_hide_name;
        var add_kit_show_hide_description = kit_data.add_kit_show_hide_description;
        var add_style_manage_filter = kit_data.add_style_manage_filter;
        var selected_kit_styles = kit_data.selected_kit_styles;
        var kit_image;
        var kit_id = kit_data.kit_id;
        console.log('kit_id :', kit_id);
        models.kits.findOne({
            "_id": new ObjectID(kit_id)
        }, function (e, data) {
            if (data) {
                if (req.file != undefined) {
                    kit_image = req.file.filename;

                    //Remove existing file
                    const path = './uploads/' + data.image;
                    try {
                        fs.unlinkSync(path);
                    } catch (err) {
                        console.error(err)
                    }

                } else {
                    kit_image = data.image;
                }
                models.kits.updateOne({
                    "_id": new ObjectID(kit_id)
                }, {
                    "$set": {
                        "kit_name": kit_name,
                        "description": kit_description,
                        "show_name": add_kit_show_hide_name,
                        "show_description": add_kit_show_hide_description,
                        "show_filters": add_style_manage_filter,
                        "styles": selected_kit_styles,
                        "image": kit_image,
                    }
                }, function (e, data) {
                    if (e) {
                        res.send({
                            msg: 'error',
                        });
                    }
                    if (data) {
                        res.send({
                            msg: 'Success',
                            redirect: '/kits'
                        });
                    }
                });
            } else {
                res.send({
                    msg: 'not_found'
                });
            }
        });
    });
});

//Deleting Category from category table and database
router.post('/delete', function (req, res, next) {
    var kit_array = req.body.kit_array;
    var new_kit_array = [];
    for (var i = 0; i < kit_array.length; i++) {
        new_kit_array.push(new ObjectID(kit_array[i]));
    }
    models.kits.remove({
        _id: {
            "$in": new_kit_array
        }
    }, function (e, data) {
        res.send({
            msg: 'Success'
        });

    });
});

//Import all kits
router.post('/import', function (req, res, next) {
    var kits = JSON.parse(req.body.kits);
    var shop = req.body.shop;

    kits.forEach((element, idx, array) => {
        var id = element._id;
        var kit_name = element.kit_name;
        var description = element.description;
        var show_name = element.show_name;
        var show_description = element.show_description;
        var show_filters = element.show_filters;
        var style_image = element.image;
        var styles = element.styles;
        models.kits.findOne({
            "shop": shop,
            "kit_name": kit_name
        }, function (e, data) {
            if (!data) {
                var new_kit = new models.kits({
                    "_id": id,
                    "shop": shop,
                    "kit_name": kit_name,
                    "description": description,
                    "image": style_image,
                    "show_name": show_name,
                    "show_description": show_description,
                    "show_filters": show_filters,
                    "styles": styles
                });
                new_kit.save();
            }
        });
        if (idx === array.length - 1) {
            res.send({
                msg: 'Kits imported successfully.',
                redirect: '/kits'
            });
        }
    });
});


//Export all Kits
router.get('/export', function (req, res, next) {
    var shop = req.query.shop;
    if (fs.existsSync(path)) {
        fs.unlinkSync('public/exports/kitsExport.csv');
    }
    models.kits.find({
        shop: shop
    }, function (e, data) {
        var newData = [];
        data.forEach((element, idx, array) => {
            var params = {
                _id: element._id,
                shop: element.shop,
                kit_name: element.kit_name,
                description: element.description,
                image: element.image,
                show_name: element.show_name,
                show_description: element.show_description,
                show_filters: element.show_filters,
                styles: JSON.stringify(element.styles),
            };
            newData.push(params);
            if (idx === array.length - 1) {
                const options = {
                    fieldSeparator: ',',
                    quoteStrings: '"',
                    decimalSeparator: '.',
                    showLabels: false,
                    showTitle: false,
                    title: 'kitsExport',
                    useTextFile: false,
                    useBom: false,
                    useKeysAsHeaders: true,
                };

                const csvExporter = new ExportToCsv(options);
                const csvData = csvExporter.generateCsv(newData, true);
                fs.writeFileSync('public/exports/kitsExport.csv', csvData);
                res.send({
                    url: 'kitsExport.csv'
                });
            }
        });
    });
});

module.exports = router;