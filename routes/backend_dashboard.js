var express = require('express');
var models = require('../models');
var router = express.Router();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;

//To show backend wizard to include category,products and discounts
router.get('/', function (req, res) {
    console.log('inside index route...');
    models.shopData.find({
        shop_domain: req.session.shop
    }, function (err, response) {
        console.log('response :', response);
        models.settings.find({
            shop: req.session.shop
        }, function (err, settingsData) {
            // console.log('object :', object);
            //res.json(response);
            console.log('rendering page...');
            res.render('daquini_backend_wizard', {
                "settings": settingsData,
                "shopData": response,
                "api_key": apiKey,
                "shop": req.session.shop,
                // "api_key": apiKey,
                // "shop": req.session.shop,
                "title": "Index Page - Jozi"
            });
        });
    });
});

//Savesettings
// router.post('/saveSettings', function (req, res) {
//     models.settings.findOne({
//         shop: req.session.shop
//     }, function (err, sdata) {
//         if (sdata) {
//             var message, pageTitleColor, priceTextColor,
//                 subMessage, kitTextColor, placeholderbgColor, placeholderTextColor,
//                 placeholderBorderColor,
//                 searchBoxColor,
//                 searchTextColor,
//                 pricedropDownColor,
//                 itemsBorderColor,
//                 scrollBarColor,
//                 buttonColor,
//                 zoomOption;
//             // console.log("sdata.message :", sdata.message);
//             if (req.body.message != "") {
//                 message = req.body.message;
//             } else {
//                 message = sdata.message;
//             }
//             // console.log("message :", message);

//             if (req.body.page_title_color != "") {
//                 pageTitleColor = req.body.page_title_color;
//             } else {
//                 pageTitleColor = sdata.pageTitleColor;
//             }
//             // console.log("pageTitleColor :", pageTitleColor);

//             if (req.body.price_text_color != "") {
//                 priceTextColor = req.body.price_text_color;
//             } else {
//                 priceTextColor = sdata.priceTextColor;
//             }
//             // console.log("priceTextColor :", priceTextColor);

//             if (req.body.submessage != "") {
//                 subMessage = req.body.submessage;
//             } else {
//                 subMessage = sdata.subMessage;
//             }
//             // console.log("subMessage :", subMessage);

//             if (req.body.message_text_color != "") {
//                 kitTextColor = req.body.message_text_color;
//             } else {
//                 kitTextColor = sdata.kitTextColor;
//             }
//             // console.log("kitTextColor :", kitTextColor);

//             if (req.body.placeholder_bg_color != "") {
//                 placeholderbgColor = req.body.placeholder_bg_color;
//             } else {
//                 placeholderbgColor = sdata.placeholderbgColor;
//             }
//             // console.log("placeholderbgColor :", placeholderbgColor);

//             if (req.body.placeholder_text_color != "") {
//                 placeholderTextColor = req.body.placeholder_text_color;
//             } else {
//                 placeholderTextColor = sdata.placeholderTextColor;
//             }
//             // console.log("placeholderTextColor :", placeholderTextColor);

//             if (req.body.placeholder_border_color != "") {
//                 placeholderBorderColor = req.body.placeholder_border_color;
//             } else {
//                 placeholderBorderColor = sdata.placeholderBorderColor;
//             }
//             // console.log("placeholderBorderColor :", placeholderBorderColor);

//             if (req.body.search_box_color != "") {
//                 searchBoxColor = req.body.search_box_color;
//             } else {
//                 searchBoxColor = sdata.searchBoxColor;
//             }
//             // console.log("searchBoxColor :", searchBoxColor);

//             if (req.body.search_text_color != "") {
//                 searchTextColor = req.body.search_text_color;
//             } else {
//                 searchTextColor = sdata.searchTextColor;
//             }
//             // console.log("searchTextColor :", searchTextColor);

//             if (req.body.price_drp_color != "") {
//                 pricedropDownColor = req.body.price_drp_color;
//             } else {
//                 pricedropDownColor = sdata.pricedropDownColor;
//             }
//             // console.log("pricedropDownColor :", pricedropDownColor);

//             if (req.body.items_border_color != "") {
//                 itemsBorderColor = req.body.items_border_color;
//             } else {
//                 itemsBorderColor = sdata.itemsBorderColor;
//             }
//             // console.log("itemsBorderColor :", itemsBorderColor);

//             if (req.body.scrollbar_color != "") {
//                 scrollBarColor = req.body.scrollbar_color;
//             } else {
//                 scrollBarColor = sdata.scrollBarColor;
//             }
//             // console.log("scrollBarColor :", scrollBarColor);

//             if (req.body.button_color != "") {
//                 buttonColor = req.body.button_color;
//             } else {
//                 buttonColor = sdata.buttonColor;
//             }
//             // console.log("buttonColor :", buttonColor);

//             if (req.body.enableZoomOption != "") {
//                 zoomOption = req.body.enableZoomOption;
//             } else {
//                 zoomOption = sdata.zoomOption;
//             }
//             // console.log("zoomOption :", zoomOption);


//             models.settings.updateOne({
//                 shop: req.session.shop
//             }, {
//                 message: message,
//                 pageTitleColor: pageTitleColor,
//                 priceTextColor: priceTextColor,
//                 subMessage: subMessage,
//                 kitTextColor: kitTextColor,
//                 placeholderbgColor: placeholderbgColor,
//                 placeholderTextColor: placeholderTextColor,
//                 placeholderBorderColor: placeholderBorderColor,
//                 searchBoxColor: searchBoxColor,
//                 searchTextColor: searchTextColor,
//                 pricedropDownColor: pricedropDownColor,
//                 itemsBorderColor: itemsBorderColor,
//                 scrollBarColor: scrollBarColor,
//                 buttonColor: buttonColor,
//                 zoomOption: zoomOption
//             }, function (e, data) {
//                 var msg = "Success";
//                 models.settings.findOne({
//                     shop: req.session.shop
//                 }, function (e, settingsData) {
//                     //  console.log('settings: ', settings);
//                     res.send(settingsData);
//                 });
//             });
//         }
//     });

// });

//Backend Dashboards instruction page
router.get('/instructions', function (req, res, next) {
    var shop = req.session.shop;
    if (shop) {
        var sh = shop.trim();
    }
    res.render('instructions', {
        title: 'Instructions',
        api_key: apiKey,
        shop: sh
    });
});

module.exports = router;