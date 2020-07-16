var express = require('express');
var models = require('../models');
var router = express.Router();
var config = require('../settings.json');
const apiKey = config.oauth.api_key;
var ObjectID = require('mongodb').ObjectID;
var multer = require("multer");
var bodyParser = require('body-parser');
var randomstring = require("randomstring");
const fs = require('fs')
var path = require('path')
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
    callback(null, "style_" + randomstring.generate(12).toLowerCase() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage
}).single('files');



//Listing Styles at Styles table
router.get('/', function (req, res, next) {
  shop = req.session.shop.split(".")[0];
  models.styles.find({
    shop: shop
  }, function (e, data) {
    res.send({
      styles: data
    });
  }).sort({
    style_type: -1,
    style_order: -1
  });
});

//Get style data to show on edit page
router.post("/get_style", function (req, res) {
  var style_id = new ObjectID(req.body.style_id);
  models.styles.findOne({
    "_id": style_id
  }, function (e, data) {
    res.send({
      "style_data": data
    });
  });
});

//Uploading Style image File and data
router.post('/add_style', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong!");
    }

    var style_data = JSON.parse(req.body.style_data);
    var shop = style_data.shop;
    var style_name = style_data.style_name;
    var style_order = style_data.style_order;
    var style_enabled = style_data.style_enable;
    var type = style_data.type;
    var selected_top_collection = style_data.selected_style_collections.top_collections;
    var selected_bottom_collection = style_data.selected_style_collections.bottom_collections;
    var style_image = '';
    if (req.file) {
      style_image = req.file.filename;
    }
    models.styles.findOne({
      "shop": shop,
      "style_name": style_name
    }, function (e, data) {
      if (!data) {
        models.styles.findOne({
          "shop": shop,
          "type": type,
          "style_order": style_order
        }, function (e, data) {
          if (!data) {
            var new_style = new models.styles({
              "shop": shop,
              "style_name": style_name,
              "style_order": style_order,
              "is_enabled": style_enabled,
              "type": type,
              "image": style_image,
              "top_collections": selected_top_collection,
              "bottom_collections": selected_bottom_collection,
            });
            new_style.save(function (err, rec) {
              if (err) {
                res.send({
                  msg: 'error'
                });
              } else {
                res.send({
                  msg: 'Success',
                  redirect: '/styles'
                });
              }
            });
          } else {
            var msg = "Please select different style order.";
            res.send({
              msg: msg
            });
          }
        });
      } else {
        var msg = "Style already present, Please select different style name.";
        res.send({
          msg: msg
        });
      }
    });
  });
});

//Edit styles
router.post('/edit_style', function (req, res) {
  var style_image;
  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong!");
    }

    var style_data = JSON.parse(req.body.style_data);
    var shop = style_data.shop;
    var style_name = style_data.style_name;
    var style_order = style_data.style_order;
    var style_enabled = style_data.style_enable;
    var type = style_data.type;
    var selected_top_collection = style_data.selected_style_collections.top_collections;
    var selected_bottom_collection = style_data.selected_style_collections.bottom_collections;
    var style_image;
    var style_id = style_data.style_id;
    var is_overwrite = style_data.is_overwrite;

    models.styles.findOne({
      "shop": shop,
      "style_name": style_name,
      "_id": {
        $ne: new ObjectID(style_id)
      },
    }, function (e, data) {
      if (!data) {
        models.styles.findOne({
          "_id": new ObjectID(style_id)
        }, function (e, data) {
          if (data) {
            if (req.file != undefined) {
              style_image = req.file.filename;

              //Remove existing file
              const path = './uploads/' + data.image;
              try {
                fs.unlinkSync(path);
              } catch (err) {
                console.error(err)
              }

            } else {
              style_image = data.image;
            }
            models.styles.findOne({
              "shop": shop,
              "style_name": {
                $ne: style_name,
              },
              "type": type,
              "style_order": style_order
            }, function (e, data) {
              if (!data) {
                models.styles.updateOne({
                  "_id": new ObjectID(style_id)
                }, {
                  "$set": {
                    "style_name": style_name,
                    "style_order": style_order,
                    "is_enabled": style_enabled,
                    "type": type,
                    "image": style_image,
                    "top_collections": selected_top_collection,
                    "bottom_collections": selected_bottom_collection
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
                      redirect: '/styles'
                    });
                  }
                });
              } else {
                if (is_overwrite == 0) {
                  res.send({
                    msg: 'Please select different order.'
                  });
                } else {
                  models.styles.updateOne({
                    "_id": new ObjectID(style_id)
                  }, {
                    "$set": {
                      "style_name": style_name,
                      "style_order": style_order,
                      "is_enabled": style_enabled,
                      "type": type,
                      "image": style_image,
                      "top_collections": selected_top_collection,
                      "bottom_collections": selected_bottom_collection
                    }
                  }, function (e, data) {
                    if (e) {
                      res.send({
                        msg: 'error',
                      });
                    }
                    if (data) {
                      overwriteOtherStyles();
                    }
                  });

                  var newOrder = parseInt(style_order) + 1;

                  function overwriteOtherStyles() {
                    models.styles.findOne({
                      "style_name": {
                        $ne: style_name,
                      },
                      "shop": shop,
                      "style_order": style_order,
                      "type": type,
                    }, function (e, data) {
                      if (data) {
                        var id = data._id;

                        models.styles.updateOne({
                          "_id": new ObjectID(id)
                        }, {
                          "$set": {
                            // "style_order": newOrder,
                            "style_order": "",
                          }
                        }, function (e, data) {
                          if (e) {
                            res.send({
                              msg: 'error',
                            });
                          }
                          if (data) {
                            newOrder++;
                            overwriteOtherStyles();
                          }
                        });
                      } else {
                        res.send({
                          msg: 'Success',
                          redirect: '/styles'
                        });
                      }
                    });
                  }
                }
              }
            });
          } else {
            res.send({
              msg: 'not_found'
            });
          }
        });
      } else {
        var msg = "Style already present, Please select different style name.";
        res.send({
          msg: msg
        });
      }
    });
  });
});

//Deleting Category from category table and database
router.post('/delete', function (req, res, next) {
  var style_array = req.body.style_array;
  var new_style_array = [];
  for (var i = 0; i < style_array.length; i++) {
    new_style_array.push(new ObjectID(style_array[i]));
  }
  models.styles.remove({
    _id: {
      "$in": new_style_array
    }
  }, function (e, data) {
    res.send({
      msg: 'Success'
    });

  });
});

//Import all Styles
router.post('/import', function (req, res, next) {
  var styles = JSON.parse(req.body.styles);
  var shop = req.body.shop;

  styles.forEach((element, idx, array) => {
    var id = element._id;
    var style_name = element.style_name;
    var style_enabled = element.style_enable;
    var type = element.type;
    var selected_top_collection = element.top_collections;
    var selected_bottom_collection = element.bottom_collections;
    var style_image = element.image;
    models.styles.findOne({
      "shop": shop,
      "style_name": style_name
    }, function (e, data) {
      if (!data) {
        var new_style = new models.styles({
          "_id": id,
          "shop": shop,
          "style_name": style_name,
          "is_enabled": style_enabled,
          "type": type,
          "image": style_image,
          "top_collections": selected_top_collection,
          "bottom_collections": selected_bottom_collection,
        });
        new_style.save();
      }
    });
    if (idx === array.length - 1) {
      res.send({
        msg: 'Styles imported successfully.',
        redirect: '/styles'
      });
    }
  });
});


//Export all Styles
router.get('/export', function (req, res, next) {
  var shop = req.query.shop;
  if (fs.existsSync(path)) {
    fs.unlinkSync('public/exports/stylesExport.csv');
  }
  models.styles.find({
    shop: shop
  }, function (e, data) {
    var newData = [];
    data.forEach((element, idx, array) => {
      var params = {
        _id: element._id,
        shop: element.shop,
        style_name: element.style_name,
        is_enabled: element.is_enabled,
        image: element.image,
        top_collections: JSON.stringify(element.top_collections),
        bottom_collections: JSON.stringify(element.bottom_collections),
        type: element.type
      };
      newData.push(params);
      if (idx === array.length - 1) {
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: false,
          showTitle: false,
          title: 'stylesExport',
          useTextFile: false,
          useBom: false,
          useKeysAsHeaders: true,
        };

        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(newData, true);
        fs.writeFileSync('public/exports/stylesExport.csv', csvData);
        res.send({
          url: 'stylesExport.csv'
        });
      }
    });
  });
});

module.exports = router;