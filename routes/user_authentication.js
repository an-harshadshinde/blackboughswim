var express = require('express');
var models = require('../models');
var router = express.Router();
const nonce = require('nonce')();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
const apiSecret = config.oauth.client_secret;
const request = require('request-promise');
const forwardingAddress = "https://blackboughswim.applicationnexus.com";
const scopes = "read_products,write_products,read_script_tags,write_script_tags,read_themes,write_themes,read_price_rules,write_price_rules";
const cookie = require('cookie');
const querystring = require('querystring');
const crypto = require('crypto');
const shopifyAPI = require('shopify-node-api');

//Installing the url for the app
router.get('/', function (req, res, next) {
    const shop = req.query.shop;
    console.log("Inside shopify  app :" + shop);
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/user_authentication/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});


router.get('/callback', function (req, res, next) {
    console.log("inside callback...");
    const {
        shop,
        hmac,
        code,
        state
    } = req.query;
    console.log("Webhook creation...");
    if (shop && hmac && code) {
        //res.status(200).send('Callback route');
        // DONE: Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }
        if (hashEquals) {
            res.redirect('/user_authentication/get_access_token?shop=' + shop + '&code=' + code);
        }
    }
});


/* GET home page. */
router.get('/get_access_token', function (req, res, next) {
    console.log("Inside /get_access_token .." + req.query.shop);
    var shop_domain;
    var shop = req.query.shop;
    var code = req.query.code;
    req.session.shop = shop;
    const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
    };

    request.post(accessTokenRequestUrl, {
        json: accessTokenPayload
    }, function (err, resp, body) {
        access_token = body.access_token;
        req.session.access_token = access_token;
        req.session.shop = shop;

        req.session.save();
        var params = {
            'webhook': {
                'topic': 'app/uninstalled',
                'address': forwardingAddress + '/get_webhook/uninstall_shop',
                'format': 'json'
            }
        };
        var req_body = JSON.stringify(params);
        request({
            url: 'https://' + shop + '/admin/webhooks.json',
            method: "POST",
            headers: {
                //'X-Shopify-Topic': 'app/uninstalled',
                //'X-Shopify-Hmac-Sha256': generatedHash,
                //'X-Shopify-Shop-Domain': shop,
                'X-Shopify-Access-Token': access_token,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(req_body),
            },
            body: req_body
        },
            function (err, resp, body) {
                if (err) {
                    console.log("error is" + err);
                } else {
                    console.log("Webhook is created successfully");
                }

            });

        // var params = {
        //     'webhook': {
        //         'topic': 'shop/update',
        //         'address': forwardingAddress + '/get_webhook/shop/update',
        //         'format': 'json'
        //     }
        // };
        // var req_body = JSON.stringify(params);
        // request({
        //         url: 'https://' + shop + '/admin/webhooks.json',
        //         method: "POST",
        //         headers: {
        //             //'X-Shopify-Topic': 'app/uninstalled',
        //             //'X-Shopify-Hmac-Sha256': generatedHash,
        //             //'X-Shopify-Shop-Domain': shop,
        //             'X-Shopify-Access-Token': access_token,
        //             'Content-Type': 'application/json',
        //             'Content-Length': Buffer.byteLength(req_body),
        //         },
        //         body: req_body
        //     },
        //     function (err, resp, body) {
        //         if (err) {
        //             console.log("error is" + err);
        //         } else {
        //             console.log("Webhook is created successfully");
        //         }

        //     });

        //Create Webhook for customers/redact
        // var params_redact = {
        //     'webhook': {
        //         'topic': 'customers/redact',
        //         'address': forwardingAddress + '/webhook_uninstall/customer_redact_data',
        //         'format': 'json'
        //     }
        // };
        // var req_body_redact = JSON.stringify(params_redact);
        // request({
        //         url: 'https://' + shop + '/admin/webhooks.json',
        //         method: "POST",
        //         headers: {
        //             //'X-Shopify-Topic': 'app/uninstalled',
        //             //'X-Shopify-Hmac-Sha256': generatedHash,
        //             //'X-Shopify-Shop-Domain': shop,
        //             'X-Shopify-Access-Token': access_token,
        //             'Content-Type': 'application/json',
        //             'Content-Length': Buffer.byteLength(req_body_redact),
        //         },
        //         body: req_body_redact
        //     },
        //     function (err, resp, body) {
        //         if (err) {
        //             console.log("error is" + err);
        //         } else {
        //             console.log("customers/redact Webhook is created successfully");
        //         }

        //     });

        //Create Webhook for shop/redact
        var Shopify = new shopifyAPI({
            shop: shop,
            shopify_api_key: apiKey,
            access_token: access_token,
            verbose: false
        });
        Shopify.get('/admin/api/2020-04/shop.json', function (err, shopDetails, headers) {
            //res.send(data);
            var currencySymbol = '';
            if (shopDetails) {
                if (shopDetails.shop.money_format) {
                    currencySymbol = shopDetails.shop.money_format.split("{{");
                    currencySymbol = currencySymbol[0];
                    shop_domain = shopDetails.shop.myshopify_domain;
                    var new_shop = new models.shopData({
                        "shop_id": shopDetails.shop.id,
                        "shop": shopDetails.shop.name,
                        "shop_domain": shopDetails.shop.myshopify_domain,
                        "email": shopDetails.shop.email,
                        "access_token": access_token,
                        "currencySymbol": currencySymbol,
                        "status": "installed"
                    });
                    models.shopData.findOne({
                        "shop": shopDetails.shop.name
                    }, function (e, shopd) {
                        if (!shopd || shopd == null) {
                            new_shop.save(function (err, rec) {
                                if (err) {
                                    console.log('error saving shop..');
                                } else {
                                    console.log('shop successfully saved.');

                                }

                            });

                        } else {
                            models.shopData.updateOne({
                                "shop_domain": shop_domain
                            }, {
                                "$set": {
                                    "access_token": access_token,
                                    "currencySymbol": currencySymbol
                                }
                            }, function (err, response) {
                                if (err) {
                                    console.log('error saving shop..');
                                } else {
                                    console.log('shop updated successfully.', currencySymbol);

                                }
                            });
                        }
                        var new_settings = new models.settings({
                            "shop": req.query.shop,
                            message: "Mix & Match Your Perfect Outfit",
                            pageTitleColor: '#000000',
                            themeFontColor: '#2a2a30',
                            themeBgColor: '#f2f2f2',
                            priceTextColor: "#ff1744",
                            subMessage: "Click items to start with",
                            messageTextColor: "#aaaaaa",
                            placeholderbgColor: "#ececec",
                            placeholderTextColor: "#aaaaaa",
                            placeholderBorderColor: "#aaaaaa",
                            searchBoxColor: "#ececec",
                            searchTextColor: "#373737",
                            pricedropDownColor: "#ececec",
                            itemsBorderColor: "#aaaaaa",
                            scrollBarColor: "#12e6b6",
                            buttonColor: "#000000",
                            zoomOption: "yes",
                            placeholderdetailsBackColor: "#aaaaaa",
                            placeholderbuyBtnBgColor: "#aaaaaa",
                            placeholderbuyBtnTextColor: "#aaaaaa",
                            placeholderbuyButtonText: "",
                            builder_header_text: 'Mix & Match your bikini',
                            builder_description_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur sagittis purus elementum interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                            placeholderPriceTextColor: '#494949',
                            placeholderPriceTextDesktopSize: '20',
                            placeholderPriceTextMobileSize: '14'
                        });
                        models.settings.findOne({
                            "shop": shop
                        }, function (e, data) {
                            if (!data || data == null) {
                                new_settings.save(function (err, rec) {
                                    if (err) {
                                        console.log('error saving settings...');
                                    } else {
                                        // res.redirect('/pay_now');
                                        res.redirect('/');
                                    }
                                });
                            } else {
                                // res.redirect('/pay_now');
                                res.redirect('/');
                            }
                        });


                    });

                }
            }
        });
    });
});
module.exports = router;