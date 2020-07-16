var mongoose = require('mongoose');
var Schema = mongoose.Schema;
exports.ObjectId = Schema.Types.ObjectId;

//Shop Schema this will be used to store all the stores who installed this app information
var shopSchema = new Schema({
    shop_id: String,
    shop: String,
    shop_domain: String,
    access_token: String,
    currencySymbol: String,
    signature: String,
    subscription_type: String,
    subscription_start_date: String,
    subscription_end_date: String,
    charge_id: String,
    charge_status: String,
    email: String,
    status: String
});
exports.shopData = mongoose.model('Shops', shopSchema);

//Categories Schema this will be used to store all the categories user created.
var kitsSchema = new Schema({
    shop: String,
    kit_name: String,
    description: String,
    image: String,
    show_name: String,
    show_description: String,
    show_filters: Boolean,
    styles: [String]
});
exports.kits = mongoose.model('Kits', kitsSchema);

//Styles Schema this will be used to store all the styles user created.
var stylesSchema = new Schema({
    shop: String,
    id: Object,
    style_name: String,
    style_order: String,
    is_enabled: Boolean,
    type: String,
    image: String,
    top_collections: [{
        collection_id: Number,
        selected_all_products: Boolean,
        selected_products: [Number]
    }],
    bottom_collections: [{
        collection_id: Number,
        selected_all_products: Boolean,
        selected_products: [Number]
    }]
});
exports.styles = mongoose.model('Styles', stylesSchema);

//Products Schema this will be used to store all the products user created.
// var productsSchema = new Schema({
//     product_type: String,
//     product_name: String,
//     product_price: Number,
//     img: String,
//     kit: String,
//     product_id: String,
//     collectionID: String,
//     variantId: String,
//     shop: String,
//     kit_id: Object
// });


var productsSchema = new Schema({
    id: Object,
    shop: String,
    product_id: String,
    product_name: String,
    product_price: Number,
    img: String,
});
exports.productData = mongoose.model('Products', productsSchema);

//Settings
var settingsSchema = new Schema({
    shop: String,
    topText: String,
    bottomText: String,
    placeholderbgColor: String,
    placeholderTextColor: String,
    selected_arrow: String,
    placeholderdetailsBackColor: String,
    placeholderbuyBtnBgColor: String,
    placeholderbuyBtnSecBgColor: String,
    placeholderbuyBtnTextColor: String,
    placeholderbuyButtonText: String,
    placeholderBuilderHeaderText: String,
    placeholderBuilderDescriptionText: String,
    placeholderPriceTextColor: String,
    placeholderPriceTextDesktopSize: String,
    placeholderPriceTextMobileSize: String,
    placeholderTopImage: String,
    placeholderBottomImage: String,
    placeholderBuilderTopText: String,
    placeholderBuilderBottomText: String,
    placeholderBuilderDiscountType: String,
    placeholderBuilderDiscountValue: String,
});
exports.settings = mongoose.model('Settings', settingsSchema);


//Settings
var colorSchema = new Schema({
    shop: String,
    color_name: String,
    color_numbers: Number,
    colors_hexcodes: Array
});
exports.colors = mongoose.model('colors', colorSchema);

mongoose.connect('mongodb://127.0.0.1/daquini_db_new', {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("mongo db connect");
    }
});