var express = require("express");
var models = require("../models");
var router = express.Router();
const shopifyAPI = require("shopify-node-api");
var config = require("../settings.json");
const apiKey = config.oauth.api_key;

//Pay now for recurring charges
router.get("/", function (req, res, next) {
    console.log("/pay_now");
    var Shopify = new shopifyAPI({
        shop: req.session.shop, // MYSHOP.myshopify.com
        shopify_api_key: apiKey, // Your API key
        access_token: req.session.access_token, // Your Shared Secret
        verbose: false
    });
    var post_data = {
        recurring_application_charge: {
            name: "Jozi application charge",
            price: 0,
            return_url: "http://" +
                req.session.shop +
                "/admin/apps/" +
                apiKey +
                "/pay_now/check_status",
            //   test: true
            // "trial_days": 7
        }
    };
    Shopify.post("/admin/recurring_application_charges.json", post_data, function (
        err,
        data,
        headers
    ) {
        if (data.recurring_application_charge) {
            //res.redirect(data.recurring_application_charge.confirmation_url);
            res.render("pay_now", {
                redirect_uri: data.recurring_application_charge.confirmation_url
            });
        }
    });
});

//Check the Customer Payment status
router.get("/check_status", function (req, res, next) {
    console.log("/pay_now/check_status");
    var charge_id = req.query.charge_id;
    var Shopify = new shopifyAPI({
        shop: req.session.shop, // MYSHOP.myshopify.com
        shopify_api_key: apiKey, // Your API key
        access_token: req.session.access_token, // Your Shared Secret
        verbose: false
    });

    Shopify.get(
        "/admin/recurring_application_charges/" + req.query.charge_id + ".json", {},
        function (err, data, headers) {
            if (data.recurring_application_charge) {
                if (
                    data.recurring_application_charge.status == "active" ||
                    data.recurring_application_charge.status == "accepted"
                ) {
                    Shopify.post(
                        "/admin/recurring_application_charges/" +
                        req.query.charge_id +
                        "/activate.json", {
                        data
                    },
                        function (err, cdata, headers) {
                            if (cdata.recurring_application_charge.price == 10) {
                                var plan = 1;
                            }
                            var shop = req.session.shop;
                            models.shopData.update({
                                shop_domain: shop
                            }, {
                                charge_id: charge_id,
                                subscription_type: plan,
                                subscription_start_date: new Date(),
                                subscription_end_date: new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000
                                ),
                                charge_status: "accepted"
                            },
                                function (e, sdata) {
                                    res.redirect("/");
                                }
                            );
                        }
                    );
                } else if (data.recurring_application_charge.status == "declined") {
                    var shop = req.session.shop;
                    models.shopData.update({
                        shop_domain: shop
                    }, {
                        charge_id: charge_id,
                        charge_status: "declined"
                    },
                        function (e, data) {
                            Shopify.delete(
                                "/admin/recurring_application_charges/" +
                                req.query.charge_id +
                                ".json", {
                                data
                            },
                                function (err, data, headers) {
                                    res.redirect("/pay_now");
                                }
                            );
                        }
                    );
                }
            }
        }
    );
});

//Verifying Payment
router.get("/verify_payment", function (req, res, next) {
    console.log("/pay_now/verify_payment");
    var charge_id = req.query.charge_id;
    var Shopify = new shopifyAPI({
        shop: req.query.shop, // MYSHOP.myshopify.com
        shopify_api_key: apiKey, // Your API key
        access_token: req.query.access_token, // Your Shared Secret
        verbose: false
    });
    Shopify.get(
        "/admin/recurring_application_charges/" + req.query.charge_id + ".json", {},
        function (err, data, headers) {
            if (data.recurring_application_charge) {
                if (data.recurring_application_charge.status == "active") {
                    Shopify.post(
                        "/admin/recurring_application_charges/" +
                        charge_id +
                        "/activate.json", {
                        data
                    },
                        function (err, cdata, headers) {
                            // if (cdata.recurring_application_charge.price == 10) {
                            //     var plan = 1;
                            // }
                            var shop = req.query.shop;
                            models.shopData.update({
                                shop_domain: shop
                            }, {
                                charge_id: charge_id,
                                subscription_start_date: new Date(),
                                subscription_end_date: new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000
                                ),
                                charge_status: "accepted"
                            },
                                function (e, sdata) {
                                    res.send("accepted");
                                }
                            );
                        }
                    );
                } else if (data.recurring_application_charge.status == "declined") {
                    var shop = req.query.shop;
                    models.shopData.update({
                        shop_domain: shop
                    }, {
                        charge_id: charge_id,
                        charge_status: "declined"
                    },
                        function (e, data) {
                            Shopify.delete(
                                "/admin/recurring_application_charges/" + charge_id + ".json", {
                                data
                            },
                                function (err, data, headers) {
                                    res.send("declined");
                                }
                            );
                        }
                    );
                }
            } else {
                res.send("declined");
            }
        }
    );
});

module.exports = router;