var selectedTopProducts = [];
var selectedBottomProducts = [];
var addedTopCollections = [];
var addedBottomCollections = [];
var currentTopProduct = {};
var currentBottomProduct = {};
var selectedTopvariant = null;
var selectedBottomvariant = null;
var topCnt = 0;
var bottomCnt = 0;
var selectedTopCollections = [];
var selectedBottomCollections = [];
var unselectedTopCollections = [];
var unselectedBottomCollections = [];
var allTopCollections = [];
var allBottomCollections = [];
var isSidebarOpen = false;
var lastSelectedTopSlide = 0;
var lastSelectedBottomSlide = 0;
var fromInterim = false;
var enableLoop = false;
$(document).ready(function () {
  // loadBuilder();
  // loadTopBottomStyles();

  initCarousel();
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

  // $(".reset-btn").click(() => {
  //   resetDefaults();
  //   setTimeout(() => {
  //     loadBuilder();
  //   }, 100);
  // });

  $(".tops-select-container .reset-btn").click(function (e) {
    // selectedTopCollections = [];
    // unselectedTopCollections = [];
    e.stopPropagation();
    selectedTopCollections.forEach(element => {
      $(
        '.tops-select-container .selected-items-container [data-collectid="' +
        element +
        '"]'
      ).click();
    });
    $(".top-style-details-container").hide();
    $(".top-style-details-container")
      .next("hr")
      .hide();
  });

  $(".bottoms-select-container .reset-btn").click(function (e) {
    // selectedBottomCollections = [];
    // unselectedBottomCollections = [];
    e.stopPropagation();
    selectedBottomCollections.forEach(element => {
      $(
        '.bottoms-select-container .selected-items-container [data-collectid="' +
        element +
        '"]'
      ).click();
    });
    $(".bottom-style-details-container").hide();
  });

  $("#buy-btn").click(addToCart);
  $(".collection-title").click(showCollectionPage);

  //Load top product details in side menu on navigating to next/prev product.
  $(".top-product-slider").on("translated.owl.carousel", function (e) {
    selectedTopvariant = null;
    if (topCnt >= 0) {
      $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
    } else {
      $(".top-product-slider .owl-nav").addClass("owl-nav-hidden");
    }
    setTopCollName();
    if (topCnt % 2 == 0) {
      lastSelectedTopSlide = e.item.index + 1;
    } else {
      lastSelectedTopSlide = e.relatedTarget.current();
    }
  });

  //Load bottom product details in side menu on navigating to next/prev product.
  $(".bottom-product-slider").on("translated.owl.carousel", function (e) {
    selectedBottomvariant = null;
    if (bottomCnt >= 0) {
      $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
    } else {
      $(".bottom-product-slider .owl-nav").addClass("owl-nav-hidden");
    }
    setBottomCollName();
    if (bottomCnt % 2 == 0) {
      lastSelectedBottomSlide = e.item.index + 1;
    } else {
      lastSelectedBottomSlide = e.relatedTarget.current();
    }
  });

  //Show/hide side menu in mobile version.
  $("#details-btn, .back-btn").click(() => {
    var currSelectedTop = $(".top-product-slider .owl-item.center").index();
    var currSelectedBottom = $(
      ".bottom-product-slider .owl-item.center"
    ).index();

    if (!isSidebarOpen) {
      $("#details-btn").hide();
      $(".bounce-arrow").hide();
      $(".slide-container").addClass("sidebarOpen");
      $(".builder-slide-container").addClass("col-6");
      $(".builder-details-container").show();
      $("#details-btn img").attr("src", remote_url + "/public/images/down.png");
      $(".builder-head-text-container p").hide();
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      // $(".top-product-slider .owl-nav").addClass("owl-nav-hidden");
      $(".top-product-slider").trigger("to.owl.carousel", currSelectedTop);

      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      // $(".bottom-product-slider .owl-nav").addClass("owl-nav-hidden");
      $(".bottom-product-slider").trigger(
        "to.owl.carousel",
        currSelectedBottom
      );
    } else {
      $("#details-btn").show();
      $(".bounce-arrow").show();
      $(".slide-container").removeClass("sidebarOpen");
      $(".builder-slide-container").removeClass("col-6");
      $(".builder-details-container").hide();
      $(".builder-head-text-container p").show();
      $("#details-btn img").attr("src", remote_url + "/public/images/up.png");
      if (topCnt <= 1) {
        $(".top-product-slider").trigger("destroy.owl.carousel");
        var $owl = $(".top-product-slider").owlCarousel({
          center: true,
          items: 1,
          nav: true,
          dot: false,
          loop: false,
          margin: 30,
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          freeDrag: false,
          animateOut: 'fadeOutLeft',
          animateIn: 'fadeInRight',
          responsive: {
            0: {
              items: 1,
              margin: 10,
              touchDrag: true,
              stagePadding: 80
            },
            600: {
              items: 3
            },
            1000: {
              items: 3
            }
          },
          navText: [
            '<img src="' + remote_url + '/public/images/prev.png">',
            '<img src="' + remote_url + '/public/images/next.png">'
          ]
        });
        $owl.trigger("refresh.owl.carousel");
        $(".top-product-slider .owl-nav").addClass("owl-nav-hidden");
        // if (topCnt % 2 == 0) {
        //   lastSelectedTopSlide = lastSelectedTopSlide - 1;
        // }
        $(".top-product-slider").trigger("to.owl.carousel", currSelectedTop);
      } else {
        $(".top-product-slider").trigger("destroy.owl.carousel");
        var $owl = $(".top-product-slider").owlCarousel({
          center: true,
          items: 3,
          nav: true,
          dot: false,
          loop: enableLoop,
          margin: 30,
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          freeDrag: false,
          animateOut: 'fadeOutLeft',
          animateIn: 'fadeInRight',
          responsive: {
            0: {
              items: 1,
              margin: 10,
              touchDrag: true,
              stagePadding: 80
            },
            600: {
              items: 3
            },
            1000: {
              items: 3
            }
          },
          navText: [
            '<img src="' + remote_url + '/public/images/prev.png">',
            '<img src="' + remote_url + '/public/images/next.png">'
          ]
        });
        $owl.trigger("refresh.owl.carousel");
        $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
        // if (topCnt % 2 == 0) {
        //   lastSelectedTopSlide = lastSelectedTopSlide - 1;
        // }
        $(".top-product-slider").trigger("to.owl.carousel", currSelectedTop);
      }
      if (bottomCnt <= 1) {
        $(".bottom-product-slider").trigger("destroy.owl.carousel");
        var $owl = $(".bottom-product-slider").owlCarousel({
          center: true,
          items: 1,
          nav: true,
          dot: false,
          loop: false,
          margin: 30,
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          freeDrag: false,
          animateOut: 'fadeOutLeft',
          animateIn: 'fadeInRight',
          responsive: {
            0: {
              items: 1,
              margin: 10,
              touchDrag: true,
              stagePadding: 80
            },
            600: {
              items: 3
            },
            1000: {
              items: 3
            }
          },
          navText: [
            '<img src="' + remote_url + '/public/images/prev.png">',
            '<img src="' + remote_url + '/public/images/next.png">'
          ]
        });
        $owl.trigger("refresh.owl.carousel");
        $(".bottom-product-slider .owl-nav").addClass("owl-nav-hidden");
        // if (bottomCnt % 2 == 0) {
        //   lastSelectedBottomSlide = lastSelectedBottomSlide - 1;
        // }
        $(".bottom-product-slider").trigger(
          "to.owl.carousel",
          currSelectedBottom
        );
      } else {
        $(".bottom-product-slider").trigger("destroy.owl.carousel");
        var $owl = $(".bottom-product-slider").owlCarousel({
          center: true,
          items: 3,
          nav: true,
          dot: false,
          loop: enableLoop,
          margin: 30,
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          freeDrag: false,
          animateOut: 'fadeOutLeft',
          animateIn: 'fadeInRight',
          responsive: {
            0: {
              items: 1,
              margin: 10,
              touchDrag: true,
              stagePadding: 80
            },
            600: {
              items: 3
            },
            1000: {
              items: 3
            }
          },
          navText: [
            '<img src="' + remote_url + '/public/images/prev.png">',
            '<img src="' + remote_url + '/public/images/next.png">'
          ]
        });
        $owl.trigger("refresh.owl.carousel");
        $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
        // if (bottomCnt % 2 == 0) {
        //   lastSelectedBottomSlide = lastSelectedBottomSlide - 1;
        // }
        $(".bottom-product-slider").trigger(
          "to.owl.carousel",
          currSelectedBottom
        );
      }
    }
    isSidebarOpen = !isSidebarOpen;
  });

  $(".style-selection-container .col-4").click(function () {
    var el = $(this).find(".checkbox-custom");
    // el.click();
    $(el).prop("checked", !$(el).is(":checked"));
    selectInterimStyle(el);
  });
});

document.addEventListener(
  "touchmove",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  false
);

$(".remodal-close").click(() => {
  $(".remodal-is-opened")
    .addClass("remodal-is-closed")
    .removeClass("remodal-is-opened");
});

//Initialize builder carousel.
function initCarousel() {
  var mobileFirst = false;
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    $("body").addClass("safari");
  }
  var isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
  var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
    navigator.userAgent.toLowerCase()
  );

  if (isMobile && !isTablet) {
    $(".desktop-view").remove();
    mobileFirst = isMobile;
  }

  $(".top-product-slider").owlCarousel({
    center: true,
    items: 3,
    nav: true,
    dot: false,
    loop: enableLoop,
    margin: 30,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    freeDrag: false,
    responsive: {
      0: {
        items: 1,
        margin: 10,
        touchDrag: true,
        stagePadding: 80
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    },
    navText: [
      '<img src="' + remote_url + '/public/images/prev.png">',
      '<img src="' + remote_url + '/public/images/next.png">'
    ]
  });
  $(".bottom-product-slider").owlCarousel({
    center: true,
    items: 3,
    nav: true,
    dot: false,
    loop: enableLoop,
    margin: 30,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    freeDrag: false,
    responsive: {
      0: {
        items: 1,
        margin: 10,
        touchDrag: true,
        stagePadding: 80
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    },
    navText: [
      '<img src="' + remote_url + '/public/images/prev.png">',
      '<img src="' + remote_url + '/public/images/next.png">'
    ]
  });
  loadBuilder();
  return;
}

//Get url variable values.
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

//Load builder by checking the use case.
function loadBuilder() {
  var kit = getUrlVars()["kit"];
  var style = getUrlVars()["style"];
  // var isInterim = window.location.href.indexOf("interim") != -1 ? true : false;
  var isInterim = window.location.href.indexOf("selection") != -1 ? true : false;
  if (isInterim) {
    loadInterim();
    $(".builder-head-text-container").hide();
    $(".top-bottom-head-container").show();
  } else if (kit) {
    $(".mobile-view .buy-btn-container").show();
    $(".mobile-header-container").show();
    loadKit(kit);
  } else if (style) {
    $(".mobile-view .buy-btn-container").show();
    $(".mobile-header-container").show();
    loadStyle(style);
  } else {
    $(".mobile-view .buy-btn-container").show();
    $(".mobile-header-container").show();
    $(".builder-head-text-container").show();
    $(".top-bottom-head-container").show();

    // Sort styles alphabetically.
    // styles.sort(function (a, b) {
    //   var keyA = a.style_name,
    //     keyB = b.style_name;
    //   if (keyA < keyB) return -1;
    //   if (keyA > keyB) return 1;
    //   return 0;
    // });

    // console.log('styles :', styles);
    // Sort styles numerically.
    // styles.sort(function (a, b) {
    //   var keyA = parseInt(a.style_order);
    //   var keyB = parseInt(b.style_order);
    //   return keyA - keyB || a.type == b.type;
    // });
    styles.sort(function (a, b) {
      var keyA = parseInt(a.style_order);
      var keyB = parseInt(b.style_order);
      return keyA - keyB;
    });
    // console.log('styles :', styles);
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

//Load interim screen.
function loadInterim() {
  fromInterim = true;
  $(".mobile-view .buy-btn-container").hide();
  $(".builder-container").hide();
  $(".interim-container").show();
  var allTopStyles = [];
  var allBottomStyles = [];
  var top_html = (bottom_html = '<div class="row">');
  styles.sort(function (a, b) {
    var keyA = parseInt(a.style_order);
    var keyB = parseInt(b.style_order);
    return keyA - keyB;
  });
  styles.forEach(style => {
    if (style.hasOwnProperty("is_enabled")) {
      if (style.is_enabled == false || style.image == "") {
        return;
      }
    } else {
      return;
    }
    if (style.type == "top") {
      allTopStyles.push(style);
      top_html +=
        '<div class="col-4 col-md-3 col-lg-3 col-xl-3 pr-0"><div class="interim-image-container" style="background-image: url(https://blackboughswim.applicationnexus.com/uploads/' +
        style.image +
        ');">';
      // top_html +=
      //   '<div class="text-right select-container"><input type= "checkbox" id="select_style_' +
      //   style._id +
      //   '" name="select_style_' +
      //   style._id +
      //   '" data-id="' +
      //   style._id +
      //   '" class = "checkbox-custom" onclick="selectInterimStyle(this)"><label for="checkbox-3" class="checkbox-custom-label" ></label></div>';

      top_html +=
        '<div class="text-right select-container"><label class="check-container"><input type = "checkbox" id = "select_style_' +
        style._id +
        '" name="select_style_' +
        style._id +
        '" data-id="' +
        style._id +
        '" class="checkbox-custom" /><span class = "checkmark" > </span></label ></div>';

      top_html += "</div>";
      top_html += "<h4>" + style.style_name + "</h4>";
      top_html += "</div>";
    } else {
      allBottomStyles.push(style);
      bottom_html +=
        '<div class="col-4 col-md-3 col-lg-3 col-xl-3 pr-0"><div class="interim-image-container" style="background-image: url(https://blackboughswim.applicationnexus.com/uploads/' +
        style.image +
        ');">';
      // bottom_html +=
      //   '<div class="text-right select-container"><input type= "checkbox" id="select_style_' +
      //   style._id +
      //   '" name="select_style_' +
      //   style._id +
      //   '" data-id="' +
      //   style._id +
      //   '" class = "checkbox-custom" onclick="selectInterimStyle(this)"><label for="checkbox-3" class="checkbox-custom-label" ></label></div>';

      bottom_html +=
        '<div class="text-right select-container"><label class="check-container"><input type = "checkbox" id = "select_style_' +
        style._id +
        '" name="select_style_' +
        style._id +
        '" data-id="' +
        style._id +
        '" class="checkbox-custom" /><span class = "checkmark" > </span></label ></div>';

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

//Select all top collections on interim screen.
$(".interim-tops-container #style_all_select").click(() => {
  var ischecked = $(".interim-tops-container #style_all_select").is(":checked");
  var el = $(
    ".interim-tops-container .style-selection-container .checkbox-custom"
  );
  el.each(function () {
    if (ischecked) {
      $(this).prop("checked", true);
      $(this)
        .parent()
        .parent()
        .parent()
        .addClass("active");
    } else {
      $(this).prop("checked", false);
      $(this)
        .parent()
        .parent()
        .parent()
        .removeClass("active");
    }
  });
});

//Select all bottom collections on interim screen.
$(".interim-bottoms-container #style_all_select").click(() => {
  var ischecked = $(".interim-bottoms-container #style_all_select").is(
    ":checked"
  );
  var el = $(
    ".interim-bottoms-container .style-selection-container .checkbox-custom"
  );
  el.each(function () {
    if (ischecked) {
      $(this).prop("checked", true);
      $(this)
        .parent()
        .parent()
        .parent()
        .addClass("active");
    } else {
      $(this).prop("checked", false);
      $(this)
        .parent()
        .parent()
        .parent()
        .removeClass("active");
    }
  });
});

//Select style on interim screen.
function selectInterimStyle(el) {
  var ischecked = $(el).is(":checked");
  if (ischecked) {
    $(el)
      .parent()
      .parent()
      .parent()
      .addClass("active");
  } else {
    $(el)
      .parent()
      .parent()
      .parent()
      .removeClass("active");
  }
  if ($(el).closest(".interim-tops-container").length) {
    var topEl = $(
      ".interim-tops-container .style-selection-container .checkbox-custom"
    );
    var topCheckedEl = $(
      ".interim-tops-container .style-selection-container .checkbox-custom:checked"
    );
    if (topEl.length == topCheckedEl.length) {
      $(".interim-tops-container #style_all_select").prop("checked", true);
    } else {
      $(".interim-tops-container #style_all_select").prop("checked", false);
    }
  } else {
    var bottomEl = $(
      ".interim-bottoms-container .style-selection-container .checkbox-custom"
    );
    var bottomCheckedEl = $(
      ".interim-bottoms-container .style-selection-container .checkbox-custom:checked"
    );
    if (bottomEl.length == bottomCheckedEl.length) {
      $(".interim-bottoms-container #style_all_select").prop("checked", true);
    } else {
      $(".interim-bottoms-container #style_all_select").prop("checked", false);
    }
  }
}

//Load bottom product selection container of interim screen.
$(".interim-tops-container .next-btn").click(() => {
  var topEl = $(
    ".interim-tops-container .style-selection-container .checkbox-custom:checked"
  );
  if (topEl.length == 0) {
    alert("Please select at least one top.");
    return;
  }
  document.documentElement.scrollTop = 0;
  $(".interim-tops-container").hide();
  $(".interim-bottoms-container").show();
});

//Load top product selection container of interim screen.
$(".interim-bottoms-container .back-btn").click(() => {
  document.documentElement.scrollTop = 0;
  $(".interim-tops-container").show();
  $(".interim-bottoms-container").hide();
});

//Load selected products on interim screen to builder.
$(".interim-bottoms-container .continue-btn").click(() => {
  document.documentElement.scrollTop = 0;
  var selStyles = [];
  var topEl = $(
    ".interim-tops-container .style-selection-container .checkbox-custom:checked"
  );
  topEl.each(function () {
    var id = $(this).data("id");
    var style = getStyleById(id);
    selStyles.push(style);
  });

  var bottomEl = $(
    ".interim-bottoms-container .style-selection-container .checkbox-custom:checked"
  );
  if (bottomEl.length == 0) {
    alert("Please select at least one bottom.");
    return;
  }

  bottomEl.each(function () {
    var id = $(this).data("id");
    var style = getStyleById(id);
    selStyles.push(style);
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

  styles.filter(item => {
    if (item.type == "top" && selStyles.indexOf(item) == -1) {
      item.top_collections.forEach(element => {
        unselectedTopCollections.push(element.collection_id);
      });
    }
    if (item.type == "bottom" && selStyles.indexOf(item) == -1) {
      item.bottom_collections.forEach(element => {
        unselectedBottomCollections.push(element.collection_id);
      });
    }
  });

  loadTopDropDownUnSelContent();
  loadBottomDropDownUnSelContent();
  $(".interim-container").hide();
  $(".mobile-view .buy-btn-container").show();
  $(".mobile-header-container").show();
  $(".builder-container").show();

  //Load top product details in side menu on navigating to next/prev product.
  $(".top-product-slider").on("translated.owl.carousel", function (e) {
    setTopCollName();
  });

  //Load bottom product details in side menu on navigating to next/prev product.
  $(".bottom-product-slider").on("translated.owl.carousel", function (e) {
    setBottomCollName();
  });
});

//Load top/bottom products of kit in builder.
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

var topSorted = false;
//Load top/bottom products of style in builder.
function loadStyle(stylename) {
  $(".builder-head-text-container").hide();
  $(".top-bottom-head-container").show();
  var style = getStyleByName(stylename);
  loadTopBottomStyles(style);
  loadTopDropDownContent();
  loadBottomDropDownContent();
}

//Load selected style names in top filter dropdown.
function loadTopDropDownContent(stylename) {
  $(".tops-select-container .selected-items-container").html("");

  // var filteredCollections = sortFilterItems();

  var filteredCollections = [];
  addedTopCollections.forEach(element => {
    var name = getCollection(element);
    filteredCollections.push(name);
  });
  filteredCollections.sort(function (a, b) {
    var keyA = a.title,
      keyB = b.title;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  filteredCollections.forEach(element => {
    selectedTopCollections.push(element.id);
    var name = element.title;
    var html =
      '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
      element.id +
      '" name="topDropCheckbox_' +
      element.id +
      '" data-collectid="' +
      element.id +
      '" class="checkbox-custom" checked /><span class="checkmark"></span><span class="style-title">' +
      name +
      "</span></label></div>";

    $(".tops-select-container .selected-items-container").append(html);
  });
  // addedTopCollections.forEach(element => {
  //   selectedTopCollections.push(element);
  //   var name = getCollection(element);
  //   var html =
  //     '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
  //     element +
  //     '" name="topDropCheckbox_' +
  //     element +
  //     '" data-collectid="' +
  //     element +
  //     '" class="checkbox-custom" checked /><span class="checkmark"></span><span class="style-title">' +
  //     name.title +
  //     "</span></label></div>";

  //   $(".tops-select-container .selected-items-container").append(html);
  // });
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
  loadTopDropDownUnSelContent();
}

//Load selected style names in bottom filter dropdown.
function loadBottomDropDownContent() {
  $(".bottoms-select-container .selected-items-container").html("");
  var filteredCollections = [];
  addedBottomCollections.forEach(element => {
    var name = getCollection(element);
    filteredCollections.push(name);
  });
  filteredCollections.sort(function (a, b) {
    var keyA = a.title,
      keyB = b.title;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  filteredCollections.forEach(element => {
    selectedBottomCollections.push(element.id);
    var name = element.title;
    var html =
      '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
      element.id +
      '" name="topDropCheckbox_' +
      element.id +
      '" data-collectid="' +
      element.id +
      '" class="checkbox-custom" checked /><span class="checkmark"></span><span class="style-title">' +
      name +
      "</span></label></div>";

    $(".bottoms-select-container .selected-items-container").append(html);
  });
  // addedBottomCollections.forEach(element => {
  //   selectedBottomCollections.push(element);
  //   var name = getCollection(element);
  //   var html =
  //     '<div class="col-12"><label class="check-container"><input type="checkbox" id="bottomDropCheckbox_' +
  //     element +
  //     '" name="bottomDropCheckbox_' +
  //     element +
  //     '" data-collectid="' +
  //     element +
  //     '" class="checkbox-custom" checked /><span class="checkmark"></span><span class="style-title">' +
  //     name.title +
  //     "</span></label></div>";

  //   $(".bottoms-select-container .selected-items-container").append(html);
  // });
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
  loadBottomDropDownUnSelContent();
  // sortFilterItems('.bottoms-select-container .selected-items-container');
}

//Load undelected style names in top filter dropdown.
function loadTopDropDownUnSelContent() {
  $(".tops-select-container .selection-container").html("");

  var filteredCollections = [];
  unselectedTopCollections.forEach(element => {
    var name = getCollection(element);
    filteredCollections.push(name);
  });
  filteredCollections.sort(function (a, b) {
    var keyA = a.title,
      keyB = b.title;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  filteredCollections.forEach(element => {
    var name = element.title;
    var html =
      '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
      element.id +
      '" name="topDropCheckbox_' +
      element.id +
      '" data-collectid="' +
      element.id +
      '" class="checkbox-custom" /><span class="checkmark"></span><span class="style-title">' +
      name +
      "</span></label></div>";

    $(".tops-select-container .selection-container").append(html);
  });

  // unselectedTopCollections.forEach(element => {
  //   var name = getCollection(element);
  //   var html =
  //     '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
  //     element +
  //     '" name="topDropCheckbox_' +
  //     element +
  //     '" data-collectid="' +
  //     element +
  //     '" class="checkbox-custom" /><span class="checkmark"></span><span class="style-title">' +
  //     name.title +
  //     "</span></label></div>";

  //   $(".tops-select-container .selection-container").append(html);
  // });
  if (unselectedTopCollections.length == 0) {
    $(".tops-select-container .selection-container").hide();
    $(".tops-select-container .selection-container")
      .next("hr")
      .css("display", "none");
  } else {
    $(".tops-select-container .selection-container").show();
    $(".tops-select-container .selection-container")
      .next("hr")
      .css("display", "block");
  }
  $('.tops-select-container .selection-container input[type="checkbox"]').click(
    addRemoveTopCollections
  );
  // sortFilterItems('.tops-select-container .selection-container');
}

//Load unselected style names in bottom filter dropdown.
function loadBottomDropDownUnSelContent() {
  $(".bottoms-select-container .selection-container").html("");
  var filteredCollections = [];
  unselectedBottomCollections.forEach(element => {
    var name = getCollection(element);
    filteredCollections.push(name);
  });
  filteredCollections.sort(function (a, b) {
    var keyA = a.title,
      keyB = b.title;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  filteredCollections.forEach(element => {
    var name = element.title;
    var html =
      '<div class="col-12"><label class="check-container"><input type="checkbox" id="topDropCheckbox_' +
      element.id +
      '" name="topDropCheckbox_' +
      element.id +
      '" data-collectid="' +
      element.id +
      '" class="checkbox-custom" /><span class="checkmark"></span><span class="style-title">' +
      name +
      "</span></label></div>";

    $(".bottoms-select-container .selection-container").append(html);
  });
  // unselectedBottomCollections.forEach(element => {
  //   var name = getCollection(element);
  //   var html =
  //     '<div class="col-12"><label class="check-container"><input type="checkbox" id="bottomDropCheckbox_' +
  //     element +
  //     '" name="bottomDropCheckbox_' +
  //     element +
  //     '" data-collectid="' +
  //     element +
  //     '" class="checkbox-custom" /><span class="checkmark"></span><span class="style-title">' +
  //     name.title +
  //     "</span></label></div>";

  //   $(".bottoms-select-container .selection-container").append(html);
  // });
  if (unselectedBottomCollections.length == 0) {
    $(".bottoms-select-container .selection-container").hide();
    $(".bottoms-select-container .selection-container")
      .next("hr")
      .hide();
  } else {
    $(".bottoms-select-container .selection-container").show();
    $(".bottoms-select-container .selection-container")
      .next("hr")
      .show();
  }
  $(
    '.bottoms-select-container .selection-container input[type="checkbox"]'
  ).click(addRemoveBottomCollections);
  // sortFilterItems('.bottoms-select-container .selection-container');
}

// Sorts items in filter dropdown in asc/desc order.
function sortFilterTopItems() {
  var newGenArray = [];
  addedTopCollections.forEach(element => {
    var name = getCollection(element);
    newGenArray.push(name);
  });
  newGenArray.sort(function (a, b) {
    var keyA = a.title,
      keyB = b.title;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return newGenArray;
}

//Add or remove products from builder on top filter selection.
function addRemoveTopCollections(e) {
  e.stopPropagation();
  selectedTopvariant = null;
  var ischecked = $(this).is(":checked");
  var collectid = $(this).data("collectid");
  if (ischecked) {
    $(".top-product-slider-container").show();
    $(".top-product-slider").removeClass("owl-hidden");
    $(".top-product-placeholder-container").hide();
    $(".top-style-details-container").show();
    $(".top-style-details-placeholder-container").hide();
    topCnt = topCnt + 1;
    var style = getStyleByCollection(collectid, "top");
    loadTopBottomStyles(style);
    if (topCnt >= 0) {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    if (bottomCnt >= 0) {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    unselectedTopCollections = unselectedTopCollections.filter(
      item => item !== collectid
    );
    selectedTopCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadTopDropDownContent();
    $(".top-style-details-container").show();
    $(".top-style-details-container")
      .next("hr")
      .show();
    $(".tops-select-container .selected-items-container")
      .next("hr")
      .show();
  } else {
    var slides = $(
      '.top-product-slider [data-collectionid="' + collectid + '"]'
    )
      .parent()
      .parent();
    topCnt = topCnt - 1;
    for (let index = 0; index < slides.length; index++) {
      var currSlide = $(slides[index]);
      var currIndex = $(currSlide).index();
      $(currSlide).remove();
      // if (!$(currSlide).hasClass("cloned")) {
      // console.log('removed ', currIndex);
      // $(currSlide).addClass('asdassdsdsadasd');
      // $('.top-product-slider').owlCarousel('remove', currIndex);
      // }
    }

    if (topCnt <= 1) {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").addClass("owl-nav-hidden");
    } else {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: enableLoop,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }

    addedTopCollections = addedTopCollections.filter(
      item => item !== collectid
    );
    selectedTopCollections = selectedTopCollections.filter(
      item => item !== collectid
    );
    if (unselectedTopCollections.indexOf(collectid) == -1) {
      unselectedTopCollections.push(collectid);
    }
    if (addedTopCollections.length == 0) {
      $(".tops-select-container .selected-items-container")
        .next("hr")
        .hide();
      $(".top-style-details-container").hide();
      $(".top-style-details-container")
        .next("hr")
        .hide();
      $(".top-product-slider-container").hide();
      $(".top-product-placeholder-container").show();
      $(".top-style-details-container").hide();
      $(".top-style-details-placeholder-container").show();
    }
    $(this)
      .parent()
      .remove();
    loadTopDropDownUnSelContent();
    setTopCollName();
    EnabaleDisableCartBtn();
  }
}

//Add or remove products from builder on bottom filter selection.
function addRemoveBottomCollections(e) {
  e.stopPropagation();
  selectedBottomvariant = null;
  var ischecked = $(this).is(":checked");
  var collectid = $(this).data("collectid");
  if (ischecked) {
    $(".bottom-product-slider-container").show();
    $(".bottom-product-slider").removeClass("owl-hidden");
    $(".bottom-product-placeholder-container").hide();
    $(".bottom-style-details-container").show();
    $(".bottom-style-details-placeholder-container").hide();
    bottomCnt = bottomCnt + 1;
    var style = getStyleByCollection(collectid, "bottom");
    loadTopBottomStyles(style);
    unselectedBottomCollections = unselectedBottomCollections.filter(
      item => item !== collectid
    );
    if (bottomCnt >= 0) {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    if (topCnt >= 0) {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    selectedBottomCollections.push(collectid);
    $(this)
      .parent()
      .remove();
    loadBottomDropDownContent();
    $(".bottom-style-details-container").show();
    $(".bottoms-select-container .selected-items-container")
      .next("hr")
      .show();
  } else {
    var slides = $(
      '.bottom-product-slider [data-collectionid="' + collectid + '"]'
    )
      .parent()
      .parent();

    bottomCnt = bottomCnt - 1;
    for (let index = 0; index < slides.length; index++) {
      var currSlide = $(slides[index]);
      var currIndex = $(currSlide).index();
      $(currSlide).remove();
      // if (!$(currSlide).hasClass("cloned")) {
      // console.log('removed ', currIndex);
      // $(currSlide).addClass('asdassdsdsadasd');
      // $('.bottom-product-slider').owlCarousel('remove', currIndex);
      // }
    }
    if (bottomCnt <= 1) {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").addClass("owl-nav-hidden");
    } else {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: enableLoop,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    addedBottomCollections = addedBottomCollections.filter(
      item => item !== collectid
    );
    selectedBottomCollections = selectedBottomCollections.filter(
      item => item !== collectid
    );
    if (unselectedBottomCollections.indexOf(collectid) == -1) {
      unselectedBottomCollections.push(collectid);
    }

    if (addedBottomCollections.length == 0) {
      $(".bottoms-select-container .selected-items-container")
        .next("hr")
        .hide();
      $(".bottom-style-details-container").hide();
      $(".bottom-product-slider-container").hide();
      $(".bottom-product-placeholder-container").show();
      $(".bottom-style-details-container").hide();
      $(".bottom-style-details-placeholder-container").show();
    }

    $(this)
      .parent()
      .remove();
    loadBottomDropDownUnSelContent();
    setBottomCollName();
    EnabaleDisableCartBtn();
  }
}

//Load products to builder.
function loadTopBottomStyles(currentStyle) {
  var topCollections = currentStyle.top_collections;
  var bottomCollections = currentStyle.bottom_collections;
  var topHtml = "";
  var totalPrice = 0;

  if (currentStyle.type == "top") {
    // Load top product images in slider and show product details in right panel.
    topCollections.forEach((collection, colIndx) => {
      var selectedProducts = collection.selected_products;
      selectedTopProducts = selectedProducts;
      var selCol = getCollection(collection.collection_id);
      var swatchText = "";
      if (selectedProducts.length > 0) {
        var index = 0;
        for (var i = 0; i < selectedProducts.length; i++) {
          var selProd = getProduct(selectedProducts[i]);
          if (selProd) {
            // var builderImg = getBuilderImage(selProd.images);
            var builderImg = getBuilderImage(selProd.builderImage);
            var inStock = checkInStock(selProd.id);

            function checkNextProdInStock() {
              if (selectedProducts.length >= index) {
                index = index + 1;
                selProd = getProduct(selectedProducts[index]);
                if (!selProd) {
                  return;
                }
                // builderImg = getBuilderImage(selProd.images);
                builderImg = getBuilderImage(selProd.builderImage);
                inStock = checkInStock(selProd.id);
                if (
                  (!inStock && builderImg) ||
                  (inStock && builderImg == undefined) ||
                  (!inStock && !builderImg)
                ) {
                  checkNextProdInStock();
                } else {
                  if (builderImg && inStock) {
                    if (
                      addedTopCollections.indexOf(collection.collection_id) === -1
                    ) {
                      addedTopCollections.push(collection.collection_id);
                    } else {
                      return;
                    }
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
                    topCnt++;
                    $(".top-product-slider").owlCarousel("add", topHtml);
                  }
                }
              }
            }

            if (
              (!inStock && builderImg) ||
              (inStock && builderImg == undefined) ||
              (!inStock && !builderImg)
            ) {
              checkNextProdInStock();
            } else {
              if (builderImg && inStock) {
                if (
                  addedTopCollections.indexOf(collection.collection_id) === -1
                ) {
                  addedTopCollections.push(collection.collection_id);
                } else {
                  return;
                }
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
                topCnt++;
                $(".top-product-slider").owlCarousel("add", topHtml);
              }
            }
            break;
          }
        }
      }
    });
    if (topCnt <= 1) {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true,
            stagePadding: 80
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").addClass("owl-nav-hidden");
    } else {
      $(".top-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".top-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: enableLoop,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true,
            stagePadding: 80
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".top-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    setTopCollName();
  } else {
    // Load bottom product images in slider and show product details in right panel.
    var bottomHtml = "";
    bottomCollections.forEach((collection, colIndx) => {
      var selectedProducts = collection.selected_products;
      selectedBottomProducts = selectedProducts;
      var selCol = getCollection(collection.collection_id);
      if (colIndx == 0 && selCol) {
        $(".bottom-style-details-container .collection-title").text(
          selCol.title
        );
        $(".bottom-style-details-container .collection-title").attr(
          "data-collid",
          selCol.id
        );
      }
      var swatchText = "";
      if (selectedProducts.length > 0) {
        var index = 0;
        for (var i = 0; i < selectedProducts.length; i++) {
          var selProd = getProduct(selectedProducts[index]);
          if (selProd) {
            // var builderImg = getBuilderImage(selProd.images);
            var builderImg = getBuilderImage(selProd.builderImage);
            var inStock = checkInStock(selProd.id);

            function checkNextProdInStock() {
              if (selectedProducts.length >= index) {
                index = index + 1;
                selProd = getProduct(selectedProducts[index]);
                if (!selProd) {
                  return;
                }
                // builderImg = getBuilderImage(selProd.images);
                builderImg = getBuilderImage(selProd.builderImage);
                inStock = checkInStock(selProd.id);
                if (
                  (!inStock && builderImg) ||
                  (inStock && builderImg == undefined) ||
                  (!inStock && !builderImg)
                ) {
                  checkNextProdInStock();
                } else {
                  if (builderImg && inStock) {
                    if (
                      addedBottomCollections.indexOf(collection.collection_id) ==
                      -1
                    ) {
                      addedBottomCollections.push(collection.collection_id);
                    } else {
                      return;
                    }
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
                    $(".bottom-product-slider").owlCarousel("add", bottomHtml);
                    bottomCnt++;
                  }
                }
              }
            }
            if (
              (!inStock && builderImg) ||
              (inStock && builderImg == undefined) ||
              (!inStock && !builderImg)
            ) {
              checkNextProdInStock();
            } else {
              if (builderImg && inStock) {
                if (
                  addedBottomCollections.indexOf(collection.collection_id) == -1
                ) {
                  addedBottomCollections.push(collection.collection_id);
                } else {
                  return;
                }
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
                $(".bottom-product-slider").owlCarousel("add", bottomHtml);
                bottomCnt++;
              }
            }
            break;
          }
        }
      }
    });

    if (bottomCnt <= 1) {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: false,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true,
            stagePadding: 80
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").addClass("owl-nav-hidden");
    } else {
      $(".bottom-product-slider").trigger("destroy.owl.carousel");
      var $owl = $(".bottom-product-slider").owlCarousel({
        center: true,
        items: 3,
        nav: true,
        dot: false,
        loop: enableLoop,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsive: {
          0: {
            items: 1,
            margin: 10,
            touchDrag: true,
            stagePadding: 80
          },
          600: {
            items: 3
          },
          1000: {
            items: 3
          }
        },
        navText: [
          '<img src="' + remote_url + '/public/images/prev.png">',
          '<img src="' + remote_url + '/public/images/next.png">'
        ]
      });
      $owl.trigger("refresh.owl.carousel");
      $(".bottom-product-slider .owl-nav").removeClass("owl-nav-hidden");
    }
    setBottomCollName();
  }

  setTimeout(() => {
    var topPrice = $(".top-style-details-container .product-price").text();
    if (topPrice) {
      topPrice = topPrice.split("-")[1].split(" Rs.")[0];
    } else {
      topPrice = 0;
    }

    var bottomPrice = $(
      ".bottom-style-details-container .product-price"
    ).text();

    if (bottomPrice) {
      bottomPrice = bottomPrice.split("-")[1].split(" Rs.")[0];
    } else {
      bottomPrice = 0;
    }

    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    // totalPrice = totalPrice.toFixed(2);
    totalPrice = Math.round(totalPrice * 100) / 100;
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }, 100);
}

//Set top product details in side menu.
function setTopCollName() {
  var totalPrice = 0;
  var totSlides = $(".top-product-slider .owl-item").length;
  var ele = $(".top-product-slider .owl-item.center").find("img");

  var curSlideColID = $(ele).data("collectionid");
  var styleid = $(ele).data("styleid");
  var selCol = getCollection(curSlideColID);
  var style = getStyleById(styleid);
  var currSwatch = $(ele).attr("data-currswatch");
  var prodid = $(ele).attr("data-prodid");
  var currSize = $(ele).attr("data-currsize");
  if (selCol) {
    // $(".top-style-details-container .collection-title").text(selCol.title);
    $(".top-style-details-container .collection-title").text(style.style_name);
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
        var active = false;

        currentTopProduct = selProd;
        active = true;

        var sizeText = getSizeVariants(selProd.variants, currSize);
        $(".top-style-details-container .size-variants").html(sizeText);

        swatchText = getProductSwatches(
          selCol.handle,
          selProd.tags,
          selProd.id,
          currSwatch,
          styleid,
          "top",
          selCol.title
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
    var topPrice = $(".top-style-details-container .product-price").text();

    if (topPrice) {
      topPrice = topPrice.split("-")[1].split(" Rs.")[0];
    } else {
      topPrice = 0;
    }

    var bottomPrice = $(
      ".bottom-style-details-container .product-price"
    ).text();
    if (bottomPrice) {
      bottomPrice = bottomPrice.split("-")[1].split(" Rs.")[0];
    } else {
      bottomPrice = 0;
    }

    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    // totalPrice = totalPrice.toFixed(2);
    totalPrice = Math.round(totalPrice * 100) / 100;
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

//Set bottom product details in side menu.
function setBottomCollName() {
  var totalPrice = 0;
  var totSlides = $(".bottom-product-slider .owl-item").length;
  var ele = $(".bottom-product-slider .owl-item.center").find("img");
  var curSlideColID = $(ele).data("collectionid");
  var styleid = $(ele).data("styleid");
  var selCol = getCollection(curSlideColID);
  var style = getStyleById(styleid);
  var currSwatch = $(ele).attr("data-currswatch");
  var currSize = $(ele).attr("data-currsize");
  var prodid = $(ele).attr("data-prodid");
  if (selCol) {
    // $(".bottom-style-details-container .collection-title").text(selCol.title);
    $(".bottom-style-details-container .collection-title").text(
      style.style_name
    );
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
          currSwatch,
          styleid,
          "bottom",
          selCol.title
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
    var topPrice = $(".top-style-details-container .product-price").text();
    if (topPrice) {
      topPrice = topPrice.split("-")[1].split(" Rs.")[0];
    } else {
      topPrice = 0;
    }

    var bottomPrice = $(
      ".bottom-style-details-container .product-price"
    ).text();

    if (bottomPrice) {
      bottomPrice = bottomPrice.split("-")[1].split(" Rs.")[0];
    } else {
      bottomPrice = 0;
    }
    totalPrice = parseInt(topPrice) + parseInt(bottomPrice);
    // totalPrice = totalPrice.toFixed(2);
    totalPrice = Math.round(totalPrice * 100) / 100;
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

//Get product swatches by using product handle.
function getProductSwatches(
  handle,
  tags,
  prodid,
  currSwatch = 0,
  styleid,
  type,
  title
) {
  var style = getStyleById(styleid);
  var products = [];
  if (type == "top") {
    products = style.top_collections[0].selected_products;
  } else {
    products = style.bottom_collections[0].selected_products;
  }

  title = title.toLowerCase().replace(/ /g, "-");
  var style = getStyleById();
  var swatch = "";
  tags = tags.split(",");
  // handle = "swatch&" + handle;
  handle = "swatch&" + title;
  var swatchTags = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (swatchTags.length > 0) {
    // swatchTags.forEach((tag, index) => {
    //   var prodHandle = tag.split("&name")[0].split("swatch&")[1];
    //   var prod = getProductByHandle(prodHandle);
    var index = 0;
    products.forEach(element => {
      var prod = getProduct(element);
      if (prod) {
        var prodHandle = prod.handle;
        var tag = getTag(swatchTags, prodHandle);
        if (prod && products.indexOf(prod.id) != -1) {
          // var builderImage = getBuilderImage(prod.images);
          var builderImage = getBuilderImage(prod.builderImage);
          var inStock = checkInStock(prod.id);
          // if (inStock) {
          if (builderImage && inStock) {
            var className = "swatch";
            if (tag == null) {
              return;
            }
            var colorText = tag.split("&name-")[1].split("&")[0];
            if (index == currSwatch) {
              className = "swatch active";
            }

            // else if (prod.id == prodid) {
            //   className = "swatch active";
            // }
            var imgName = tag.split("&print-")[1];
            var d = new Date();
            var timestamp = d.getTime();
            if (imgName) {
              var imgURL =
                "https://cdn.shopify.com/s/files/1/1219/5720/files/" +
                imgName +
                "?t=" +
                timestamp;
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
            index = index + 1;
          }
        }
      }
    });
  }
  return swatch;
}

//Get tag by handle
function getTag(tags, handle) {
  var tag = tags.filter(element => {
    if (element.toUpperCase().indexOf(handle.toUpperCase()) > -1) {
      return element;
    }
  });
  if (tag.length > 0) {
    return tag[0];
  } else {
    return null;
  }
}

//Get product color.
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

//Get kit details by using kit id.
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

//Get kit detaiks using kit name.
function getKitByName(kitname) {
  kitname = kitname.replace("_", " ");
  var kit = kits.filter(ele => {
    if (ele.kit_name.toUpperCase().indexOf(kitname.toUpperCase()) > -1) {
      return ele;
    }
  });
  if (kit) {
    return kit[0];
  } else {
    return {};
  }
}

//Get style details by using style id.
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

//Get style details by using style name.
function getStyleByName(stylename) {
  stylename = stylename.replace("_", " ");
  var style = styles.filter(ele => {
    if (ele.style_name.toUpperCase().indexOf(stylename.toUpperCase()) > -1) {
      return ele;
    }
  });
  if (style) {
    return style[0];
  } else {
    return {};
  }
}

//Get style details by using collection id and collection type.
function getStyleByCollection(collectionid, type) {
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

//Get collection details by using collection id.
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

//Check if product is in stock or not.
function checkInStock(id) {
  var product = getProduct(id);
  var variants = product.variants.filter(el => {
    return el.inventory_quantity > 0;
  });
  return variants.length > 0;
}

//Get product details by using product id.
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

//Get product details by using product handle.
function getProductByHandle(handle) {
  var prod = products.filter(ele => {
    return ele.handle == handle;
  });
  if (prod) {
    return prod[0];
  } else {
    return {};
  }
}

//Get builder image from product.
// function getBuilderImage(images) {
//   var img = images.filter(image => {
//     return image.alt == "Jozi-builder Image";
//   });
//   if (img) {
//     return img[0];
//   } else {
//     return {};
//   }
// }

function getBuilderImage(builderImage) {
  var img = {};
  if (builderImage != "") {
    img.src =
      "https://blackboughswim.applicationnexus.com/uploads/" + builderImage;
    return img;
  } else {
    return null;
  }
}

//Get product price.
function getProductPrice(selProd, currIndex) {
  if (currIndex != "" && currIndex >= 0) {
    var price = selProd.variants[currIndex].price;
    return Math.round(price * 100) / 100;
  } else {
    return 0;
  }
}

//Get Color swatches from product.
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

//Get all size variants of the shopify product.
function getSizeVariants(variants, currSize = 0) {
  var sizeText = "";
  variants.forEach((variant, index) => {
    var inStock = variant.inventory_quantity > 0;
    var className = "size-text";
    if (!inStock) {
      // return false;
      className = "size-text disabled";
    } else {
      // if (currSize != "" && index == currSize) {
      //   className = "size-text active";
      // }
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
  EnabaleDisableCartBtn();
  return sizeText;
}

//Change top product size variant on variant selection.
function changeTopSizeVariant() {
  $(".top-style-details-container .error-box").hide();
  var isDisabled =
    $(this)
      .attr("class")
      .indexOf("disabled") != -1;
  if (isDisabled) {
    return;
  }
  var selIndex = $(this).data("index");
  $(".top-style-details-container .size-text.active").removeClass("active");
  $(this).addClass("active");

  var totSlides = $(".top-product-slider .owl-item").length;
  var ele = $(".top-product-slider .owl-item.center").find("img");
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
  price = Math.round(price * 100) / 100;
  var priceText = "- " + price + " " + currencySymbol;
  $(".top-style-details-container .product-price").text(priceText);

  if (settings.placeholderBuilderDiscountType == "percentage") {
    price =
      price -
      (price / 100) * parseInt(settings.placeholderBuilderDiscountValue);
    bottomPrice =
      bottomPrice -
      (bottomPrice / 100) * parseInt(settings.placeholderBuilderDiscountValue);
  }

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  // totalPrice = totalPrice.toFixed(2);

  if (settings.placeholderBuilderDiscountType == "fixed") {
    totalPrice = totalPrice - settings.placeholderBuilderDiscountValue;
  }

  totalPrice = Math.round(totalPrice * 100) / 100;
  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);

  selectedTopvariant = selIndex;
  EnabaleDisableCartBtn();
}

//Change bottom product size variant on variant selection.
function changeBottomSizeVariant() {
  $(".bottom-style-details-container .error-box").hide();
  var isDisabled =
    $(this)
      .attr("class")
      .indexOf("disabled") != -1;
  if (isDisabled) {
    return;
  }
  var selIndex = $(this).data("index");
  $(".bottom-style-details-container .size-text.active").removeClass("active");
  $(this).addClass("active");

  var totSlides = $(".bottom-product-slider .owl-item").length;
  var ele = $(".bottom-product-slider .owl-item.center").find("img");
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
  price = Math.round(price * 100) / 100;
  var priceText = "- " + price + " " + currencySymbol;
  $(".bottom-style-details-container .product-price").text(priceText);

  if (settings.placeholderBuilderDiscountType == "percentage") {
    price =
      price -
      (price / 100) * parseInt(settings.placeholderBuilderDiscountValue);
    bottomPrice =
      bottomPrice -
      (bottomPrice / 100) * parseInt(settings.placeholderBuilderDiscountValue);
  }

  totalPrice = parseInt(price) + parseInt(bottomPrice);
  // totalPrice = totalPrice.toFixed(2);

  if (settings.placeholderBuilderDiscountType == "fixed") {
    totalPrice = totalPrice - settings.placeholderBuilderDiscountValue;
  }

  totalPrice = Math.round(totalPrice * 100) / 100;
  var totalPriceText = totalPrice + " " + currencySymbol;
  $(".btn-price-text").text(totalPriceText);
  selectedBottomvariant = selIndex;
  EnabaleDisableCartBtn();
}

//Load top product in builder on click of color swatch.
function selectTopSwatch() {
  selectedTopvariant = null;
  var selIndex = $(this).data("index");
  var prodHandle = $(this).data("prodhandle");
  var colorText = $(this).data("colortext");
  var ele = $(".top-product-slider .owl-item.center").find("img");
  var currSize = $(ele).attr("data-currsize");
  var product = products.filter(product => {
    if (product.handle.toUpperCase().indexOf(prodHandle.toUpperCase()) > -1) {
      return product;
    }
  });
  if (product.length > 0) {
    currentTopProduct = product[0];
    var sizeText = getSizeVariants(product[0].variants, currSize);
    $(".top-style-details-container .size-variants").html(sizeText);
    var tempVar = 0;
    var prodPrice = 0;
    // if (selectedBottomvariant != null) {
    //   // tempVar = selectedBottomvariant;
    //   var prodPrice = product[0].variants[currSize].price;
    // }
    var prodPrice = getProductPrice(product[0], currSize);
    var prodImages = product[0].images;
    var builderImg = "";
    // if (prodImages.length > 0) {
    //   builderImg = getBuilderImage(prodImages);
    // }
    builderImg = getBuilderImage(product[0].builderImage);
    if (builderImg) {
      var totSlides = $(".top-product-slider .owl-item").length;
      var ele = $(".top-product-slider .owl-item.center").find("img");
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
    prodPrice = Math.round(prodPrice * 100) / 100;
    var priceText = "- " + prodPrice + " " + currencySymbol;
    $(".top-style-details-container .product-price").text(priceText);

    var bottomPrice = $(
      ".bottom-style-details-container .product-price"
    ).text();

    if (bottomPrice) {
      bottomPrice = $(".bottom-style-details-container .product-price")
        .text()
        .split("-")[1]
        .split(" Rs.")[0];
    } else {
      bottomPrice = 0;
    }

    totalPrice = parseInt(prodPrice) + parseInt(bottomPrice);
    // totalPrice = totalPrice.toFixed(2);
    totalPrice = Math.round(totalPrice * 100) / 100;
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }
  $(".top-style-details-container .swatch-container .active").removeClass(
    "active"
  );
  $(this).addClass("active");
  $(".top-style-details-container .color-text").text(colorText);
  $(".top-style-details-container .size-variants a").click(
    changeTopSizeVariant
  );
  // $('.top-product-slider').slick('slickGoTo', selIndex);
}

//Load bottom product in builder on click of color swatch.
function selectBottomSwatch() {
  selectedBottomvariant = null;
  var selIndex = $(this).data("index");
  var prodHandle = $(this).data("prodhandle");
  var colorText = $(this).data("colortext");
  var ele = $(".bottom-product-slider .owl-item.center").find("img");
  var currSize = $(ele).attr("data-currsize");
  var product = products.filter(product => {
    if (product.handle.toUpperCase().indexOf(prodHandle.toUpperCase()) > -1) {
      return product;
    }
  });
  if (product.length > 0) {
    currentBottomProduct = product[0];
    var sizeText = getSizeVariants(product[0].variants, currSize);
    $(".bottom-style-details-container .size-variants").html(sizeText);
    var tempVar = 0;
    var prodPrice = 0;
    // if (selectedBottomvariant != null) {
    //   // tempVar = selectedBottomvariant;
    //   var prodPrice = product[0].variants[tempVar].price;
    // }
    var prodPrice = getProductPrice(product[0], currSize);
    var prodImages = product[0].images;
    var builderImg = "";
    // if (prodImages.length > 0) {
    //   builderImg = getBuilderImage(prodImages);
    // }
    builderImg = getBuilderImage(product[0].builderImage);
    if (builderImg) {
      var totSlides = $(".top-product-slider .owl-item").length;
      var ele = $(".bottom-product-slider .owl-item.center").find("img");
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
    prodPrice = Math.round(prodPrice * 100) / 100;
    var priceText = "- " + prodPrice + " " + currencySymbol;
    $(".bottom-style-details-container .product-price").text(priceText);

    var bottomPrice = $(".top-style-details-container .product-price").text();

    if (bottomPrice) {
      bottomPrice = $(".top-style-details-container .product-price")
        .text()
        .split("-")[1]
        .split(" Rs.")[0];
    } else {
      bottomPrice = 0;
    }

    totalPrice = parseInt(prodPrice) + parseInt(bottomPrice);
    // totalPrice = totalPrice.toFixed(2);
    totalPrice = Math.round(totalPrice * 100) / 100;
    var totalPriceText = totalPrice + " " + currencySymbol;
    $(".btn-price-text").text(totalPriceText);
  }
  $(".bottom-style-details-container .swatch-container .active").removeClass(
    "active"
  );
  $(this).addClass("active");
  $(".bottom-style-details-container .color-text").text(colorText);
  $(".bottom-style-details-container .size-variants a").click(
    changeBottomSizeVariant
  );
  // $('.bottom-product-slider').slick('slickGoTo', selIndex);
}

//Show toast message.
function showToast(msg) {
  $("#snackbar").html(msg);
  $("#snackbar").attr("class", "show");
  setTimeout(function () {
    $("#snackbar").removeClass("show");
  }, 3000);
}

//Disable add to cart button if no size variant selected.
function EnabaleDisableCartBtn() {
  if (selectedTopvariant != null && selectedBottomvariant != null) {
    $("#buy-btn").addClass("active");
    // $("#buy-btn span:first").text(settings.placeholderbuyButtonText + " - ");
    $("#buy-btn span:first").text(settings.placeholderbuyButtonText);
    $("#buy-btn .btn-price-text").show();
    // $("#buy-btn").attr("disabled", false);
  } else {
    $("#buy-btn").removeClass("active");
    $("#buy-btn span:first").text("SELECT SIZES");
    $("#buy-btn .btn-price-text").hide();
    // $("#buy-btn").attr("disabled", true);
  }
}

//Add selected products to cart.
function addToCart() {
  if (selectedTopvariant == null && selectedBottomvariant == null) {
    // alert("Please select a size for your top and bottoms.");
    $(".error-text").html("Please select a size for your top and bottoms.");
    $(".error-text").show();
    $(".top-style-details-container .error-box").show();
    $(".bottom-style-details-container .error-box").show();
    // setTimeout(function () {
    //   $('.top-style-details-container .error-box').hide()
    //   $('.bottom-style-details-container .error-box').hide()
    // }, 2000);
    return;
  } else if (selectedTopvariant != null && selectedBottomvariant == null) {
    // alert("Please select a size for your bottoms.");
    $(".error-text").html("Please select a size for your bottoms.");
    $(".error-text").show();
    $(".bottom-style-details-container .error-box").show();
    $(".top-style-details-container .error-box").hide();
    // setTimeout(function () {
    //   $('.bottom-style-details-container .error-box').hide()
    // }, 2000);
    return;
  } else if (selectedTopvariant == null && selectedBottomvariant != null) {
    // alert("Please select a size for your top.");
    $(".error-text").html("Please select a size for your top.");
    $(".error-text").show();
    $(".top-style-details-container .error-box").show();
    $(".bottom-style-details-container .error-box").hide();
    // setTimeout(function () {
    //   $('.top-style-details-container .error-box').hide()
    // }, 2000);
    return;
  }
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
          // document.location.href = "/cart";
        })
        .fail(function (xhr, status, error) {
          alert(xhr.responseJSON.description);
        });
    })
    .fail(function (xhr, status, error) {
      alert(xhr.responseJSON.description);
    });
}

//Reset all values.
function resetDefaults() {
  selectedTopProducts = [];
  selectedBottomProducts = [];
  addedTopCollections = [];
  addedBottomCollections = [];
  currentTopProduct = {};
  currentBottomProduct = {};
  selectedTopvariant = 0;
  selectedBottomvariant = 0;
  selectedTopCollections = [];
  selectedBottomCollections = [];
  unselectedTopCollections = [];
  unselectedBottomCollections = [];
  allTopCollections = [];
  allBottomCollections = [];
}

//Open collection page in new tab on click of style name.
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