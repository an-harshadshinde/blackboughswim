var selectedTopProducts = [];
var selectedBottomProducts = [];
var currentTopProduct = {};
var currentBottomProduct = {};
var selectedTopvariant, selectedBottomvariant;

$(document).ready(function() {
  loadBuilder();
  // loadTopBottomStyles();
  $('.top-style-details-container .size-variants a').click(changeTopSizeVariant);
  $('.bottom-style-details-container .size-variants a').click(changeBottomSizeVariant);
  $('.top-style-details-container .swatch-container a').click(selectTopSwatch);
  $('.bottom-style-details-container .swatch-container a').click(selectBottomSwatch);
});

// Initialize slick carousel.
function initCarousel() {
  $('.top-product-slider, .bottom-product-slider').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    // variableWidth: true,
    // variableHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1,
        },
      },
    ],
  });
}
initCarousel();

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function loadBuilder() {
  var kit = getUrlVars()['kit'];
  var style = getUrlVars()['style'];
  console.log('kit :', kit);
  console.log('style :', style);
  if (kit) {
    loadKit(kit);
  } else if (style) {
    loadStyle(style);
  } else {
    var defaultStyle = styles[1];
    loadTopBottomStyles(defaultStyle);
  }
}

function loadKit(kitname) {
  var kit = getKitByName(kitname);
  for (let i = 0; i < kit.styles.length; i++) {
    var style = getStyleById(kit.styles[i]);
    loadTopBottomStyles(style);
  }
}

function loadStyle(stylename) {
  var style = getStyleByName(stylename);
  loadTopBottomStyles(style);
}

// Load Product images to carousel and load product swatches.
function loadTopBottomStyles(currentStyle) {
  console.log('currentStyle :', currentStyle);
  var topCollections = currentStyle.top_collections;
  var bottomCollections = currentStyle.bottom_collections;
  var topHtml = '';
  var totalPrice = 0;
  // Load top product images in slider and show product details in right panel.
  console.log('topCollections :', topCollections);
  topCollections.forEach((collection, colIndx) => {
    var selectedProducts = collection.selected_products;
    selectedTopProducts = selectedProducts;
    var selCol = getCollection(collection.collection_id);
    if (colIndx == 0 && selCol) {
      $('.top-style-details-container .collection-title').text(selCol.title);
    }
    var swatchText = '';
    if (selectedProducts.length > 0) {
      // selectedProducts.forEach((product, index) => {
      var index = 0;
      var selProd = getProduct(selectedProducts[index]);
      if (selProd) {
        if (index == 0) {
          var price = getProductPrice(selProd);
          totalPrice = parseInt(price);
          var priceText = '- ' + price + ' ' + currencySymbol;
          console.log('priceText :', priceText);
          $('.top-style-details-container .product-price').text(priceText);
        }
        var currentSlide = $('.top-product-slider').slick('slickCurrentSlide');
        var active = false;
        if (index == currentSlide) {
          currentTopProduct = selProd;
          active = true;
          var color = getColor(selProd.handle, selProd.tags, active);
          $('.top-style-details-container .color-text').text(color);
          var sizeText = getSizeVariants(selProd.variants);
          $('.top-style-details-container .size-variants').html(sizeText);
        }

        swatchText += getColorSwatch(selProd.handle, selProd.tags, active, index);
        var builderImg = getBuilderImage(selProd.images);
        if (builderImg) {
          topHtml =
            '<div class="slide-img-container"><img src="' +
            builderImg.src +
            '" data-index="' +
            index +
            '" data-price="' +
            getProductPrice(selProd) +
            '" /></div>';
          $('.top-product-slider').slick('slickAdd', topHtml);
        }
      }
      // });
    }

    var cnt = $('.top-product-slider .slide-img-container').length;
    if (cnt <= 1) {
      $('.top-product-slider').slick('slickSetOption', 'variableWidth', true);
      $('.top-product-slider').slick('slickSetOption', 'variableHeight', true);
      $('.top-product-slider .slide-img-container img').css('width', '300px');
      $('.top-product-slider .slide-img-container img').css('padding-left', '0');
    } else {
      $('.top-product-slider').slick('slickSetOption', 'variableWidth', false);
      $('.top-product-slider').slick('slickSetOption', 'variableHeight', false);
      $('.top-product-slider .slide-img-container img').css('width', '90%');
      $('.top-product-slider .slide-img-container img').css('padding-left', '10%');
    }
    $('.top-style-details-container .swatch-container').html(swatchText);
  });

  // Load bottom product images in slider and show product details in right panel.
  var bottomHtml = '';
  bottomCollections.forEach(collection => {
    var selectedProducts = collection.selected_products;
    selectedBottomProducts = selectedProducts;
    var selCol = getCollection(collection.collection_id);
    if (selCol) {
      $('.bottom-style-details-container .collection-title').text(selCol.title);
    }
    var swatchText = '';
    selectedProducts.forEach((product, index) => {
      var selProd = getProduct(product);
      if (selProd) {
        if (index == 0) {
          var price = getProductPrice(selProd);
          totalPrice = parseInt(totalPrice) + parseInt(price);
          var priceText = '- ' + price + ' ' + currencySymbol;
          $('.bottom-style-details-container .product-price').text(priceText);
        }
        var currentSlide = $('.bottom-product-slider').slick('slickCurrentSlide');
        var active = false;
        if (index == currentSlide) {
          currentBottomProduct = selProd;
          active = true;
          var color = getColor(selProd.handle, selProd.tags, active);
          $('.bottom-style-details-container .color-text').text(color);
          var sizeText = getSizeVariants(selProd.variants);
          $('.bottom-style-details-container .size-variants').html(sizeText);
        }
        swatchText += getColorSwatch(selProd.handle, selProd.tags, active, index);
        var builderImg = getBuilderImage(selProd.images);
        if (builderImg) {
          bottomHtml =
            '<div class="slide-img-container"><img src="' +
            builderImg.src +
            '" data-index="' +
            index +
            '" data-price="' +
            getProductPrice(selProd) +
            '" /></div>';
          $('.bottom-product-slider').slick('slickAdd', bottomHtml);
        }
      }
    });
    var cnt = $('.bottom-product-slider .slide-img-container').length;
    if (cnt <= 1) {
      $('.bottom-product-slider').slick('slickSetOption', 'variableWidth', true);
      $('.bottom-product-slider').slick('slickSetOption', 'variableHeight', true);
      $('.bottom-product-slider .slide-img-container img').css('width', '300px');
      $('.bottom-product-slider .slide-img-container img').css('padding-left', '0');
    } else {
      $('.bottom-product-slider').slick('slickSetOption', 'variableWidth', false);
      $('.bottom-product-slider').slick('slickSetOption', 'variableHeight', false);
      $('.bottom-product-slider .slide-img-container img').css('width', '90%');
      $('.bottom-product-slider .slide-img-container img').css('padding-left', '10%');
    }
    $('.bottom-style-details-container .swatch-container').html(swatchText);
  });

  totalPrice = totalPrice.toFixed(2);
  var totalPriceText = totalPrice + ' ' + currencySymbol;
  $('.btn-price-text').text(totalPriceText);
}
$('.top-product-slider').on('beforeChange', loadNextTopProduct);

function loadNextTopProduct(event, slick, currentSlide, nextSlide) {
  var currentSlideIn = $('.top-product-slider').slick('slickCurrentSlide');
  var ele = $('.top-product-slider [data-slick-index="' + nextSlide + '"]').find('img');
  var selIndex = $(ele).data('index');
  var selProd = getProduct(selectedTopProducts[selIndex]);
  currentTopProduct = selProd;
  var totalPrice = 0;
  if (selProd) {
    var price = getProductPrice(selProd);
    var bottomPrice = parseInt(
      $('.bottom-style-details-container .product-price')
        .text()
        .split('-')[1]
        .split(' Rs.')[0]
    );
    totalPrice = parseInt(price) + parseInt(bottomPrice);

    var priceText = '- ' + price + ' ' + currencySymbol;
    $('.top-style-details-container .product-price').text(priceText);

    var currentSlide = $('.top-product-slider').slick('slickCurrentSlide');
    var active = false;
    if (selIndex == nextSlide) {
      active = true;
      var color = getColor(selProd.handle, selProd.tags, active);
      $('.top-style-details-container .color-text').text(color);
      var sizeText = getSizeVariants(selProd.variants);
      $('.top-style-details-container .size-variants').html(sizeText);
    }
    $('.top-style-details-container .swatch.active').removeClass('active');
    $('.top-style-details-container .swatch-container [data-index="' + selIndex + '"]').addClass(
      'active'
    );
  }
  totalPrice = totalPrice.toFixed(2);
  var totalPriceText = totalPrice + ' ' + currencySymbol;
  $('.btn-price-text').text(totalPriceText);
  $('.top-style-details-container .size-variants a').click(changeTopSizeVariant);
}

$('.bottom-product-slider').on('beforeChange', loadNextBottomProduct);

function loadNextBottomProduct(event, slick, currentSlide, nextSlide) {
  var currentSlideIn = $('.bottom-product-slider').slick('slickCurrentSlide');
  var ele = $('.bottom-product-slider [data-slick-index="' + nextSlide + '"]').find('img');
  var selIndex = $(ele).data('index');
  var selProd = getProduct(selectedBottomProducts[selIndex]);
  currentBottomProduct = selProd;
  var totalPrice = 0;
  if (selProd) {
    var price = getProductPrice(selProd);
    var topPrice = parseInt(
      $('.top-style-details-container .product-price')
        .text()
        .split('-')[1]
        .split(' Rs.')[0]
    );
    totalPrice = parseInt(topPrice) + parseInt(price);

    var priceText = '- ' + price + ' ' + currencySymbol;
    $('.bottom-style-details-container .product-price').text(priceText);

    var currentSlide = $('.bottom-product-slider').slick('slickCurrentSlide');
    var active = false;
    if (selIndex == nextSlide) {
      active = true;
      var color = getColor(selProd.handle, selProd.tags, active);
      $('.bottom-style-details-container .color-text').text(color);
      var sizeText = getSizeVariants(selProd.variants);
      $('.bottom-style-details-container .size-variants').html(sizeText);
    }
    $('.bottom-style-details-container .swatch.active').removeClass('active');
    $('.bottom-style-details-container .swatch-container [data-index="' + selIndex + '"]').addClass(
      'active'
    );
  }
  totalPrice = totalPrice.toFixed(2);
  var totalPriceText = totalPrice + ' ' + currencySymbol;
  $('.btn-price-text').text(totalPriceText);
  $('.bottom-style-details-container .size-variants a').click(changeBottomSizeVariant);
}

function getKitById(kitid) {
  var kit = kits.filter(ele => {
    return ele._id == kitid;
  });
  if (kit) {
    return kit[0];
  } else {
    return {};
  }
}

function getKitByName(kitname) {
  kitname = kitname.replace('_', ' ');
  var kit = kits.filter(ele => {
    return ele.kit_name == kitname;
  });
  if (kit) {
    return kit[0];
  } else {
    return {};
  }
}

function getStyleById(styleid) {
  var style = styles.filter(ele => {
    return ele._id == styleid;
  });
  if (style) {
    return style[0];
  } else {
    return {};
  }
}

function getStyleByName(stylename) {
  stylename = stylename.replace('_', ' ');
  var style = styles.filter(ele => {
    return ele.style_name == stylename;
  });
  if (style) {
    return style[0];
  } else {
    return {};
  }
}

function getCollection(id) {
  var col = collections.filter(ele => {
    return ele.id == id;
  });
  if (col) {
    return col[0];
  } else {
    return {};
  }
}

function getProduct(id) {
  var prod = products.filter(ele => {
    return ele.id == id;
  });
  if (prod) {
    return prod[0];
  } else {
    return {};
  }
}

function getBuilderImage(images) {
  var img = images.filter(image => {
    return image.alt == 'Jozi-builder Image';
  });
  if (img) {
    return img[0];
  } else {
    return {};
  }
}

function getProductPrice(selProd, currIndex = 0) {
  return selProd.variants[currIndex].price;
}

function getColor(handle, tags, isActive) {
  var color = '';
  tags = tags.split(',');
  handle = 'swatch&' + handle;
  var tag = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (tag.length > 0 && isActive) {
    color = tag[0]
      .substring(tag[0].lastIndexOf('&name-') + 1, tag[0].lastIndexOf('&print'))
      .split('name-')[1];
    if (!color) {
      // color = tag[0].split('name-')[1];
      color = tag[0]
        .substring(tag[0].lastIndexOf('&name-') + 1, tag[0].lastIndexOf('&#'))
        .split('name-')[1];
    }
  }
  return color;
}

function getColorSwatch(handle, tags, isActive, index) {
  var swatch = '';
  tags = tags.split(',');
  handle = 'swatch&' + handle;
  var className = 'swatch';
  if (isActive) {
    className = 'swatch active';
  }
  var tag = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (tag.length > 0) {
    var imgName = tag[0].split('&print-')[1];
    if (imgName) {
      var imgURL = 'https://cdn.shopify.com/s/files/1/1219/5720/files/' + imgName;
      swatch =
        '<a href="javascript:void(0)" class="' +
        className +
        '" style="background: url(' +
        imgURL +
        ')" data-index="' +
        index +
        '"></a>';
    } else {
      var color = tag[0].split('&');
      color = color[color.length - 1];
      swatch =
        '<a href="javascript:void(0)" class="' +
        className +
        '" style="background: ' +
        color +
        '" data-index="' +
        index +
        '"></a>';
    }
  }
  return swatch;
}

function getSizeVariants(variants) {
  var sizeText = '';
  variants.forEach((variant, index) => {
    var className = 'size-text';
    if (index == 0) {
      className = 'size-text active';
    }
    sizeText +=
      '<a href="javascript:void(0);" class="' +
      className +
      '" data-index="' +
      index +
      '">' +
      variant.title +
      '</a>';
  });
  return sizeText;
}

function changeTopSizeVariant() {
  var selIndex = $(this).data('index');
  $('.top-style-details-container .size-text.active').removeClass('active');
  $(this).addClass('active');

  var variant = currentTopProduct.variants[selIndex];
  var price = variant.price;
  var totalPrice = 0;
  var bottomPrice = parseInt(
    $('.bottom-style-details-container .product-price')
      .text()
      .split('-')[1]
      .split(' Rs.')[0]
  );
  var priceText = '- ' + price + ' ' + currencySymbol;
  $('.top-style-details-container .product-price').text(priceText);

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  totalPrice = totalPrice.toFixed(2);

  var totalPriceText = totalPrice + ' ' + currencySymbol;
  $('.btn-price-text').text(totalPriceText);

  selectedTopvariant = selIndex;
}

function changeBottomSizeVariant() {
  var selIndex = $(this).data('index');
  $('.bottom-style-details-container .size-text.active').removeClass('active');
  $(this).addClass('active');

  var variant = currentBottomProduct.variants[selIndex];
  var price = variant.price;
  var totalPrice = 0;
  var bottomPrice = parseInt(
    $('.top-style-details-container .product-price')
      .text()
      .split('-')[1]
      .split(' Rs.')[0]
  );
  var priceText = '- ' + price + ' ' + currencySymbol;
  $('.bottom-style-details-container .product-price').text(priceText);

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  totalPrice = totalPrice.toFixed(2);

  var totalPriceText = totalPrice + ' ' + currencySymbol;
  $('.btn-price-text').text(totalPriceText);
  selectedBottomvariant = selIndex;
}

function selectTopSwatch() {
  var selIndex = $(this).data('index');
  $('.top-product-slider').slick('slickGoTo', selIndex);
}

function selectBottomSwatch() {
  var selIndex = $(this).data('index');
  $('.bottom-product-slider').slick('slickGoTo', selIndex);
}
