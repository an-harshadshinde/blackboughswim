/*
	Author : Application Nexus
	Project : Daquini Shopify App
  Purpose : To develop Jozi Shopify app mix and matching tops and bottoms
*/

//Initializing all constants
var express = require("express");
var app = express();
var logger = require("morgan");
var request = require("request-promise");
var config = require("./settings.json");
var cors = require('cors');
var bodyParser = require("body-parser");
var session = require("express-session");
var path = require("path");
var models = require("./models");
var fs = require("fs");
var https = require("https");
var http = require("http");
var debug = require("debug")("jozi-app:server");
var cookieParser = require("cookie-parser");
const shopifyAPI = require('shopify-node-api');

var forwardingAddress = config.app_url;
var apiKey = config.oauth.api_key;
var access_token = "";

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});


//CORS middleware
// var allowCrossDomain = function (req, res, next) {
//   var oneof = false;
//   if (req.headers.origin) {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     oneof = true;
//   }
//   if (req.headers["access-control-request-method"]) {
//     res.header(
//       "Access-Control-Allow-Methods",
//       req.headers["access-control-request-method"]
//     );
//     oneof = true;
//   }
//   if (req.headers["access-control-request-headers"]) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       req.headers["access-control-request-headers"]
//     );
//     oneof = true;
//   }
//   if (oneof) {
//     res.header("Access-Control-Max-Age", 60 * 60 * 24 * 365);
//   }
//   // intercept OPTIONS method
//   if (oneof && req.method == "OPTIONS") {
//     res.send(200);
//   } else {
//     next();
//   }
// };
// app.use(allowCrossDomain);

// load the cookie-parsing middleware
app.use(cookieParser());

//Include folders
app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.bodyParser({
//   uploadDir: './uploads'
// }));

//Initializing ejs views
app.set("view engine", "ejs");
app.set("views", "./views");

//create Session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Logger
app.use(logger("dev"));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//Route Declaration Start
var user_authentication = require("./routes/user_authentication");
var payment = require("./routes/pay_now");
var categories_data = require("./routes/frontend_categories");
var backend_dashboard = require("./routes/backend_dashboard");
var kits = require("./routes/backend_kits");
var styles = require("./routes/backend_styles");
var backend_products = require("./routes/backend_products");
var collections = require("./routes/backend_collections");
var settings_router = require("./routes/backend_settings");
var discount_router = require("./routes/backend_discounts");
var get_webhook = require("./routes/get_webhook");
//Route Declaration End

//Route Start
app.use("/user_authentication", user_authentication);
app.use("/pay_now", payment);
app.use("/kits", kits);
app.use("/styles", styles);
app.use("/products", backend_products);
app.use("/collections", collections);
app.use("/get_webhook/", get_webhook);
app.use("/category", categories_data);
app.use("/settings", settings_router);
app.use("/discounts", discount_router);

//Route End
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

//Installing Shopify app
app.use(function (req, res, next) {
  console.log('req.query :', req.query);
  console.log('req.body :', req.body);

  console.log("inside app use..." + req.query.shop);
  console.log('forwardingAddress :', forwardingAddress);
  var shop = "";
  if (req.query.path_prefix) {
    res.header("Content-Type", 'application/liquid');
    var shop = req.query.shop.split('.');

    if (shop) {
      shop = shop[0];
    }

    models.shopData.findOne({
      shop: shop
    }, function (err, shopdata) {
      if ((shopdata) && (shopdata.access_token != "")) {
        var currencySymbol = shopdata["currencySymbol"];
        var Shopify = new shopifyAPI({
          shop: req.query.shop,
          shopify_api_key: config.oauth.api_key,
          access_token: shopdata.access_token
        });

        models.styles.find({
          shop: shop
        }, function (e, styles) {
          models.kits.find({
            shop: shop
          }, function (e, kits) {
            models.settings.find({
              shop: req.query.shop
            }, function (e, settings) {
              if (settings) {
                settings = settings[0];
              }
              Shopify.get('/admin/api/2020-04/shop.json', function (err, shopInfo, headers) {
                Shopify.get('/admin/api/2020-04/smart_collections.json?limit=250', function (err, collections, headers) {
                  collections = collections.smart_collections;
                  Shopify.get('/admin/api/2020-04/products/count.json', function (err, count, headers) {
                    count = count.count;
                    var totalPages = Math.ceil(count / 250);
                    var totalProducts = [];
                    var i = 1;
                    var link = '';

                    function loadNextProducts() {
                      Shopify.get('/admin/api/2020-04/products.json?limit=250&page_info=' + link, function (err, products, headers) {
                        if (headers.link) {
                          link = headers.link.split('page_info=')[1].split('>;')[0]
                        }
                        products = products.products;
                        // totalProducts.push(...products);
                        if (products.length > 0) {
                          products.forEach((product, idx, array) => {
                            var prod_id = product.id;
                            var file_url = './uploads/product_' + prod_id + '.png';
                            if (fs.existsSync(file_url)) {
                              product.builderImage = 'product_' + prod_id + '.png';
                            } else {
                              product.builderImage = '';
                            }

                            totalProducts.push(product);
                            if (idx === array.length - 1) {
                              if (i == totalPages) {
                                res.render('frontend-owl', {
                                  title: 'builder',
                                  api_key: config.oauth.api_key,
                                  shop: shop[0],
                                  remote_url: "https://blackboughswim.applicationnexus.com",
                                  shopdata: shopdata,
                                  currencySymbol: currencySymbol,
                                  settings: settings,
                                  kits: kits,
                                  styles: styles,
                                  collections: collections,
                                  products: totalProducts,
                                  shopInfo: shopInfo
                                });
                              } else {
                                i++;
                              }
                            }
                          });
                        } else {
                          res.render('frontend-owl', {
                            title: 'builder',
                            api_key: config.oauth.api_key,
                            shop: shop[0],
                            remote_url: "https://blackboughswim.applicationnexus.com",
                            shopdata: shopdata,
                            currencySymbol: currencySymbol,
                            settings: settings,
                            kits: kits,
                            styles: styles,
                            collections: collections,
                            products: totalProducts,
                            shopInfo: shopInfo
                          });
                        }
                      });
                    }

                    Shopify.get('/admin/api/2020-04/products.json?limit=250', function (err, products, headers) {
                      if (headers.link) {
                        link = headers.link.split('page_info=')[1].split('>;')[0]
                      }
                      products = products.products;
                      // totalProducts.push(...products);
                      if (products.length > 0) {
                        products.forEach((product, idx, array) => {
                          var prod_id = product.id;
                          var file_url = './uploads/product_' + prod_id + '.png';
                          if (fs.existsSync(file_url)) {
                            product.builderImage = 'product_' + prod_id + '.png';
                          } else {
                            product.builderImage = '';
                          }

                          totalProducts.push(product);
                          if (idx === array.length - 1) {
                            if (i < totalPages) {
                              i++;
                              loadNextProducts();
                            } else {
                              res.render('frontend-owl', {
                                title: 'builder',
                                api_key: config.oauth.api_key,
                                shop: shop[0],
                                remote_url: "https://blackboughswim.applicationnexus.com",
                                shopdata: shopdata,
                                currencySymbol: currencySymbol,
                                settings: settings,
                                kits: kits,
                                styles: styles,
                                collections: collections,
                                products: totalProducts,
                                shopInfo: shopInfo
                              });
                            }
                          }
                        });
                      } else {
                        res.render('frontend-owl', {
                          title: 'builder',
                          api_key: config.oauth.api_key,
                          shop: shop[0],
                          remote_url: "https://blackboughswim.applicationnexus.com",
                          shopdata: shopdata,
                          currencySymbol: currencySymbol,
                          settings: settings,
                          kits: kits,
                          styles: styles,
                          collections: collections,
                          products: totalProducts,
                          shopInfo: shopInfo
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        }).sort({
          style_type: -1,
          style_order: -1
        });
      } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    });

  } else {
    if (!req.session.shop && !req.session.access_token) {
      if (req.query.shop) {
        console.log('1........');
        // if (!req.session.shop) {
        req.session.shop = req.query.shop;
        // }
        var shop = req.query.shop.split(".")[0];
        var shop1 = req.query.shop;
        models.shopData.findOne({
          shop_domain: shop1
        },
          function (e, data) {
            if (!data) {
              res.render("embedded_app_redirect", {
                shop: shop1,
                api_key: apiKey,
                scope: config.oauth.scope,
                redirect_uri: forwardingAddress + "user_authentication/callback"
              });
            } else {
              if (!req.session.shop) {
                req.session.shop = data.shop_domain;
              }
              if (!req.session.access_token) {
                req.session.access_token = data.access_token;
              } else {
                var Shopify = new shopifyAPI({
                  shop: shop1,
                  shopify_api_key: apiKey,
                  access_token: req.session.access_token
                });
                Shopify.get('/admin/api/2020-04/shop.json', function (err, shopsDetails, headers) {
                  //res.send(data);
                  var currencySymbol = '';
                  if (shopsDetails) {
                    if (shopsDetails.shop.money_format) {
                      currencySymbol = shopsDetails.shop.money_format.split("{{");
                      currencySymbol = currencySymbol[0];
                    }
                  }
                  var new_shop = shopsDetails.myshopify_domain.split('.')[0];
                  if (shop1) {
                    new_shop = shop1.split('.')[0];
                  }
                  models.shopData.updateOne({
                    shop_domain: shop1
                  }, {
                    $set: {
                      shop: new_shop,
                      access_token: req.session.access_token,
                      currencySymbol: currencySymbol
                    }
                  },
                    function (err, response) {
                      if (err) {
                        console.log("error saving shop..");
                      } else {
                        console.log("shop updated successfully.", currencySymbol);
                      }
                    }
                  );
                });
              }
              var shop_name1;

              // if (data.charge_status == "accepted") {
              //   var params = {
              //     shop: req.session.shop,
              //     access_token: req.session.access_token,
              //     charge_id: data.charge_id
              //   };
              //   var req_body = JSON.stringify(params);
              //   // request({
              //   //     url: "/pay_now/verify_payment?charge_id=" +
              //   //       data.charge_id +
              //   //       "&shop=" +
              //   //       req.session.shop +
              //   //       "&access_token=" +
              //   //       req.session.access_token,
              //   //     method: "GET"
              //   //   },
              //   //   function (err, resp, body) {
              //   //     if (err) {
              //   //       console.log("error is" + err);
              //   //     } else {
              //   //       console.log("charge_status :" + body);
              //   //       if (body == "accepted") {
              //   //         next();
              //   //       } else {
              //   //         res.redirect("/pay_now");
              //   //       }
              //   //     }
              //   //   }
              //   // );
              //   next();
              // } else {
              //   res.render("embedded_app_redirect", {
              //     shop: shop1,
              //     api_key: apiKey,
              //     scope: config.oauth.scope,
              //     redirect_uri: forwardingAddress + "user_authentication/callback"
              //   });
              // }
              next();
            }
          }
        );
      } else {
        next();
      }
    } else {
      var shop;
      // if (req.session.shop) {
      shop = req.session.shop || req.query.shop;
      // } else {
      //   shop = req.query.shop;
      // }
      console.log('2........', shop);
      req.session.shop = shop;
      console.log('req.session.shop :', req.session.shop);
      models.shopData.findOne({
        shop_domain: shop
      },
        function (e, data) {
          if (data) {
            if (!req.session.shop) {
              req.session.shop = data.shop_domain;
            }
            if (!req.session.access_token) {
              req.session.access_token = data.access_token;
            } else {
              var Shopify = new shopifyAPI({
                shop: shop,
                shopify_api_key: apiKey,
                access_token: req.session.access_token
              });
              Shopify.get('/admin/api/2020-04/shop.json', function (err, shopsDetails, headers) {
                //res.send(data);
                var currencySymbol = '';
                if (shopsDetails) {
                  if (shopsDetails.shop.money_format) {
                    currencySymbol = shopsDetails.shop.money_format.split("{{");

                    currencySymbol = currencySymbol[0];
                  }
                }
                var new_shop = shopsDetails.shop.myshopify_domain.split('.')[0];
                if (shop) {
                  new_shop = shop.split('.')[0];
                }
                models.shopData.updateOne({
                  shop_domain: shop
                }, {
                  $set: {
                    shop: new_shop,
                    access_token: req.session.access_token,
                    currencySymbol: currencySymbol
                  }
                },
                  function (err, response) {
                    if (err) {
                      console.log("error saving shop..");
                    } else {
                      console.log("shop updated successfully.", currencySymbol);
                    }
                  }
                );
              });
            }

            // if (data.charge_status == "accepted") {
            //   var params = {
            //     shop: req.session.shop,
            //     access_token: req.session.access_token,
            //     charge_id: data.charge_id
            //   };
            //   // request({
            //   //     url: forwardingAddress + "/pay_now/verify_payment?charge_id=" +
            //   //       data.charge_id +
            //   //       "&shop=" +
            //   //       req.session.shop +
            //   //       "&access_token=" +
            //   //       req.session.access_token,
            //   //     method: "GET"
            //   //   },
            //   //   function (err, resp, body) {
            //   //     if (err) {
            //   //       console.log("error is" + err);
            //   //     } else {
            //   //       // var body1 = JSON.stringify(body);
            //   //       if (body == "accepted") {
            //   //         next();
            //   //       } else {
            //   //         res.redirect("/pay_now");
            //   //       }
            //   //     }
            //   //   }
            //   // );
            //   next();
            // } else {
            //   res.render("embedded_app_redirect", {
            //     shop: shop,
            //     api_key: apiKey,
            //     scope: config.oauth.scope,
            //     redirect_uri: forwardingAddress + "user_authentication/callback"
            //   });
            // }
            next();
          } else {
            if (!req.session.shop) {
              req.session.shop = req.query.shop;
            }

            // res.render("embedded_app_redirect", {
            //   shop: shop,
            //   api_key: apiKey,
            //   scope: config.oauth.scope,
            //   redirect_uri: forwardingAddress + "user_authentication/callback"
            // });
            next();
          }
        }
      );
    }
  }
});

//Showing backend wizard
app.use("/", backend_dashboard);

//Server connections
/*
var options = {
  hostname: '127.0.0.1',
  key: fs.readFileSync('/home/daquini/webroot/certs/privkey.pem'),
  cert: fs.readFileSync('/home/daquini/webroot/certs/fullchain.pem')
};
app.set('port', process.env.PORT || 6548);
var server = https.createServer(options, app).listen(app.get('port'), function () {
  console.log('Express server listening on port = ' + app.get('port'));
});
*/
// module.exports = app;

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || "7658");
app.set("port", port);
var options = {
  hostname: '127.0.0.1',
  key: fs.readFileSync('/home/blackboughswim/webroot//blackboughswim//certs/privkey.pem'),
  cert: fs.readFileSync('/home/blackboughswim/webroot//blackboughswim//certs/fullchain.pem')
};
var server = https.createServer(options, app);


// Local server configuration.

// var port = normalizePort(process.env.PORT || "3000");
// app.set("port", port);
//Create HTTP server.
// var server = http.createServer(app);



// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

//Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
console.log("inside app.js.....");

module.exports = app;