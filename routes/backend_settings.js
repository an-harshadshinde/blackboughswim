var express = require('express');
var models = require('../models');
var router = express.Router();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
const shopifyAPI = require('shopify-node-api');
var ObjectID = require('mongodb').ObjectID;
var toHex = require('colornames');
var ObjectID = require('mongodb').ObjectID;
var multer = require("multer");
var bodyParser = require('body-parser');
var randomstring = require("randomstring");
const fs = require('fs');
var path = require('path');

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

        if (file.fieldname == 'top_files') {
            fs.exists('/uploads/placeholder_top_image.png', function (exists) {
                if (exists) {
                    fs.unlink('/uploads/placeholder_top_image.png');
                    callback(null, "placeholder_top_image" + path.extname(file.originalname));
                } else {
                    callback(null, "placeholder_top_image" + path.extname(file.originalname));
                }
            });
        } else {
            fs.exists('/uploads/placeholder_bottom_image.png', function (exists) {
                if (exists) {
                    fs.unlink('/uploads/placeholder_bottom_image.png');
                    callback(null, "placeholder_bottom_image" + path.extname(file.originalname));
                } else {
                    callback(null, "placeholder_bottom_image" + path.extname(file.originalname));
                }
            });
        }

    }
});

var upload = multer({
    storage: storage
}).fields([{
    name: 'top_files',
    maxCount: 1
}, {
    name: 'bottom_files',
    maxCount: 1
}]);



//Save settings into database
router.post('/save_settings', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log('err :', err);
            return res.end("Something went wrong!" + err);
        }
        console.log('req.body :', req.body);
        // return;
        var top_files = req.body.top_files;
        var bottom_files = req.body.bottom_files;

        var top_image = 'placeholder_top_image.png';
        var bottom_image = 'placeholder_bottom_image.png';

        // if (req.body.top_files && top_files == 'undefined') {
        //     top_image = '';
        // }

        // if (req.body.top_files && bottom_files == 'undefined') {
        //     bottom_image = '';
        // }



        var settingsData = JSON.parse(req.body.settings_data);
        var update_data = {
            "placeholderbgColor": settingsData.placeholder_bg_color,
            "placeholderTextColor": settingsData.placeholder_text_color,
            "topText": settingsData.top_text,
            "bottomText": settingsData.bottom_text,
            "placeholderdetailsBackColor": settingsData.placeholder_details_back_color,
            "placeholderbuyBtnBgColor": settingsData.placeholder_buy_btn_bg_color,
            "placeholderbuyBtnSecBgColor": settingsData.placeholder_buy_btn_bg_sec_color,
            "placeholderbuyBtnTextColor": settingsData.placeholder_buy_btn_text_color,
            "placeholderbuyButtonText": settingsData.buy_button_text,
            "placeholderBuilderHeaderText": settingsData.builder_header_text,
            "placeholderBuilderDescriptionText": settingsData.builder_description_text,
            "placeholderPriceTextColor": settingsData.placeholder_price_text_color,
            "placeholderPriceTextDesktopSize": settingsData.placeholder_price_text_desktop_size,
            "placeholderPriceTextMobileSize": settingsData.placeholder_price_text_mobile_size,
            "placeholderTopImage": top_image,
            "placeholderBottomImage": bottom_image,
            "placeholderBuilderTopText": settingsData.builder_placeholder_top_text,
            "placeholderBuilderBottomText": settingsData.builder_placeholder_bottom_text,
            "placeholderBuilderDiscountType": settingsData.builder_placeholder_discount_type,
            "placeholderBuilderDiscountValue": settingsData.builder_placeholder_discount_value
        };
        models.settings.updateOne({
            "shop": req.session.shop
        }, {
            "$set": update_data
        }, function (err, response) {
            if (!err) {
                models.settings.findOne({
                    shop: req.session.shop
                }, function (e, settingsData) {
                    //  console.log('settings: ', settings);
                    res.send(settingsData);
                });
            }
        });
    });
});

module.exports = router;