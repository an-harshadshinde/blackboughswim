$(document).ready(function () {
    console.log("WE ARE LOADING DATA..");
    $("#top-button").toggleClass("active");
    var top_button_color = $("#top-button").css("background-color");
    document.getElementById("bottom-button").style.background = "white";
    document.getElementById("bottom-button").style.color = top_button_color;
    document.getElementById("top-button").style.background = top_button_color;
    document.getElementById("top-button").style.color = "white";
    $("#bottom_products").hide();
    $("#top_products").show();
    var top_button_color = $("#top-button").css("background-color");
    console.log(top_button_color);
    $(".category-dropdown li:first-child").hide();
    $(".category-dropdown li a").parents(".dropdown").find('.btn').html($(".category-dropdown li:first-child").text());

    console.log($("#dropdownMenuButton").text());
    var category = ($("#dropdownMenuButton").text()).trim();
    $("#top-button").addClass("active");
    $("#bottom-button").removeClass("active");
    $.get('/category/' + category + '/tops', function (data, response) {
        var html = "";
        var productData = data;
        //console.log(productData);
        if (productData instanceof Array) {
            for (var i = 0; i < productData.length; i++) {
                html += "<div class='col-md-4 col-6 col-lg-3 image-class'><img src = '" + productData[i]['img'] + "' class='img-responsive' data-id='" + productData[i]['product_id'] + "' data-type='" + productData[i]['product_type'] + "' data-name='" + productData[i]['product_name'] + "' data-price='" + productData[i]['product_price'] + "' alt = 'Generic placeholder thumbnail'></div>";
            }
        }
        $("#bottom_products").html("");
        $("#bottom_products").hide();
        $("#top_products").html("");
        $("#top_products").html(html);
        $("#top_products").show();
    });

    document.getElementById("bottom-button").style.background = "white";
    document.getElementById("bottom-button").style.color = "#1a1a1a";
    document.getElementById("top-button").style.background = top_button_color;
    document.getElementById("top-button").style.color = "white";
});