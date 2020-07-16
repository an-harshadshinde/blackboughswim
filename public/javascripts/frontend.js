var selectedTopProducts = [];
var selectedBottomProducts = [];
var addedTopCollections = [];
var addedBottomCollections = [];
var currentTopProduct = {};
var currentBottomProduct = {};
var selectedTopvariant = 0;
var selectedBottomvariant = 0;
var topCnt = 0;
var bottomCnt = 0;
var selectedTopCollections = [];
var selectedBottomCollections = [];
var unselectedTopCollections = [];
var unselectedBottomCollections = [];
var allTopCollections = [];
var allBottomCollections = [];

$(document).ready(function () {
  loadBuilder();
  // loadTopBottomStyles();
  $(".top-style-details-container .size-variants a").click(
    changeTopSizeVariant
  );
  $(".bottom-style-details-container .size-variants a").click(
    changeBottomSizeVariant
  );
  $(".top-style-details-container .swatch-container a").click(selectTopSwatch);
  $(".bottom-style-details-container .swatch-container a").click(
    selectBottomSwatch
  );
  $(".reset-btn").click(() => {
    resetDefaults();
    setTimeout(() => {
      loadBuilder();
    }, 100);
  });
  $("#buy-btn").click(addToCart);
  $(".collection-title").click(showCollectionPage);
});

$(".top-product-slider").on("afterChange", loadNextTopCollection);
$(".bottom-product-slider").on("afterChange", loadNextBottomCollection);

// Initialize slick carousel.
function initCarousel() {
  var mobileFirst = false;
  var isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
  var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
    navigator.userAgent.toLowerCase()
  );

  if (isMobile && !isTablet) {
    mobileFirst = isMobile;
  }

  // alert('mobileFirst: ' + mobileFirst);
  $(".top-product-slider, .bottom-product-slider").slick({
    centerMode: true,
    centerPadding: "180px",
    slidesToShow: 1,
    arrows: true,
    accessibility: true,
    draggable: false,
    mobileFirst: mobileFirst, //add this one
    responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     centerMode: true,
      //     centerPadding: "180px",
      //     slidesToShow: 1,
      //     arrows: true,
      //     accessibility: true,
      //     draggable: false,
      //   }
      // },
      // {
      //   breakpoint: 767,
      //   settings: {
      //     centerMode: true,
      //     centerPadding: "180px",
      //     slidesToShow: 1,
      //     arrows: true,
      //     accessibility: true,
      //     draggable: false,
      //   }
      // },
      // {
      //   breakpoint: 600,
      //   settings: {
      //     centerMode: true,
      //     centerPadding: "180px",
      //     slidesToShow: 1,
      //     arrows: true,
      //     accessibility: true,
      //     draggable: false,
      //   }
      // },
      {
        breakpoint: 480,
        settings: {
          centerMode: true,
          centerPadding: "80px",
          slidesToShow: 1,
          arrows: true,
          accessibility: true,
          draggable: false
        }
      }
    ]
  });
}
initCarousel();

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function loadBuilder() {
  var kit = getUrlVars()["kit"];
  var style = getUrlVars()["style"];
  var isInterim = window.location.href.indexOf("interim") != -1 ? true : false;
  if (isInterim) {
    loadInterim();
  } else if (kit) {
    loadKit(kit);
  } else if (style) {
    loadStyle(style);
  } else {
    $(".builder-head-text-container").hide();
    $(".top-bottom-head-container").show();
    for (let i = 0; i < styles.length; i++) {
      allTopCollections.push(...styles[i].top_collections);
      allBottomCollections.push(...styles[i].bottom_collections);
      var style = styles[i];
      loadTopBottomStyles(style);
      if (i == styles.length - 1) {
        loadTopDropDownContent();
        loadBottomDropDownContent();
      }
    }
  }
}

function loadInterim() {
  $(".builder-container").hide();
  $(".interim-container").show();
  var allTopStyles = [];
  var allBottomStyles = [];
  var top_html = (bottom_html = '<div class="row">');
  styles.forEach(style => {
    if (style.type == "top") {
      allTopStyles.push(style);
      top_html +=
        '<div class="col-4 col-md-3 col-lg-3 col-xl-3 pr-0"><div class="interim-image-container" style="background-image: url(https://blackboughswim.applicationnexus.com/uploads/' +
        style.image +
        ');">';
      top_html +=
        '<div class="text-right select-container"><input type= "checkbox" id="select_style_' +
        style._id +
        '" name="select_style_' +
        style._id +
        '" data-id="' +
        style._id +
        '" class = "checkbox-custom" onclick="selectInteriimStyle(this)"><label for="checkbox-3" class="checkbox-custom-label" ></label></div>';
      top_html += "</div>";
      top_html += "<h4>" + style.style_name + "</h4>";
      top_html += "</div>";
    } else {
      allBottomStyles.push(style);
      bottom_html +=
        '<div class="col-4 col-md-3 col-lg-3 col-xl-3 pr-0"><div class="interim-image-container" style="background-image: url(https://blackboughswim.applicationnexus.com/uploads/' +
        style.image +
        ');">';
      bottom_html +=
        '<div class="text-right select-container"><input type= "checkbox" id="select_style_' +
        style._id +
        '" name="select_style_' +
        style._id +
        '" data-id="' +
        style._id +
        '" class = "checkbox-custom" onclick="selectInteriimStyle(this)"><label for="checkbox-3" class="checkbox-custom-label" ></label></div>';
      bottom_html += "</div>";
      bottom_html += "<h4>" + style.style_name + "</h4>";
      bottom_html += "</div>";
    }
  });

  top_html += "</div>";
  bottom_html += "</div>";

  $(".interim-tops-container .style-selection-container").html(top_html);
  $(".interim-bottoms-container .style-selection-container").html(bottom_html);
}

$(".interim-tops-container #style_all_select").click(() => {
  var ischecked = $('.interim-tops-container #style_all_select').is(":checked");
  var el = $(
    ".interim-tops-container .style-selection-container .checkbox-custom"
  );
  el.each(function () {
    if (ischecked) {
      $(this).prop("checked", true);
      $(this).parent().parent().addClass('active');
    } else {
      $(this).prop("checked", false);
      $(this).parent().parent().removeClass('active');
    }
  });
});

$(".interim-bottoms-container #style_all_select").click(() => {
  var ischecked = $('.interim-bottoms-container #style_all_select').is(":checked");
  var el = $(
    ".interim-bottoms-container .style-selection-container .checkbox-custom"
  );
  el.each(function () {
    if (ischecked) {
      $(this).prop("checked", true);
      $(this).parent().parent().addClass('active');
    } else {
      $(this).prop("checked", false);
      $(this).parent().parent().removeClass('active');
    }
  });
});

function selectInteriimStyle(el) {
  var ischecked = $(el).is(":checked");
  if (ischecked) {
    $(el).parent().parent().addClass('active');
  } else {
    $(el).parent().parent().removeClass('active');
  }
}

$(".interim-tops-container .next-btn").click(() => {
  $(".interim-tops-container").hide();
  $(".interim-bottoms-container").show();
});

$(".interim-bottoms-container .back-btn").click(() => {
  $(".interim-tops-container").show();
  $(".interim-bottoms-container").hide();
});

$(".interim-bottoms-container .continue-btn").click(() => {
  var selStyles = [];
  var topEl = $(
    ".interim-tops-container .style-selection-container .checkbox-custom:checked"
  );
  topEl.each(function () {
    var id = $(this).data("id");
    var style = getStyleById(id);
    selStyles.push(style);
    // loadStyle(style.style_name);
  });

  var bottomEl = $(
    ".interim-bottoms-container .style-selection-container .checkbox-custom:checked"
  );
  bottomEl.each(function () {
    var id = $(this).data("id");
    var style = getStyleById(id);
    selStyles.push(style);
    // loadStyle(style.style_name);
  });

  for (let i = 0; i < selStyles.length; i++) {
    allTopCollections.push(...selStyles[i].top_collections);
    allBottomCollections.push(...selStyles[i].bottom_collections);
    var style = selStyles[i];
    loadTopBottomStyles(style);
    if (i == selStyles.length - 1) {
      loadTopDropDownContent();
      loadBottomDropDownContent();
    }
  }

  var isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
  var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
    navigator.userAgent.toLowerCase()
  );

  if (topEl.length == 1) {
    $(".top-product-slider .slick-track").css("width", "5000px");

    if (isMobile || isTablet) {
      $(".top-product-slider .slick-center").css(
        "transform",
        "translate3d(-2500px, 0px, 0px)"
      );
    } else {
      $(".top-product-slider .slick-center").css("width", "880px");
    }
  } else {
    $(".top-product-slider").slick("setPosition");
  }
  if (bottomEl.length == 1) {
    $(".bottom-product-slider .slick-track").css("width", "5000px");

    if (isMobile || isTablet) {
      $(".bottom-product-slider .slick-center").css(
        "transform",
        "translate3d(-2500px, 0px, 0px)"
      );
    } else {
      $(".bottom-product-slider .slick-center").css("width", "880px");
    }
  } else {
    $(".bottom-product-slider").slick("setPosition");
  }

  $(".top-product-slider").slick("slickNext");
  $(".bottom-product-slider").slick("slickNext");
  $(".interim-container").hide();
  $(".builder-container").show();
});

function loadKit(kitname) {
  var kit = getKitByName(kitname);
  var html = "";
  if (kit.show_name == "show") {
    html += "<h3>" + kit.kit_name + "</h3>";
  }
  if (kit.show_description == "show") {
    html += "<p>" + kit.description + "</p>";
  }
  if (html != "") {
    $(".builder-head-text-container").hide();
    $(".kit-head-text-container .col-12").html(html);
    $(".kit-head-text-container").show();
  }

  for (let i = 0; i < kit.styles.length; i++) {
    var style = getStyleById(kit.styles[i]);
    loadTopBottomStyles(style);
  }
}

function loadStyle(stylename) {
  $(".builder-head-text-container").hide();
  $(".top-bottom-head-container").show();
  var style = getStyleByName(stylename);
  loadTopBottomStyles(style);
  loadTopDropDownContent();
  loadBottomDropDownContent();
}

function loadTopDropDownContent(stylename) {
  $(".tops-select-container .selected-items-container").html("");
  addedTopCollections.forEach(element => {
    selectedTopCollections.push(element);
    var name = getCollection(element);
    var html =
      '<div class="col-12"><input type="checkbox" id="topDropCheckbox_' +
      element +
      '" name="topDropCheckbox_' +
      element +
      '" data-collectid="' +
      element +
      '" class="checkbox-custom" checked><label for="checkbox-3" class="checkbox-custom-label" >' +
      name.title +
      "</label></div>";

    $(".tops-select-container .selected-items-container").append(html);
  });
  if (addedTopCollections.length == 0) {
    $(".tops-select-container .selected-items-container").hide();
    $(".tops-select-container .selected-items-container")
      .next()
      .css("display", "none");
  } else {
    $(".tops-select-container .selected-items-container").show();
    $(".tops-select-container .selected-items-container")
      .next()
      .css("display", "block");
  }
  $(
    '.tops-select-container .selected-items-container input[type="checkbox"]'
  ).click(addRemoveTopCollections);
}

function loadBottomDropDownContent() {
  $(".bottoms-select-container .selected-items-container").html("");
  addedBottomCollections.forEach(element => {
    selectedBottomCollections.push(element);
    var name = getCollection(element);
    var html =
      '<div class="col-12"><input type= "checkbox" id="bottomDropCheckbox_' +
      element +
      '" name="bottomDropCheckbox_' +
      element +
      '" data-collectid="' +
      element +
      '" class = "checkbox-custom" checked><label for="checkbox-3" class="checkbox-custom-label" >' +
      name.title +
      "</label></div>";

    $(".bottoms-select-container .selected-items-container").append(html);
  });
  if (addedBottomCollections.length == 0) {
    $(".bottoms-select-container .selected-items-container").hide();
    $(".bottoms-select-container .selected-items-container")
      .next("hr")
      .hide();
  } else {
    $(".bottoms-select-container .selected-items-container").show();
    $(".bottoms-select-container .selected-items-container")
      .next("hr")
      .show();
  }
  $(
    '.bottoms-select-container .selected-items-container input[type="checkbox"]'
  ).click(addRemoveBottomCollections);
}

function loadTopDropDownUnSelContent() {
  $(".tops-select-container .selection-container").html("");
  unselectedTopCollections.forEach(element => {
    var name = getCollection(element);
    var html =
      '<div class="col-12"><input type= "checkbox" id="bottomDropCheckbox_' +
      element +
      '" name="bottomDropCheckbox_' +
      element +
      '" data-collectid="' +
      element +
      '" class = "checkbox-custom"><label for="checkbox-3" class="checkbox-custom-label" >' +
      name.title +
      "</label></div>";

    $(".tops-select-container .selection-container").append(html);
  });
  if (unselectedTopCollections.length == 0) {
    $(".tops-select-container .selection-container").hide();
    $(".tops-select-container .selection-container")
      .next()
      .css("display", "none");
  } else {
    $(".tops-select-container .selection-container").show();
    $(".tops-select-container .selection-container")
      .next()
      .css("display", "block");
  }
  $('.tops-select-container .selection-container input[type="checkbox"]').click(
    addRemoveTopCollections
  );
}

function loadBottomDropDownUnSelContent() {
  $(".bottoms-select-container .selection-container").html("");
  unselectedBottomCollections.forEach(element => {
    var name = getCollection(element);
    var html =
      '<div class="col-12"><input type= "checkbox" id="bottomDropCheckbox_' +
      element +
      '" name="bottomDropCheckbox_' +
      element +
      '" data-collectid="' +
      element +
      '" class = "checkbox-custom"><label for="checkbox-3" class="checkbox-custom-label" >' +
      name.title +
      "</label></div>";

    $(".bottoms-select-container .selection-container").append(html);
  });
  if (unselectedBottomCollections.length == 0) {
    $(".bottoms-select-container .selection-container").hide();
    $(".bottoms-select-container .selection-container hr").hide();
  } else {
    $(".bottoms-select-container .selection-container").show();
    $(".bottoms-select-container .selection-container hr").show();
  }
  $(
    '.bottoms-select-container .selection-container input[type="checkbox"]'
  ).click(addRemoveBottomCollections);
}

function addRemoveTopCollections(e) {
  e.stopPropagation();
  var ischecked = $(this).is(":checked");
  var collectid = $(this).data("collectid");
  if (ischecked) {
    topCnt = topCnt + 1;
    var style = getStyleByCollection(collectid, "top");
    loadTopBottomStyles(style);
    if (topCnt >= 3) {
      $(".top-product-slider").slick("slickSetOption", "slidesToShow", 2.3);
    } else {
      $(".top-product-slider").slick("slickSetOption", "slidesToShow", 1);
    }

    $(".top-product-slider").slick("reinit");
    if (topCnt == 1) {
      $(".top-product-slider .slick-arrow").remove();
    }
    unselectedTopCollections = unselectedTopCollections.filter(
      item => item !== collectid
    );
    selectedTopCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadTopDropDownContent();
  } else {
    var slides = $(
      '.top-product-slider [data-collectionid="' + collectid + '"]'
    ).parent();
    topCnt = topCnt - 1;
    for (let index = 0; index < slides.length; index++) {
      var currSlide = $(slides[index]);
      var slideIndex = $(currSlide).attr("data-slick-index");
      var slideCurr = $(".top-product-slider .slick-current");
      $(slideCurr).removeClass("slick-current slick-center");

      $(currSlide).remove();

      $(currSlide)
        .next()
        .addClass("slick-current slick-center");
      // $(".top-product-slider").slick("slickRemove", slideIndex);

      if (topCnt >= 3) {
        $(".top-product-slider").slick("slickSetOption", "slidesToShow", 2.3);
      } else {
        $(".top-product-slider").slick("slickSetOption", "slidesToShow", 1);
      }
    }
    $(".top-product-slider").slick("reinit");
    if (topCnt == 3) {
      var slidesCurr = $(".top-product-slider .slick-current");
      $(slidesCurr).removeClass("slick-current slick-center");
      $(slidesCurr)
        .prev()
        .prev()
        .addClass("slick-current slick-center");
    }
    if (topCnt == 1) {
      $(".top-product-slider .slick-arrow").remove();
    }

    addedTopCollections = addedTopCollections.filter(
      item => item !== collectid
    );
    selectedTopCollections = selectedTopCollections.filter(
      item => item !== collectid
    );
    unselectedTopCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadTopDropDownUnSelContent();
    setTopCollName();
    if (topCnt == 3) {
      var slidesCurrs = $(".top-product-slider .slick-current");
      $(slidesCurrs).removeClass("slick-current slick-center");
      $(slidesCurrs)
        .next()
        .next()
        .addClass("slick-current slick-center");
    }
  }
}

function addRemoveBottomCollections(e) {
  e.stopPropagation();
  var ischecked = $(this).is(":checked");
  var collectid = $(this).data("collectid");
  if (ischecked) {
    bottomCnt = bottomCnt + 1;
    var style = getStyleByCollection(collectid, "bottom");
    loadTopBottomStyles(style);
    if (bottomCnt >= 3) {
      $(".bottom-product-slider").slick("slickSetOption", "slidesToShow", 2.3);
    } else {
      $(".bottom-product-slider").slick("slickSetOption", "slidesToShow", 1);
    }

    $(".bottom-product-slider").slick("reinit");
    if (bottomCnt == 1) {
      $(".bottom-product-slider .slick-arrow").remove();
    }
    unselectedBottomCollections = unselectedBottomCollections.filter(
      item => item !== collectid
    );
    selectedBottomCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadBottomDropDownContent();
  } else {
    var slides = $(
      '.bottom-product-slider [data-collectionid="' + collectid + '"]'
    ).parent();
    bottomCnt = bottomCnt - 1;
    for (let index = 0; index < slides.length; index++) {
      var currSlide = $(slides[index]);
      var slideCurr = $(".bottom-product-slider .slick-current");
      $(slideCurr).removeClass("slick-current");

      $(currSlide).remove();

      $(currSlide)
        .next()
        .addClass("slick-current");
      // $(".bottom-product-slider").slick("slickRemove", slideIndex);

      if (bottomCnt >= 3) {
        $(".bottom-product-slider").slick(
          "slickSetOption",
          "slidesToShow",
          2.3
        );
      } else {
        $(".bottom-product-slider").slick("slickSetOption", "slidesToShow", 1);
      }
    }
    $(".bottom-product-slider").slick("reinit");
    if (bottomCnt == 3) {
      var slidesCurr = $(".bottom-product-slider .slick-current");
      var centerSlide = ".bottom-product-slider .slick-center";
      $(slidesCurr).removeClass("slick-current");
      $(slidesCurr)
        .prev()
        .prev()
        .addClass("slick-current");
    }
    if (bottomCnt == 1) {
      $(".bottom-product-slider .slick-arrow").remove();
    }

    addedBottomCollections = addedBottomCollections.filter(
      item => item !== collectid
    );
    selectedBottomCollections = selectedBottomCollections.filter(
      item => item !== collectid
    );
    unselectedBottomCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadBottomDropDownUnSelContent();
    setBottomCollName();
    if (topCnt == 3) {
      var slidesCurrs = $(".bottom-product-slider .slick-current");
      $(slidesCurrs).removeClass("slick-current");
      $(slidesCurrs)
        .next()
        .next()
        .addClass("slick-current");
    }
  }
}

// Load Product images to carousel and load product swatches.
function loadTopBottomStyles(currentStyle) {
  var topCollections = currentStyle.top_collections;
  var bottomCollections = currentStyle.bottom_collections;
  var topHtml = "";
  var totalPrice = 0;

  // Load top product images in slider and show product details in right panel.
  topCollections.forEach((collection, colIndx) => {
    if (addedTopCollections.indexOf(collection.collection_id) === -1) {
      addedTopCollections.push(collection.collection_id);
    } else {
      return;
    }

    var selectedProducts = collection.selected_products;
    selectedTopProducts = selectedProducts;
    var selCol = getCollection(collection.collection_id);
    // if (colIndx == 0 && selCol) {
    //   console.log('selCol.title :', selCol.title);
    //   $('.top-style-details-container .collection-title').text(selCol.title);
    // }
    var swatchText = "";
    if (selectedProducts.length > 0) {
      // selectedProducts.forEach((product, index) => {
      var index = 0;
      var selProd = getProduct(selectedProducts[index]);
      if (selProd) {
        var builderImg = getBuilderImage(selProd.images);
        if (builderImg) {
          topHtml =
            '<div class="slide-img-container"><img src="' +
            builderImg.src +
            '" data-index="' +
            colIndx +
            '" data-styleid="' +
            currentStyle._id +
            '" data-collectionid="' +
            collection.collection_id +
            '" data-price="' +
            getProductPrice(selProd) +
            '" data-prodid="' +
            selProd.id +
            '" data-currswatch="0" data-currsize="0" /></div>';
          $(".top-product-slider").slick("slickAdd", topHtml);
          topCnt++;
        }
      }
      // });
    }
    var cnt = $(".top-product-slider .slide-img-container").length;
    if (topCnt <= 1) {
      $(".top-product-slider").slick("slickSetOption", "variableWidth", true);
      $(".top-product-slider").slick("slickSetOption", "variableHeight", true);
    } else {
      $(".top-product-slider").slick("slickSetOption", "variableWidth", false);
      $(".top-product-slider").slick("slickSetOption", "variableHeight", false);
    }

    if (topCnt >= 3) {
      $(".top-product-slider").slick(
        "slickSetOption",
        "centerPadding",
        "125px"
      );
      $(".top-product-slider").slick("slickSetOption", "slidesToShow", 2.3);
    }
  });

  setTopCollName();

  // Load bottom product images in slider and show product details in right panel.
  var bottomHtml = "";

  bottomCollections.forEach((collection, colIndx) => {
    if (addedBottomCollections.indexOf(collection.collection_id) == -1) {
      addedBottomCollections.push(collection.collection_id);
    } else {
      return;
    }
    var selectedProducts = collection.selected_products;
    selectedBottomProducts = selectedProducts;
    var selCol = getCollection(collection.collection_id);
    if (colIndx == 0 && selCol) {
      $(".bottom-style-details-container .collection-title").text(selCol.title);
      $(".bottom-style-details-container .collection-title").attr(
        "data-collid",
        selCol.id
      );
    }
    var swatchText = "";
    if (selectedProducts.length > 0) {
      //   selectedProducts.forEach((product, index) => {
      var index = 0;
      var selProd = getProduct(selectedProducts[index]);
      if (selProd) {
        var builderImg = getBuilderImage(selProd.images);
        if (builderImg) {
          bottomHtml =
            '<div class="slide-img-container"><img src="' +
            builderImg.src +
            '" data-index="' +
            index +
            '" data-styleid="' +
            currentStyle._id +
            '" data-collectionid="' +
            collection.collection_id +
            '" data-price="' +
            getProductPrice(selProd) +
            '" data-prodid="' +
            selProd.id +
            '"  data-currswatch="0" data-currsize="0" /></div>';
          $(".bottom-product-slider").slick("slickAdd", bottomHtml);
          bottomCnt++;
        }
      }
      //   });
    }
    var cnt = $(".bottom-product-slider .slide-img-container").length;
    if (bottomCnt <= 1) {
      $(".bottom-product-slider").slick(
        "slickSetOption",
        "variableWidth",
        true
      );
      $(".bottom-product-slider").slick(
        "slickSetOption",
        "variableHeight",
        true
      );
    } else {
      $(".bottom-product-slider").slick(
        "slickSetOption",
        "variableWidth",
        false
      );
      $(".bottom-product-slider").slick(
        "slickSetOption",
        "variableHeight",
        false
      );
    }
    if (bottomCnt >= 3) {
      $(".bottom-product-slider").slick(
        "slickSetOption",
        "centerPadding",
        "125px"
      );
      $(".bottom-product-slider").slick("slickSetOption", "slidesToShow", 2.3);
    }
  });
  setBottomCollName();

  setTimeout(() => {
    var topPrice = $(".top-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    var bottomPrice = $(".bottom-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    totalPrice = totalPrice.toFixed(2);
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }, 100);
}

function setTopCollName() {
  var totalPrice = 0;
  var totSlides = $(".top-product-slider .slick-slide").length;
  if (topCnt < 3) {
    var ele = $(".top-product-slider .slick-current").find("img");
  } else if (topCnt > 3) {
    var ele = $(".top-product-slider .slick-current")
      .prev()
      .find("img");
  } else {
    var ele = $(".top-product-slider .slick-current")
      .next()
      .find("img");
  }

  var prevEle = $(".top-product-slider .slick-current")
    .prev(".slick-active")
    .prev()
    .find("img");
  var curSlideColID = $(ele).data("collectionid");
  var styleid = $(ele).data("styleid");
  var selCol = getCollection(curSlideColID);
  var style = getStyleById(styleid);
  var currSwatch = $(ele).attr("data-currswatch");
  var prodid = $(ele).attr("data-prodid");
  var currSize = $(ele).attr("data-currsize");
  if (selCol) {
    $(".top-style-details-container .collection-title").text(selCol.title);
    $(".top-style-details-container .collection-title").attr(
      "data-collid",
      selCol.id
    );
    var topCollections = style.top_collections;
    var selectedColl = topCollections.filter(ele => {
      return ele.collection_id == curSlideColID;
    });
    if (selectedColl) {
      var selectedProducts = selectedColl[0].selected_products;
      var selProd = getProduct(selectedProducts[0]);
      if (prodid) {
        selProd = getProduct(prodid);
      }
      if (selProd) {
        var price = getProductPrice(selProd, currSize);
        var priceText = "- " + price + " " + currencySymbol;
        $(".top-style-details-container .product-price").text(priceText);
        var currentSlide = $(".top-product-slider").slick("slickCurrentSlide");
        var active = false;

        currentTopProduct = selProd;
        active = true;

        var sizeText = getSizeVariants(selProd.variants, currSize);
        $(".top-style-details-container .size-variants").html(sizeText);
        swatchText = getProductSwatches(
          selCol.handle,
          selProd.tags,
          selProd.id,
          currSwatch
        );
        $(".top-style-details-container .swatch-container").html(swatchText);

        var color = getColor(selProd.handle, selProd.tags, active);
        if (currSwatch) {
          color = $(
            '.top-style-details-container .swatch-container [data-index="' +
            currSwatch +
            '"]'
          ).attr("data-colortext");
        }
        $(".top-style-details-container .color-text").text(color);
      }
    }
  }

  setTimeout(() => {
    var topPrice = $(".top-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    var bottomPrice = $(".bottom-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    totalPrice = totalPrice.toFixed(2);
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }, 100);

  $(".top-style-details-container .size-variants a").click(
    changeTopSizeVariant
  );
  $(".bottom-style-details-container .size-variants a").click(
    changeBottomSizeVariant
  );
  $(".top-style-details-container .swatch-container a").click(selectTopSwatch);
  $(".bottom-style-details-container .swatch-container a").click(
    selectBottomSwatch
  );
}

function setBottomCollName() {
  var totalPrice = 0;
  var totSlides = $(".bottom-product-slider .slick-slide").length;
  if (bottomCnt < 3) {
    var ele = $(".bottom-product-slider .slick-current").find("img");
  } else if (bottomCnt > 3) {
    var ele = $(".bottom-product-slider .slick-current")
      .prev()
      .find("img");
  } else {
    var ele = $(".bottom-product-slider .slick-current")
      .next()
      .find("img");
  }

  var curSlideColID = $(ele).data("collectionid");
  var styleid = $(ele).data("styleid");
  var selCol = getCollection(curSlideColID);
  var style = getStyleById(styleid);
  var currSwatch = $(ele).attr("data-currswatch");
  var currSize = $(ele).attr("data-currsize");
  var prodid = $(ele).attr("data-prodid");
  if (selCol) {
    $(".bottom-style-details-container .collection-title").text(selCol.title);
    $(".bottom-style-details-container .collection-title").attr(
      "data-collid",
      selCol.id
    );
    var bottomCollections = style.bottom_collections;
    var selectedColl = bottomCollections.filter(ele => {
      return ele.collection_id == curSlideColID;
    });
    if (selectedColl) {
      var selectedProducts = selectedColl[0].selected_products;
      var selProd = getProduct(selectedProducts[0]);
      if (prodid) {
        selProd = getProduct(prodid);
      }
      if (selProd) {
        var price = getProductPrice(selProd, currSize);
        var priceText = "- " + price + " " + currencySymbol;
        $(".bottom-style-details-container .product-price").text(priceText);
        var currentSlide = $(".bottom-product-slider").slick(
          "slickCurrentSlide"
        );
        var active = false;

        currentBottomProduct = selProd;
        active = true;

        var sizeText = getSizeVariants(selProd.variants, currSize);
        $(".bottom-style-details-container .size-variants").html(sizeText);
        var tagHandle = selProd.title.split(" /")[0];
        if (tagHandle) {
          tagHandle = tagHandle.replace(" ", "-").toLowerCase();
        }
        swatchText = getProductSwatches(
          tagHandle,
          selProd.tags,
          selProd.id,
          currSwatch
        );
        $(".bottom-style-details-container .swatch-container").html(swatchText);

        var color = getColor(selProd.handle, selProd.tags, active);
        if (currSwatch) {
          color = $(
            '.bottom-style-details-container .swatch-container [data-index="' +
            currSwatch +
            '"]'
          ).attr("data-colortext");
        }
        $(".bottom-style-details-container .color-text").text(color);
      }
    }
  }

  setTimeout(() => {
    var topPrice = $(".top-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    var bottomPrice = $(".bottom-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    totalPrice = totalPrice.toFixed(2);
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }, 100);

  $(".top-style-details-container .size-variants a").click(
    changeTopSizeVariant
  );
  $(".bottom-style-details-container .size-variants a").click(
    changeBottomSizeVariant
  );
  $(".top-style-details-container .swatch-container a").click(selectTopSwatch);
  $(".bottom-style-details-container .swatch-container a").click(
    selectBottomSwatch
  );
}

function loadNextTopCollection(event, slick, currentSlide, nextSlide) {
  setTopCollName();
}

function loadNextBottomCollection(event, slick, currentSlide, nextSlide) {
  setBottomCollName();
}

// $('.top-product-slider').on('afterChange', loadNextTopProduct);
// $('.bottom-product-slider').on('beforeChange', loadNextBottomProduct);

function loadNextTopProduct(event, slick, currentSlide, nextSlide) {
  var currentSlideIn = $(".top-product-slider").slick("slickCurrentSlide");
  var ele = $(
    '.top-product-slider [data-slick-index="' + nextSlide + '"]'
  ).find("img");
  var selIndex = $(ele).data("index");
  var selProd = getProduct(selectedTopProducts[selIndex]);
  currentTopProduct = selProd;
  var totalPrice = 0;
  if (selProd) {
    var price = getProductPrice(selProd);
    var bottomPrice = parseInt(
      $(".bottom-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0]
    );
    totalPrice = parseInt(price) + parseInt(bottomPrice);

    var priceText = "- " + price + " " + currencySymbol;
    $(".top-style-details-container .product-price").text(priceText);

    var currentSlide = $(".top-product-slider").slick("slickCurrentSlide");
    var active = false;
    if (selIndex == nextSlide) {
      active = true;
      var color = getColor(selProd.handle, selProd.tags, active);
      $(".top-style-details-container .color-text").text(color);
      var sizeText = getSizeVariants(selProd.variants);
      $(".top-style-details-container .size-variants").html(sizeText);
    }
    $(".top-style-details-container .swatch.active").removeClass("active");
    $(
      '.top-style-details-container .swatch-container [data-index="' +
      selIndex +
      '"]'
    ).addClass("active");
  }
  totalPrice = totalPrice.toFixed(2);
  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);
  $(".top-style-details-container .size-variants a").click(
    changeTopSizeVariant
  );
}

function loadNextBottomProduct(event, slick, currentSlide, nextSlide) {
  var currentSlideIn = $(".bottom-product-slider").slick("slickCurrentSlide");
  var ele = $(
    '.bottom-product-slider [data-slick-index="' + nextSlide + '"]'
  ).find("img");
  var selIndex = $(ele).data("index");
  var selProd = getProduct(selectedBottomProducts[selIndex]);
  currentBottomProduct = selProd;
  var totalPrice = 0;
  if (selProd) {
    var price = getProductPrice(selProd);
    var topPrice = parseInt(
      $(".top-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0]
    );
    totalPrice = parseInt(topPrice) + parseInt(price);

    var priceText = "- " + price + " " + currencySymbol;
    $(".bottom-style-details-container .product-price").text(priceText);

    var currentSlide = $(".bottom-product-slider").slick("slickCurrentSlide");
    var active = false;
    if (selIndex == nextSlide) {
      active = true;
      var color = getColor(selProd.handle, selProd.tags, active);
      $(".bottom-style-details-container .color-text").text(color);
      var sizeText = getSizeVariants(selProd.variants);
      $(".bottom-style-details-container .size-variants").html(sizeText);
    }
    $(".bottom-style-details-container .swatch.active").removeClass("active");
    $(
      '.bottom-style-details-container .swatch-container [data-index="' +
      selIndex +
      '"]'
    ).addClass("active");
  }
  totalPrice = totalPrice.toFixed(2);
  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);
  $(".bottom-style-details-container .size-variants a").click(
    changeBottomSizeVariant
  );
}

function getProductSwatches(handle, tags, prodid, currSwatch = 0) {
  var swatch = "";
  tags = tags.split(",");
  handle = "swatch&" + handle;

  var swatchTags = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (swatchTags.length > 0) {
    swatchTags.forEach((tag, index) => {
      var prodHandle = tag.split("&name")[0].split("swatch&")[1];
      var className = "swatch";
      var colorText = tag.split("&name-")[1].split("&")[0];
      if (index == currSwatch) {
        className = "swatch active";
      }
      var imgName = tag.split("&print-")[1];
      if (imgName) {
        var imgURL =
          "https://cdn.shopify.com/s/files/1/1219/5720/files/" + imgName;
        swatch +=
          '<a href="javascript:void(0)" class="' +
          className +
          '" style="background: url(' +
          imgURL +
          ')" data-index="' +
          index +
          '" data-prodhandle="' +
          prodHandle +
          '" data-colortext="' +
          colorText +
          '" data-prodid="' +
          prodid +
          '"></a>';
      } else {
        var color = tag.split("&");
        color = color[color.length - 1];
        swatch +=
          '<a href="javascript:void(0)" class="' +
          className +
          '" style="background: ' +
          color +
          '" data-index="' +
          index +
          '" data-prodhandle="' +
          prodHandle +
          '" data-colortext="' +
          colorText +
          '" data-prodid="' +
          prodid +
          '"></a>';
      }
    });
  }
  return swatch;
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
  kitname = kitname.replace("_", " ");
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
  stylename = stylename.replace("_", " ");
  var style = styles.filter(ele => {
    return ele.style_name == stylename;
  });
  if (style) {
    return style[0];
  } else {
    return {};
  }
}

function getStyleByCollection(collectionid, type) {
  // kitname = kitname.replace("_", " ");
  var style = styles.filter(ele => {
    if (type == "top") {
      var found = ele.top_collections.some(el => {
        return el.collection_id == collectionid;
      });
      return found;
    } else {
      var found = ele.bottom_collections.some(el => {
        return el.collection_id === collectionid;
      });
      return found;
    }
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
    return image.alt == "Jozi-builder Image";
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
  var color = "";
  tags = tags.split(",");
  handle = "swatch&" + handle;
  var tag = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (tag.length > 0 && isActive) {
    color = tag[0]
      .substring(tag[0].lastIndexOf("&name-") + 1, tag[0].lastIndexOf("&print"))
      .split("name-")[1];
    if (!color) {
      // color = tag[0].split('name-')[1];
      color = tag[0]
        .substring(tag[0].lastIndexOf("&name-") + 1, tag[0].lastIndexOf("&#"))
        .split("name-")[1];
    }
  }
  return color;
}

function getColorSwatch(handle, tags, isActive, index) {
  var swatch = "";
  tags = tags.split(",");
  handle = "swatch&" + handle;
  var className = "swatch";
  if (isActive) {
    className = "swatch active";
  }
  var tag = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (tag.length > 0) {
    var imgName = tag[0].split("&print-")[1];
    if (imgName) {
      var imgURL =
        "https://cdn.shopify.com/s/files/1/1219/5720/files/" + imgName;
      swatch =
        '<a href="javascript:void(0)" class="' +
        className +
        '" style="background: url(' +
        imgURL +
        ')" data-index="' +
        index +
        '"></a>';
    } else {
      var color = tag[0].split("&");
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

function getSizeVariants(variants, currSize = 0) {
  var sizeText = "";
  variants.forEach((variant, index) => {
    var className = "size-text";
    if (index == currSize) {
      className = "size-text active";
    }
    sizeText +=
      '<a href="javascript:void(0);" class="' +
      className +
      '" data-index="' +
      index +
      '">' +
      variant.title +
      "</a>";
  });
  return sizeText;
}

function changeTopSizeVariant() {
  var selIndex = $(this).data("index");
  $(".top-style-details-container .size-text.active").removeClass("active");
  $(this).addClass("active");

  var totSlides = $(".top-product-slider .slick-slide").length;
  if (topCnt < 3) {
    var ele = $(".top-product-slider .slick-current").find("img");
  } else if (topCnt > 3) {
    var ele = $(".top-product-slider .slick-current")
      .prev()
      .find("img");
  } else {
    var ele = $(".top-product-slider .slick-current")
      .next()
      .find("img");
  }
  var eleCollection = $(ele).data("collectionid");
  var allClonedEle = $(
    '.top-product-slider [data-collectionid="' + eleCollection + '"]'
  );
  for (var cindex = 0; cindex < allClonedEle.length; cindex++) {
    $(allClonedEle[cindex]).attr("data-currsize", selIndex);
  }

  var variant = currentTopProduct.variants[selIndex];
  var price = variant.price;
  var totalPrice = 0;
  var bottomPrice = parseInt(
    $(".bottom-style-details-container .product-price")
    .text()
    .split("-")[1]
    .split(" Rs.")[0]
  );
  var priceText = "- " + price + " " + currencySymbol;
  $(".top-style-details-container .product-price").text(priceText);

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  totalPrice = totalPrice.toFixed(2);

  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);

  selectedTopvariant = selIndex;
}

function changeBottomSizeVariant() {
  var selIndex = $(this).data("index");
  $(".bottom-style-details-container .size-text.active").removeClass("active");
  $(this).addClass("active");

  var totSlides = $(".bottom-product-slider .slick-slide").length;
  if (bottomCnt < 3) {
    var ele = $(".bottom-product-slider .slick-current").find("img");
  } else if (bottomCnt > 3) {
    var ele = $(".bottom-product-slider .slick-current")
      .prev()
      .find("img");
  } else {
    var ele = $(".bottom-product-slider .slick-current")
      .next()
      .find("img");
  }
  var eleCollection = $(ele).data("collectionid");
  var allClonedEle = $(
    '.bottom-product-slider [data-collectionid="' + eleCollection + '"]'
  );
  for (var cindex = 0; cindex < allClonedEle.length; cindex++) {
    $(allClonedEle[cindex]).attr("data-currsize", selIndex);
  }

  var variant = currentBottomProduct.variants[selIndex];
  var price = variant.price;
  var totalPrice = 0;
  var bottomPrice = parseInt(
    $(".top-style-details-container .product-price")
    .text()
    .split("-")[1]
    .split(" Rs.")[0]
  );
  var priceText = "- " + price + " " + currencySymbol;
  $(".bottom-style-details-container .product-price").text(priceText);

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  totalPrice = totalPrice.toFixed(2);

  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);
  selectedBottomvariant = selIndex;
}

function selectTopSwatch() {
  var selIndex = $(this).data("index");
  var prodHandle = $(this).data("prodhandle");
  var colorText = $(this).data("colortext");
  var product = products.filter(product => {
    if (product.handle.toUpperCase().indexOf(prodHandle.toUpperCase()) > -1) {
      return product;
    }
  });
  if (product.length > 0) {
    currentTopProduct = product[0];
    getSizeVariants(product[0].variants);
    var prodPrice = product[0].variants[selectedTopvariant].price;
    var prodImages = product[0].images;
    var builderImg = "";
    if (prodImages.length > 0) {
      builderImg = getBuilderImage(prodImages);
    }
    if (builderImg) {
      var totSlides = $(".top-product-slider .slick-slide").length;
      if (topCnt < 3) {
        var ele = $(".top-product-slider .slick-current").find("img");
      } else if (topCnt > 3) {
        var ele = $(".top-product-slider .slick-current")
          .prev()
          .find("img");
      } else {
        var ele = $(".top-product-slider .slick-current")
          .next()
          .find("img");
      }
      var eleCollection = $(ele).data("collectionid");
      var allClonedEle = $(
        '.top-product-slider [data-collectionid="' + eleCollection + '"]'
      );
      for (var cindex = 0; cindex < allClonedEle.length; cindex++) {
        $(allClonedEle[cindex]).attr("data-prodid", product[0].id);
        $(allClonedEle[cindex]).attr("data-currswatch", selIndex);
        $(allClonedEle[cindex]).attr("src", builderImg.src);
      }
    }
    var priceText = "- " + prodPrice + " " + currencySymbol;
    $(".top-style-details-container .product-price").text(priceText);
    var bottomPrice = $(".bottom-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    totalPrice = parseInt(prodPrice) + parseInt(bottomPrice);
    totalPrice = totalPrice.toFixed(2);
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }
  $(".top-style-details-container .swatch-container .active").removeClass(
    "active"
  );
  $(this).addClass("active");
  $(".top-style-details-container .color-text").text(colorText);
  // $('.top-product-slider').slick('slickGoTo', selIndex);
}

function selectBottomSwatch() {
  var selIndex = $(this).data("index");
  var prodHandle = $(this).data("prodhandle");
  var colorText = $(this).data("colortext");
  var product = products.filter(product => {
    if (product.handle.toUpperCase().indexOf(prodHandle.toUpperCase()) > -1) {
      return product;
    }
  });
  if (product.length > 0) {
    currentBottomProduct = product[0];
    getSizeVariants(product[0].variants);
    var prodPrice = product[0].variants[selectedBottomvariant].price;
    var prodImages = product[0].images;
    var builderImg = "";
    if (prodImages.length > 0) {
      builderImg = getBuilderImage(prodImages);
    }
    if (builderImg) {
      var totSlides = $(".top-product-slider .slick-slide").length;
      if (bottomCnt < 3) {
        var ele = $(".bottom-product-slider .slick-current").find("img");
      } else if (bottomCnt > 3) {
        var ele = $(".bottom-product-slider .slick-current")
          .prev()
          .find("img");
      } else {
        var ele = $(".bottom-product-slider .slick-current")
          .next()
          .find("img");
      }
      var eleCollection = $(ele).data("collectionid");
      var allClonedEle = $(
        '.bottom-product-slider [data-collectionid="' + eleCollection + '"]'
      );
      for (var cindex = 0; cindex < allClonedEle.length; cindex++) {
        $(allClonedEle[cindex]).attr("data-prodid", product[0].id);
        $(allClonedEle[cindex]).attr("data-currswatch", selIndex);
        $(allClonedEle[cindex]).attr("src", builderImg.src);
      }
    }
    var priceText = "- " + prodPrice + " " + currencySymbol;
    $(".bottom-style-details-container .product-price").text(priceText);
    var bottomPrice = $(".top-style-details-container .product-price")
      .text()
      .split("-")[1]
      .split(" Rs.")[0];
    totalPrice = parseInt(prodPrice) + parseInt(bottomPrice);
    totalPrice = totalPrice.toFixed(2);
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }
  $(".bottom-style-details-container .swatch-container .active").removeClass(
    "active"
  );
  $(this).addClass("active");
  $(".bottom-style-details-container .color-text").text(colorText);
  // $('.bottom-product-slider').slick('slickGoTo', selIndex);
}

function showToast(msg) {
  $("#snackbar").html(msg);
  $("#snackbar").attr("class", "show");
  setTimeout(function () {
    $("#snackbar").removeClass("show");
  }, 3000);
}

function addToCart() {
  var topVariant = currentTopProduct.variants[selectedTopvariant].id;
  var bottomVariant = currentBottomProduct.variants[selectedBottomvariant].id;
  $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: {
        quantity: 1,
        id: topVariant
      },
      dataType: "json"
    })
    .done(function (data) {
      $.ajax({
          type: "POST",
          url: "/cart/add.js",
          data: {
            quantity: 1,
            id: bottomVariant
          },
          dataType: "json"
        })
        .done(function (data) {
          document.location.href = "/cart";
        })
        .fail(function (xhr, status, error) {
          alert(xhr.responseJSON.description);
        });
    })
    .fail(function (xhr, status, error) {
      alert(xhr.responseJSON.description);
    });
}

function resetDefaults() {
  selectedTopProducts = [];
  selectedBottomProducts = [];
  addedTopCollections = [];
  addedBottomCollections = [];
  currentTopProduct = {};
  currentBottomProduct = {};
  selectedTopvariant = 0;
  selectedBottomvariant = 0;
  // topCnt = 0;
  // bottomCnt = 0;
  selectedTopCollections = [];
  selectedBottomCollections = [];
  unselectedTopCollections = [];
  unselectedBottomCollections = [];
  allTopCollections = [];
  allBottomCollections = [];
}

function showCollectionPage() {
  var prodHandle = $(this)
    .closest(".row")
    .next()
    .find(".swatch-container .active")
    .attr("data-prodhandle");
  var product = products.filter(product => {
    if (product.handle.toUpperCase().indexOf(prodHandle.toUpperCase()) > -1) {
      return product;
    }
  });
  if (product.length > 0) {
    window.open("/collections/all/products/" + product[0].handle, "_blank");
  }
}