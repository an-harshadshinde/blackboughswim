var base_url = 'https://blackboughswim.applicationnexus.com';

var selected_style_collections = {
    top_collections: [],
    bottom_collections: []
};
var selected_kit_styles = [];
var selected_kit_id;
var selected_color_id;
var image_base64;

//Create stylesTable
var stylesTable = $('#stylesTable').DataTable({
    responsive: true,
    searching: true,
    paging: true,
    bFilter: false,
    bInfo: false,
    targets: 'no-sort',
    bSort: false,
    order: [],
    pagingType: 'full_numbers',
    language: {
        emptyTable: 'No Styles Added.',
        paginate: {
            previous: '<',
            next: '>',
            first: '|<',
            last: '>|',
        },
    },
});

new $.fn.dataTable.FixedHeader(stylesTable);

//Create kitsTable
var kitsTable = $('#kitsTable').DataTable({
    responsive: true,
    searching: true,
    paging: true,
    bFilter: false,
    bInfo: false,
    targets: 'no-sort',
    bSort: false,
    order: [],
    pagingType: 'full_numbers',
    language: {
        emptyTable: 'No Kits Added.',
        paginate: {
            previous: '<',
            next: '>',
            first: '|<',
            last: '>|',
        },
    },
});

new $.fn.dataTable.FixedHeader(kitsTable);

//Create productsTable
var productsTable = $('#productsTable').DataTable({
    responsive: true,
    searching: true,
    paging: true,
    bFilter: false,
    bInfo: false,
    targets: 'no-sort',
    bSort: false,
    order: [],
    pagingType: 'full_numbers',
    language: {
        emptyTable: 'No Products Added.',
        paginate: {
            previous: '<',
            next: '>',
            first: '|<',
            last: '>|',
        },
    },
});

new $.fn.dataTable.FixedHeader(productsTable);

$('.dataTables_filter').hide();
$('.dataTables_length').hide();

//Add Style Modal
var addStylesModal = document.getElementById('addStylesModal');
$("#addStylesModal").hide();

//Delete Style Modal
var deleteStyleModal = document.getElementById('deleteStyleModal');
deleteStyleModal.style.display = 'none';

//Delete Kit Modal
var deleteKitModal = document.getElementById('deleteKitModal');
deleteKitModal.style.display = 'none';

//Delete Product Modal
var deleteProductModal = document.getElementById('deleteProductModal');
deleteProductModal.style.display = 'none';

//Delete Product Modal
var addProductModal = document.getElementById('addProductModal');
$("#addProductModal").hide();

//Function to get next tab
function nextTab(elem) {
    $(elem)
        .next()
        .find('a[data-toggle="tab"]')
        .click();
}

//Function to get prev tab
function prevTab(elem) {
    $(elem)
        .prev()
        .find('a[data-toggle="tab"]')
        .click();
}

function showToast(msg) {
    $.toast().reset('all');
    $.toast({
        text: msg,
        textAlign: 'center',
        loader: false,
    });
}


$('.nav-tabs li').click(function () {
    var id = $(this).find('a').data('id');
    if (id == 'step1') {
        hide_add_style_container();
        hide_edit_style_container();
        $('#step1').show();
        $('#step2').hide();
        $('#step3').hide();
        $('#step4').hide();
        $('#complete').hide();
        loadStyles();
    } else if (id == 'step2') {
        hide_add_kit_container();
        hide_edit_kit_container();
        $('#step1').hide();
        $('#step2').show();
        $('#step3').hide();
        $('#step4').hide();
        $('#complete').hide();
        loadKits();
    } else if (id == 'step3') {
        hide_edit_product_container();
        $('#step1').hide();
        $('#step2').hide();
        $('#step3').show();
        $('#step4').hide();
        $('#complete').hide();
        loadProducts();
    } else if (id == 'step4') {
        $('#step1').hide();
        $('#step2').hide();
        $('#step3').hide();
        $('#step4').show();
        $('#complete').hide();
    } else if (id == 'step5') {
        $('#step1').hide();
        $('#step2').hide();
        $('#step3').hide();
        $('#step4').hide();
        $('#complete').show();
    }
    $($.fn.dataTable.tables(true))
        .DataTable()
        .columns.adjust()
        .responsive.recalc();
    var $active = $(this).prevAll("li");

    $active.removeClass('active');
    $active.addClass('completed');
    $(this).removeClass('disabled').addClass('active');
    // $active.next().removeClass('disabled');
    $(this).nextAll().removeClass('completed').removeClass('active').addClass('disabled');
    // nextTab($active);
});

//Load next tab
$('.next-step').click(function (e) {
    if ($(this).data('id') == 'kitsTab') {
        $('#step1').hide();
        $('#step2').show();
        loadKits();
    } else if ($(this).data('id') == 'productsTab') {
        $('#step2').hide();
        $('#step3').show();
        loadProducts();
    } else if ($(this).data('id') == 'settingsTab') {
        $('#step3').hide();
        $('#step4').show();
    } else if ($(this).data('id') == 'complete') {
        $('#step4').hide();
        $('#complete').show();
    }
    $($.fn.dataTable.tables(true))
        .DataTable()
        .columns.adjust()
        .responsive.recalc();
    var $active = $('.wizard .nav-tabs li.active');
    $active.removeClass('active');
    $active.addClass('completed');
    $active.next().removeClass('disabled');
    $active.next().addClass('active');
    nextTab($active);
});

//Load previous tab
$('.prev-step').click(function (e) {
    var $active = $('.wizard .nav-tabs li.active');
    prevTab($active);
    if ($(this).data('id') == 'stylesTab') {
        $('#step1').show();
        $('#step2').hide();
        $('#stylesTable').show();
        loadStyles();
    }
    if ($(this).data('id') == 'kitsTab') {
        $('#step2').show();
        $('#step3').hide();
        $('#kitsTable').show();
        loadKits();
    }
    if ($(this).data('id') == 'productsTab') {
        $('#step3').show();
        $('#step4').hide();
        loadProducts();
    }
    if ($(this).data('id') == 'settingsTab') {
        $('#step4').show();
        $('#complete').hide();
    }
    if ($(this).data('id') == 'previewTab') {
        $('#complete').hide();
        $('#step4').show();
    }
    $($.fn.dataTable.tables(true))
        .DataTable()
        .columns.adjust()
        .responsive.recalc();
    var $active = $('.wizard .nav-tabs li.active');
    $active.removeClass('active');
    $active.addClass('disabled');
    $active.prev().removeClass('completed');
    $active.prev().addClass('active');
});

$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    var $target = $(e.target);
    if ($target.parent().hasClass('disabled')) {
        return false;
    }
});

//read url to give image src to div
function readURL(input, isPlaceholder = false, type = '') {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // $('#blah')
            //     .attr('src', e.target.result);
            if (!isPlaceholder && type == '') {
                $('.image-window').attr('style', 'background-image: url(' + e.target.result + ');');
            } else if (isPlaceholder) {
                if (type == 'top') {
                    $('.placeholder-image-window.top').attr('style', 'background-image: url(' + e.target.result + ');');
                } else {
                    $('.placeholder-image-window.bottom').attr('style', 'background-image: url(' + e.target.result + ');');
                }
            }
            image_base64 = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/******************************Styles Section*******************************/

//Show create style container.
function show_add_style_container() {
    $('.selected-collections-container').html('');
    $('.image-window').css('background-image', 'none');
    $('#add_style_enable').attr('checked', false);
    $('#add_style_enable').prop('checked', false);
    $('#add_style_form #add_style_type').attr('checked', false);
    $('#add_style_form #add_style_type').prop('checked', false);
    $('#add_style_form #add_style_type').removeAttr('checked');
    $('#no_style_container').hide();
    $('#style_list_container').hide();
    $('#create_style_container').show();
    $('.next-prev-row').hide();
}

//Hide create style container.
function hide_add_style_container() {
    // $('#no_style_container').show();
    // $('#style_list_container').hide();
    $('#create_style_container').hide();
    $('#edit_style_container').hide();
    loadStyles();
    $('.next-prev-row').show();
}

//Hide edit style container.
function hide_edit_style_container() {
    $('#create_style_container').hide();
    $('#edit_style_container').hide();
    loadStyles();
    $('.next-prev-row').show();
}

// Load all styles from database.
function loadStyles() {
    $('#style-data-selectall').prop('checked', false);
    $.get('/styles/', function (data) {
        allStyles = data.styles;
        if (allStyles.length == 0) {
            $('#no_style_container').show();
            $('#style_list_container').hide();
            $('#stylesTable')
                .dataTable()
                .fnClearTable();
            stylesTable.clear();
        } else {
            $('#style_list_container').show();
            $('#no_style_container').hide();
            $('#stylesTableDiv').show();
            $('#stylesTable')
                .dataTable()
                .fnClearTable();
            stylesTable.clear();
            stylesTable
                .search('')
                .columns()
                .search('');
            allStyles.forEach(function (item, index) {
                var styleid = item._id;
                var link = 'https://' + item.shop + '.myshopify.com/apps/mix-match?style=' + item.style_name.replace(/ /g, "_");
                var img;
                if (item.image) {
                    img = '/uploads/' + item.image;
                } else {
                    img = '/public/images/placeholder.png';
                }

                stylesTable.row.add([
                    '<div class="checkbox checkbox-success style-data-list"><label class="table-check-container all-styles"><input type="checkbox" name="style-data-type" id="style-' + item._id + '" class="table-style_check" /><span class="checkmark"></span></label></div>',
                    '<img src="' + img + '" class="enabled image-class" />',
                    item.style_name,
                    link,
                    '<a onclick="editStyle(\'' +
                    styleid +
                    "','" +
                    item.style_name +
                    '\')" class="btn btn-primary btn-edit btn-edit-sm">Edit</a>',
                    // '<a onclick="deleteStyle(\'' + styleid + '\');" class="btn btn-primary btn-delete btn-delete-sm">Delete</a>',
                ]);
                stylesTable.draw(true);
            });
            if (allStyles.length <= 10) {
                $('#stylesTable_paginate').hide();
            } else {
                $('#stylesTable_paginate').show();
            }
        }

    });
}
loadStyles();

// Style search in table.
$('.search-style').keyup(function () {
    stylesTable.search($(this).val()).draw();
});

// Select all styles.
$(document).on('click', '#style-data-selectall', function () {
    // if ($('.style-data-list .style-data').prop('checked')) {
    //     $('.style-data-list .style-data').prop('checked', false);
    // } else {
    //     $('.style-data-list .style-data').prop('checked', true);
    // }
    var _this = this;
    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox");
    all_checkboxes.each(function () {
        $(_this).attr('checked', $(_this).is(':checked'));
        $(this).attr('checked', $(_this).is(':checked'));
        if ($(_this).is(':checked')) {
            $(_this)
                .next('.checkmark')
                .addClass('active');
            $(this)
                .next('.checkmark')
                .addClass('active');
        } else {
            $(_this)
                .next('.checkmark')
                .removeClass('active');
            $(this)
                .next('.checkmark')
                .removeClass('active');
        }
    });
});

// Select Style in table.
$(document).on('click', '.table-check-container.all-styles :checkbox', function () {
    var _this = this;
    $(this).attr('checked', $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $(this)
            .next('.checkmark')
            .addClass('active');
    } else {
        $(this)
            .next('.checkmark')
            .removeClass('active');
    }

    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox").length;
    var checked_count = $(this).closest("table").find("tbody > tr > td :checkbox:checked").length;
    var select_all_check = $(this).closest("table").find("thead > tr > th :checkbox");
    if (all_checkboxes == checked_count) {
        $(select_all_check).attr('checked', true);
        $(select_all_check)
            .next()
            .addClass('active');
    } else {
        $(select_all_check).attr('checked', false);
        $(select_all_check)
            .next()
            .removeClass('active');
    }
});

//add style into database
function add_style(shop) {
    $('#create_style_container .create-btn').html('PLEASE WAIT....');
    var form, formData, file_object, style_name, style_enable;
    form = $('#add_style_form');
    formData = new FormData();
    file_object = document.getElementById('files');
    style_name = $('#add_style_name').val();
    style_enable = $('#add_style_enable').is(':checked');
    style_type = $('#add_style_form  #add_style_type:checked').val();

    if (
        file_object != undefined &&
        style_name != '' &&
        selected_style_collections != '' &&
        style_type != undefined
    ) {
        formData.append('files', file_object.files[0]);
        var style_data = {
            shop: shop,
            style_name: style_name,
            style_enable: style_enable,
            type: style_type,
            selected_style_collections: selected_style_collections,
        };
        formData.append('style_data', JSON.stringify(style_data));
        $.ajax({
            url: base_url + '/styles/add_style',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (data.msg == 'Success') {
                    $('#add_style_name').val('');
                    $('#add_style_enable').attr('checked', false);
                    $('#files').val('');
                    selected_style_collections = {};
                    selected_style_collections.top_collections = [];
                    selected_style_collections.bottom_collections = [];
                    hide_add_style_container();
                    loadStyles();
                    showToast('Your Style has been saved.');
                } else {
                    showToast(data.msg);
                }
                $('#create_style_container .create-btn').html('CREATE');
            },
            error: function () {
                $('#create_style_container .create-btn').html('CREATE');
            }
        });
    } else {
        $('#create_style_container .create-btn').html('CREATE');
        showToast('Please fill all the details.');
    }
}

// Open edit style container and load style data.
function editStyle(style_id, stylename) {
    $('.selected-collections-container').html('');
    $('.image-window').css('background-image', 'none');
    $('#add_style_enable').attr('checked', false);
    $('#add_style_enable').prop('checked', false);
    $.post('/styles/get_style/', {
        style_id: style_id
    }, function (data) {
        data = data.style_data;
        $('#edit_style_container #add_style_name').val(data.style_name);
        var img_url = '';
        if (data.image) {
            img_url = '/uploads/' + data.image;
        } else {
            img_url = '/public/images/placeholder.png';
        }
        $('#edit_style_container .image-window').css("background-image", "url(" + img_url + ")");

        if (!data.is_enabled) {
            $('#edit_style_container #add_style_enable').attr('checked', false);
        } else {
            $('#edit_style_container #add_style_enable').attr('checked', true);
        }

        if (data.type == 'top') {
            $("#edit_style_container input[name='add_style_type'][value='top']").attr('checked', true);
            $("#edit_style_container input[name='add_style_type'][value='top']").next('.checkmark').removeClass('active');

            $("#edit_style_container input[name='add_style_type'][value='bottom']").attr('checked', false);
            $("#edit_style_container input[name='add_style_type'][value='bottom']").next('.checkmark').removeClass('active');
        } else {
            $("#edit_style_container input[name='add_style_type'][value='bottom']").attr('checked', true);
            $("#edit_style_container input[name='add_style_type'][value='bottom']").next('.checkmark').removeClass('active');

            $("#edit_style_container input[name='add_style_type'][value='top']").attr('checked', false);
            $("#edit_style_container input[name='add_style_type'][value='top']").next('.checkmark').removeClass('active');
        }

        selected_style_collections.top_collections = data.top_collections;
        selected_style_collections.bottom_collections = data.bottom_collections;
        $('#edit_style_container #add_edit_styleid').val(style_id);
        showSelectedCollections();
    });
    $('#no_style_container').hide();
    $('#style_list_container').hide();
    $('#edit_style_container').show();
    $('.next-prev-row').hide();
}

// Update style details in database.
function style_edit(shop) {
    $('#edit_style_container .create-btn').html('PLEASE WAIT....');
    form = $('#edit_style_container #edit_style_form');
    formData = new FormData();
    file_object = document.getElementById('edit_style_container').querySelector("#files");
    style_enable = $('#edit_style_container #add_style_enable').is(':checked');
    var style_id = $('#edit_style_container #add_edit_styleid').val();
    var style_name = $('#edit_style_container #add_style_name').val();
    var style_enable = $('#edit_style_container #add_style_enable').val();
    var style_type = $('#edit_style_container #add_style_type:checked').val();
    formData.append('files', file_object.files[0]);
    var style_data = {
        style_id: style_id,
        shop: shop,
        style_name: style_name,
        style_enable: style_enable,
        type: style_type,
        selected_style_collections: selected_style_collections,
    };
    formData.append('style_data', JSON.stringify(style_data));
    $.ajax({
        url: base_url + '/styles/edit_style',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            if (data.msg == 'Success') {
                $('#add_edit_style').val('add_kit');
                $('#add_edit_styleid').val('');
                $('#add_style_name').val('');
                $('#files').val('');
                $('.image-window').css(
                    'background-image',
                    "url('" + base_url + "/public/images/placeholder.png')"
                );
                $('#edit_style_container').hide();
                $('#edit_style_container .create-btn').html('SAVE');
                showToast('Your Style  been updated.');
                loadStyles();
            } else {
                $('#edit_style_container .create-btn').html('SAVE');
                showToast(data.msg);
            }
            $('.next-prev-row').show();
        },
    });
}

// Delet Style.
$('#style-action').click(function () {
    var style_array = [];
    var product_action_by = $('#style-action')
        .find('option:selected')
        .val();
    if (product_action_by == 'delete_style') {
        deleteStyleModal.style.display = 'block';
        $('.close').click(function () {
            deleteStyleModal.style.display = 'none';
        });
        var style_length = $('input:checkbox[name=style-data-type]:checked').length;
        if (style_length > 0) {
            $('.style-modal-text').text('Deleted Style cannot be recovered. Do you still want to continue?.');
            $('#delete-style-button').show();
            $('#delete-style-button').click(function () {
                $('input:checkbox[name=style-data-type]:checked').each(function () {
                    if (
                        $(this)
                        .attr('id')
                        .indexOf('style') >= 0 &&
                        $(this)
                        .attr('id')
                        .indexOf('style-data-selectall') < 0
                    ) {
                        style_array.push(
                            $(this)
                            .attr('id')
                            .split('-')[1]
                        );
                    }
                });
                $.post(
                    '/styles/delete', {
                        style_array: style_array,
                    },
                    function (data) {
                        deleteStyleModal.style.display = 'none';
                        loadStyles();
                        $('#style-action').find('option:selected').val = '';
                        $('#style-data-selectall').prop('checked', false);
                        showToast('Deleting Style in background.');
                    }
                );
            });
        } else {
            $('.style-modal-text').text('No Styles are selected.');
            $('#delete-style-button').hide();
        }
        $('#cancel-style-button').click(function () {
            deleteStyleModal.style.display = 'none';
        });
    }
});

// Show add collections/Products modal.
function loadAddProductModal(el) {
    var formid = $(el).closest('form').attr('id');
    if (formid == 'add_style_form') {
        var styleType = $("#create_style_container input[name='add_style_type']:checked").val();
    } else {
        var styleType = $("#edit_style_container input[name='add_style_type']:checked").val();
    }

    if (styleType == 'top') {
        $('.bottom-products-container').hide();
        $('.top-products-container').show();
    } else {
        $('.top-products-container').hide();
        $('.bottom-products-container').show();
    }

    $("body").addClass("modal-open");
    $("#addProductModal").show();
    $('.style-products-container').html('');
    $('#select-tops-button').addClass('active');
    $('#select-bottom-button').removeClass('active');
    $('.loader').show();
    $.post('/products/get_products/', {}, function (data) {
        var top_html = '';
        if (data.data.length > 0) {
            top_html = '<div class="accordion" id="accordionExample">';
            bottom_html = '<div class="accordion" id="accordionExample1">';
            data.data.forEach((element, ind) => {
                var collection = element.collection;
                var products = element.products.products;

                top_html +=
                    '<div class="prouct-container"><div class="row" id="heading' +
                    ind +
                    '"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="collection_check_' +
                    collection.handle + '" data-id="' + collection.id + '" class="collection_check" /><span class="checkmark"></span></label>';

                if (collection.image) {
                    top_html += '<img src="' + collection.image.src + '">';
                } else {
                    top_html += '<img src="public/images/placeholder.png">';
                }
                top_html += '<label>' + collection.title + '</label>';
                top_html +=
                    '<span class="input-group-addon"><a data-toggle="collapse" data-target="#top_' +
                    collection.handle +
                    '" aria-expanded="false" aria-controls="top_' +
                    collection.handle +
                    '"><i class="glyphicon glyphicon-chevron-down down-icon"></i><i class="glyphicon glyphicon-chevron-up up-icon"></i></a></span>';
                top_html += '</div><hr /></div>';
                top_html +=
                    '<div id="top_' +
                    collection.handle +
                    '" class="collapse" aria-labelledby="heading' +
                    ind +
                    '" data-parent="#accordionExample">';

                products.forEach(product => {
                    top_html +=
                        '<div class="row products-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="product_check_' +
                        product.handle + '" data-id="' + product.id + '" class="product_check" /><span class="checkmark"></span></label>';
                    if (product.image) {
                        top_html += '<img src="' + product.image.src + '">';
                    }
                    top_html += '<label>' + product.title + '</label>';
                    top_html += '</div><hr /></div>';
                });
                top_html += '</div></div>';

                bottom_html +=
                    '<div class="prouct-container"><div class="row" id="heading' +
                    ind +
                    '"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="collection_check_' +
                    collection.handle + '" data-id="' + collection.id + '" class="collection_check" /><span class="checkmark"></span></label>';

                if (collection.image) {
                    bottom_html += '<img src="' + collection.image.src + '">';
                } else {
                    bottom_html += '<img src="public/images/placeholder.png">';
                }
                bottom_html += '<label>' + collection.title + '</label>';
                bottom_html +=
                    '<span class="input-group-addon"><a data-toggle="collapse" data-target="#bottom_' +
                    collection.handle +
                    '" aria-expanded="false" aria-controls="bottom_' +
                    collection.handle +
                    '"><i class="glyphicon glyphicon-chevron-down down-icon"></i><i class="glyphicon glyphicon-chevron-up up-icon"></i></a></span>';
                bottom_html += '</div><hr /></div>';
                bottom_html +=
                    '<div id="bottom_' +
                    collection.handle +
                    '" class="collapse" aria-labelledby="heading' +
                    ind +
                    '" data-parent="#accordionExample1">';

                products.forEach(product => {
                    bottom_html +=
                        '<div class="row products-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="product_check_' +
                        product.handle + '" data-id="' + product.id + '" class="product_check" /><span class="checkmark"></span></label>';
                    if (product.image) {
                        bottom_html += '<img src="' + product.image.src + '">';
                    }
                    bottom_html += '<label>' + product.title + '</label>';
                    bottom_html += '</div><hr /></div>';
                });
                bottom_html += '</div></div>';
            });
            top_html += '</div>';
            bottom_html += '</div>';
        } else {
            top_html = bottom_html = '<p class="records-not-found">No records found.</p>';
        }

        $('.top-products-container .style-products-container').html(top_html);
        $('.bottom-products-container .style-products-container').html(bottom_html);
        setSelectedStyleProducts();
        $('.loader').hide();
    });
}


function setSelectedStyleProducts() {
    selected_style_collections.top_collections.forEach(collection => {
        var selProds = collection.selected_products;
        selProds.forEach(product => {
            var el = $('.top-products-container [data-id="' + product + '"]');
            el.click();
        });
    });

    selected_style_collections.bottom_collections.forEach(collection => {
        var selProds = collection.selected_products;
        selProds.forEach(product => {
            var el = $('.bottom-products-container [data-id="' + product + '"]');
            el.click();
        });
    });
}

// Search product on keypress.
var typingTimer;
$('.top-products-container #collections_search_box').on('keyup', function () {
    clearTimeout(typingTimer);
    $('.top-products-container .style-products-container').html('');
    $('.top-products-container .loader').show();
    typingTimer = setTimeout(searchTopProducts, 1000);
});

$('.bottom-products-container #collections_search_box').on('keyup', function () {
    clearTimeout(typingTimer);
    $('.bottom-products-container .style-products-container').html('');
    $('.bottom-products-container .loader').show();
    typingTimer = setTimeout(searchBottomProducts, 1000);
});

// Search Products.
function searchTopProducts() {
    var search_text = $('.top-products-container #collections_search_box').val();
    $.post('/products/get_products/', {}, function (data) {
        var html = '';
        if (data.data.length > 0) {
            var new_arr = data.data.filter(ele => {
                if (ele.collection.title.toUpperCase().indexOf(search_text.toUpperCase()) > -1) {
                    return ele;
                }
            });
            if (new_arr.length > 0) {
                html = '<div class="accordion" id="accordionExample">';
                new_arr.forEach((element, ind) => {
                    html +=
                        '<div class="prouct-container"><div class="row" id="heading' +
                        ind +
                        '"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="collection_check_' +
                        element.collection.handle + '"  data-id="' + element.collection.id + '" class="collection_check" /><span class="checkmark"></span></label>';
                    var collection = element.collection;
                    var products = element.products.products;
                    if (collection.image) {
                        html += '<img src="' + collection.image.src + '">';
                    }
                    html += '<label>' + collection.title + '</label>';
                    html +=
                        '<span class="input-group-addon"><a data-toggle="collapse" data-target="#top_' +
                        collection.handle +
                        '" aria-expanded="false" aria-controls="top_' +
                        collection.handle +
                        '"><i class="glyphicon glyphicon-chevron-down down-icon"></i><i class="glyphicon glyphicon-chevron-up up-icon"></i></a></span>';
                    html += '</div><hr /></div>';
                    html +=
                        '<div id="top_' +
                        collection.handle +
                        '" class="collapse" aria-labelledby="heading' +
                        ind +
                        '" data-parent="#accordionExample">';

                    products.forEach(product => {
                        html +=
                            '<div class="row products-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="product_check_' +
                            product.handle + '"  data-id="' + product.id + '" class="product_check" /><span class="checkmark"></span></label>';
                        if (product.image) {
                            html += '<img src="' + product.image.src + '">';
                        }
                        html += '<label>' + product.title + '</label>';
                        html += '</div><hr /></div>';
                    });
                    html += '</div></div>';
                });
                html += '</div>';
            } else {
                html += '<p class="records-not-found">No records found.</p>';
            }
        } else {
            html += '<p class="records-not-found">No records found.</p>';
        }

        $('.top-products-container .loader').hide();
        $('.top-products-container .style-products-container').html(html);
    });
}

// Search products
function searchBottomProducts() {
    var search_text = $('.bottom-products-container #collections_search_box').val();
    $.post('/products/get_products/', {}, function (data) {
        var html = '';
        if (data.data.length > 0) {
            var new_arr = data.data.filter(ele => {
                if (ele.collection.title.toUpperCase().indexOf(search_text.toUpperCase()) > -1) {
                    return ele;
                }
            });
            if (new_arr.length > 0) {
                html = '<div class="accordion" id="accordionExample1">';
                new_arr.forEach((element, ind) => {
                    html +=
                        '<div class="prouct-container"><div class="row" id="heading' +
                        ind +
                        '"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="collection_check_' +
                        element.collection.handle + '"  data-id="' + element.collection.id + '" class="collection_check" /><span class="checkmark"></span></label>';
                    var collection = element.collection;
                    var products = element.products.products;
                    if (collection.image) {
                        html += '<img src="' + collection.image.src + '">';
                    }
                    html += '<label>' + collection.title + '</label>';
                    html +=
                        '<span class="input-group-addon"><a data-toggle="collapse" data-target="#bottom_' +
                        collection.handle +
                        '" aria-expanded="false" aria-controls="bottom_' +
                        collection.handle +
                        '"><i class="glyphicon glyphicon-chevron-down down-icon"></i><i class="glyphicon glyphicon-chevron-up up-icon"></i></a></span>';
                    html += '</div><hr /></div>';
                    html +=
                        '<div id="bottom_' +
                        collection.handle +
                        '" class="collapse" aria-labelledby="heading' +
                        ind +
                        '" data-parent="#accordionExample1">';

                    products.forEach(product => {
                        html +=
                            '<div class="row products-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="product_check_' +
                            product.handle + '" data-id="' + product.id + '" class="product_check" /><span class="checkmark"></span></label>';
                        if (product.image) {
                            html += '<img src="' + product.image.src + '">';
                        }
                        html += '<label>' + product.title + '</label>';
                        html += '</div><hr /></div>';
                    });
                    html += '</div></div>';
                });
                html += '</div>';
            } else {
                html += '<p class="records-not-found">No records found.</p>';
            }
        } else {
            html += '<p class="records-not-found">No records found.</p>';
        }

        $('.bottom-products-container .loader').hide();
        $('.bottom-products-container .style-products-container').html(html);
    });
}

// Select all products in collection.
$(document).on('click', '.collection_check', function () {
    var _this = this;
    var all_checkboxes = $(this)
        .closest('.row')
        .next('.collapse')
        .find(':checkbox');
    all_checkboxes.each(function () {
        $(_this).attr('checked', $(_this).is(':checked'));
        $(this).attr('checked', $(_this).is(':checked'));
        if ($(_this).is(':checked')) {
            $(_this)
                .next('.checkmark')
                .addClass('active');
            $(this)
                .next('.checkmark')
                .addClass('active');
        } else {
            $(_this)
                .next('.checkmark')
                .removeClass('active');
            $(this)
                .next('.checkmark')
                .removeClass('active');
        }
    });
});

// Select single product in collection.
$(document).on('click', '.product_check', function () {
    $(this).attr('checked', $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $(this)
            .next('.checkmark')
            .addClass('active');
    } else {
        $(this)
            .next('.checkmark')
            .removeClass('active');
    }
    var all_checkboxes = $(this)
        .closest('.collapse')
        .find(':checkbox').length;
    var checked_count = $(this)
        .closest('.collapse')
        .find(':checkbox:checked').length;
    var collection_check = $(this)
        .closest('.collapse')
        .parent()
        .find('.collection_check');
    collection_check.each(function () {
        if (all_checkboxes == checked_count) {
            $(this).attr('checked', true);
            $(this)
                .next()
                .addClass('active');
        } else {
            $(this).attr('checked', false);
            $(this)
                .next()
                .removeClass('active');
        }
    });
});

// Show Top collections.
function showTops() {
    $('#select-bottom-button').removeClass('active');
    $('#select-tops-button').addClass('active');
    $('.bottom-products-container').hide();
    $('.top-products-container').show();
}

// Show Bottom collections.
function showBottoms() {
    $('#select-bottom-button').addClass('active');
    $('#select-tops-button').removeClass('active');
    $('.bottom-products-container').show();
    $('.top-products-container').hide();
}

// Add collections/products to style.
$('#modal-add-style-button').click(() => {
    selected_style_collections.top_collections = [];
    selected_style_collections.bottom_collections = [];
    var selected_top_collections = $('#addProductModal .top-products-container').find('.collection_check');
    var selected_bottom_collections = $('#addProductModal .bottom-products-container').find('.collection_check');
    selected_top_collections.each(function () {
        var collection_id = $(this).data('id');
        var selected_all_products = false;
        var product_total = $(this)
            .closest('.row')
            .next('.collapse')
            .find(':checkbox');
        var product_check = $(this)
            .closest('.row')
            .next('.collapse')
            .find(':checkbox:checked');

        if (product_total.length == product_check.length) {
            selected_all_products = true;
        }

        var selected_products = [];
        product_check.each(function () {
            var product_id = $(this).data('id');
            selected_products.push(product_id);
        });

        if (selected_products.length) {
            var params = {
                collection_id: collection_id,
                selected_all_products: selected_all_products,
                selected_products: selected_products
            };
            selected_style_collections.top_collections.push(params);
        }
    });
    selected_bottom_collections.each(function () {
        var collection_id = $(this).data('id');
        var selected_all_products = false;

        var product_total = $(this)
            .closest('.row')
            .next('.collapse')
            .find(':checkbox');
        var product_check = $(this)
            .closest('.row')
            .next('.collapse')
            .find(':checkbox:checked');

        if (product_total.length == product_check.length) {
            selected_all_products = true;
        }

        var selected_products = [];
        product_check.each(function () {
            var product_id = $(this).data('id');
            selected_products.push(product_id);
        });

        if (selected_products.length) {
            var params = {
                collection_id: collection_id,
                selected_all_products: selected_all_products,
                selected_products: selected_products
            };
            selected_style_collections.bottom_collections.push(params);
        }
    });
    // if (selected_style_collections.top_collections.length == 0) {
    //     showToast('Please select Top collections/products.');
    //     return false;
    // }
    // if (selected_style_collections.bottom_collections.length == 0) {
    //     showToast('Please select Bottom collections/products.');
    //     return false;
    // }
    $("body").removeClass("modal-open");
    $("#addProductModal").hide();
    showSelectedCollections();
});

// Show all selected collections.
function showSelectedCollections() {
    $('.selected-collections-container').html('');
    $('.selected-collections-loader').show();
    var html = '';
    if (selected_style_collections.top_collections.length == 0 && selected_style_collections.bottom_collections == 0) {
        html += '<div class="row"><p class="records-not-found">No collections added.</p></div>';
        $('.selected-collections-loader').hide();
        $('.selected-collections-container').html(html);
        return;
    }

    $.post('/products/get_products/', {}, function (data) {
        var shopify_collections = data.data;
        selected_style_collections.top_collections.forEach(collection => {
            var str = 'row-bottom-' + collection.collection_id;
            if (html.indexOf(str) != -1) {
                return;
            }
            var filter_array = shopify_collections.filter(element => {
                if (element.collection.id == collection.collection_id) {
                    return element;
                }
            });
            if (filter_array.length > 0) {
                var filter_collection = filter_array[0].collection;
                html += '<div class="row" id="row-top-' + collection.collection_id + '">';

                if (filter_collection.image) {
                    html += '<img src="' + filter_collection.image.src + '">';
                } else {
                    html += '<img src="public/images/placeholder.png">';
                }

                html += '<span class="collection-name">' + filter_collection.title + '</span>';
                html += '<span class="products-count-label">' + collection.selected_products.length + ' Products added in this collection</span>';
                html += '<a href="javascript:void(0)" class="float-right edit-collection-btn" data-id="' + collection.collection_id + '" data-type="top" onclick="loadAddProductModal(this);">Edit</a>';
                html += '<a href="javascript:void(0)" class="float-right delet-collection-btn" data-id="' + collection.collection_id + '" data-type="top">Delete</a>';
                html += '</div>';
            }
        });
        selected_style_collections.bottom_collections.forEach(collection => {
            var str = 'row-top-' + collection.collection_id;
            if (html.indexOf(str) != -1) {
                return;
            }
            var filter_array = shopify_collections.filter(element => {
                if (element.collection.id == collection.collection_id) {
                    return element;
                }
            });
            if (filter_array.length > 0) {
                var filter_collection = filter_array[0].collection;
                html += '<div class="row" id="row-bottom-' + collection.collection_id + '">';

                if (filter_collection.image) {
                    html += '<img src="' + filter_collection.image.src + '">';
                } else {
                    html += '<img src="public/images/placeholder.png">';
                }

                // html += '<img src="' + filter_collection.image.src + '">';
                html += '<span class="collection-name">' + filter_collection.title + '</span>';
                html += '<span class="products-count-label">' + collection.selected_products.length + ' Products added in this collection</span>';
                html += '<a href="javascript:void(0)" class="float-right edit-collection-btn" data-id="' + collection.collection_id + '" data-type="top" onclick="loadAddProductModal(this);">Edit</a>';
                html += '<a href="javascript:void(0)" class="float-right delet-collection-btn" data-id="' + collection.collection_id + '" data-type="bottom">Delete</a>';
                html += '</div>';
            }
        });
        $('.selected-collections-loader').hide();
        $('.selected-collections-container').html(html);
    });
}

// Delete collection from style.
$(document).on("click", ".delet-collection-btn", function () {
    var id = $(this).data('id');
    var type = $(this).data('type');
    if (type == 'top') {
        selected_style_collections.top_collections = $.grep(selected_style_collections.top_collections, function (e) {
            return e.collection_id != id;
        });
        $('.selected-collections-container #row-top-' + id).remove();
    } else {
        selected_style_collections.bottom_collections = $.grep(selected_style_collections.bottom_collections, function (e) {
            return e.collection_id != id;
        });
        $('.selected-collections-container #row-bottom-' + id).remove();
    }

    var allEle = $('.selected-collections-container .row');
    if (allEle.length == 0) {
        var html = '<div class="row"><p class="records-not-found">No Collections added.</p></div>';
        $('.selected-collections-container').html(html);
    }
});

// Hide collection/product modal.
$('#addProductModal #modal-cancel-btn').click(function () {
    $("body").removeClass("modal-open");
    $("#addProductModal").hide();
});

function importStyles() {
    $('#importcsvfile').click();
}

function importStyleChange() {
    ocpu.seturl("//public.opencpu.org/ocpu/library/utils/R")
    var myfile = $("#importcsvfile")[0].files[0];

    if (!myfile) {
        alert("No file selected.");
        return;
    }
    $("#submitbutton").attr("disabled", "disabled");
    var req = ocpu.call("read.csv", {
        "file": myfile,
        "header": true
    }, function (session) {
        session.getObject(function (data) {
            var arr = [];
            data.forEach((element, idx, array) => {
                var keys = Object.keys(element);
                if (keys.indexOf('style_name') == -1) {
                    showToast('Please upload valid CSV file.');
                    return;
                }
                var params = {
                    _id: element.X_id,
                    shop: element.shop,
                    style_name: element.style_name,
                    is_enabled: element.is_enabled,
                    image: element.image,
                    top_collections: JSON.parse(element.top_collections),
                    bottom_collections: JSON.parse(element.bottom_collections),
                };
                arr.push(params);
                if (idx === array.length - 1) {
                    $.post('/styles/import', {
                            shop: shopdata.shop,
                            styles: JSON.stringify(arr)
                        },
                        function (data) {
                            showToast('Styles imported successfully.');
                            loadStyles();
                        }
                    );
                }
            });
        });
    });
    req.fail(function () {
        alert("Server error: " + req.responseText);
    });
    req.always(function () {
        $("#submitbutton").removeAttr("disabled")
    });
}

function exportStyles() {
    var shop = shopdata.shop;
    $.get('/styles/export?shop=' + shop, function (data) {
        var url = 'public/exports/' + data.url;
        setTimeout(() => {
            window.open(url);
        }, 1500);
    });
}




/******************************Kits Section*******************************/

//Show create kit container.
function show_add_kit_container() {
    selected_kit_styles = [];
    $('#no_kit_container').hide();
    $('#kit_list_container').hide();
    $('#create_kit_container').show();
    $('.selected-styles-container').html('');
    $('.next-prev-row').hide();
}

//Hide create kit container.
function hide_add_kit_container() {
    $('#create_kit_container').hide();
    $('#edit_kit_container').hide();
    loadKits();
    $('.next-prev-row').show();
}

//Hide edit kit container.
function hide_edit_kit_container() {
    $('#create_kit_container').hide();
    $('#edit_kit_container').hide();
    loadKits();
    $('.next-prev-row').show();
}

// Show modal to add styles to kit.
function loadAddStylesModal() {
    $("body").addClass("modal-open");
    $("#addStylesModal").show();
    $('.all-styles-container').html('');
    $('.loader').show();

    $.get(base_url + '/styles/', {}, function (data) {
        var html = '';
        if (data.styles.length > 0) {
            data.styles.forEach((style, ind) => {
                html +=
                    '<div class="row styles-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="style_check_' +
                    style._id + '" data-id="' + style._id + '" class="style_check" /><span class="checkmark"></span></label>';
                if (style.image) {
                    html += '<img src="uploads/' + style.image + '">';
                } else {
                    html += '<img src="public/images/placeholder.png">';
                }
                html += '<label>' + style.style_name + '</label>';
                html += '</div><hr /></div>';
            });
        } else {
            html = '<p class="records-not-found">No records found.</p>';
        }

        $('.kit-styles-container .all-styles-container').html(html);
        setSelectedKitStyles();
        $('.loader').hide();
    });
}

function setSelectedKitStyles() {
    selected_kit_styles.forEach(style => {
        var el = $('.all-styles-container [data-id="' + style + '"]');
        el.click();
    });
}

// Search style on keypress.
var typingStyleTimer;
$('.kit-styles-container #styles_search_box').on('keyup', function () {
    clearTimeout(typingStyleTimer);
    $('.kit-styles-container .all-styles-container').html('');
    $('.kit-styles-container .loader').show();
    typingStyleTimer = setTimeout(searchKitStyle, 1000);
});

// Search kits.
function searchKitStyle() {
    var search_text = $('.kit-styles-container #styles_search_box').val();
    $.get('/styles/', {}, function (data) {
        var html = '';
        if (data.styles.length > 0) {
            var new_arr = data.styles.filter(ele => {
                if (ele.style_name.toUpperCase().indexOf(search_text.toUpperCase()) > -1) {
                    return ele;
                }
            });
            if (new_arr.length > 0) {
                new_arr.forEach((element, ind) => {
                    html +=
                        '<div class="row styles-row"><div class="col-md-12"><label class="check-container"><input type="checkbox" id="style_check_' +
                        element._id + '"  data-id="' + element._id + '" class="style_check" /><span class="checkmark"></span></label>';
                    if (element.image) {
                        html += '<img src="uploads/' + element.image + '">';
                    }
                    html += '<label>' + element.style_name + '</label>';
                    html += '</div><hr /></div>';
                });
            } else {
                html += '<p class="records-not-found">No records found.</p>';
            }
        } else {
            html += '<p class="records-not-found">No records found.</p>';
        }
        $('.kit-styles-container .loader').hide();
        $('.kit-styles-container .all-styles-container').html(html);
    });
}

// Select all styles.
$(document).on('click', '.style_check', function () {
    $(this).attr('checked', $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $(this)
            .next('.checkmark')
            .addClass('active');
    } else {
        $(this)
            .next('.checkmark')
            .removeClass('active');
    }
});

// Add kit to style.
$('#modal-add-kit-style-button').click(() => {
    selected_kit_styles = [];
    var selected_styles = $('#addStylesModal .all-styles-container').find('.style_check:checked');
    selected_styles.each(function () {
        var style_id = $(this).data('id');
        selected_kit_styles.push(style_id);
    });

    if (selected_kit_styles.length == 0) {
        showToast('Please select style.');
        return false;
    }
    $("body").removeClass("modal-open");
    $("#addStylesModal").hide();
    showSelectedStyles();
});

// Show selected styles.
function showSelectedStyles() {
    $('.selected-styles-container').html('');
    $('.selected-styles-loader').show();
    var html = '';
    if (selected_kit_styles.length == 0) {
        html += '<div class="row"><p class="records-not-found">No styles added.</p></div>';
        $('.selected-styles-loader').hide();
        $('.selected-styles-container').html(html);
        return;
    }

    $.get('/styles/', {}, function (data) {
        var allDBStyles = data.styles;
        selected_kit_styles.forEach(style => {
            var filter_array = allDBStyles.filter(element => {
                if (element._id == style) {
                    return element;
                }
            });
            if (filter_array.length > 0) {
                var filter_style = filter_array[0];
                var total_products = 0;
                filter_style.top_collections.forEach(collection => {
                    total_products = total_products + collection.selected_products.length;
                });
                filter_style.bottom_collections.forEach(collection => {
                    total_products = total_products + collection.selected_products.length;
                });

                html += '<div class="row" id="row-top-' + filter_style._id + '">';
                if (filter_style.image) {
                    html += '<img src="uploads/' + filter_style.image + '">';
                } else {
                    html += '<img src="public/images/placeholder.png">';
                }

                html += '<span class="collection-name">' + filter_style.style_name + '</span>';
                html += '<span class="products-count-label">' + total_products + ' Products added in this style</span>';
                html += '<a href="javascript:void(0)" class="float-right delet-style-btn" data-id="' + filter_style._id + '">Delete</a>';
                html += '</div>';
            }
        });
        $('.selected-styles-loader').hide();
        $('.selected-styles-container').html(html);
    });
}

// Delete style
$(document).on("click", ".delet-style-btn", function () {
    var id = $(this).data('id');
    selected_kit_styles = $.grep(selected_kit_styles, function (e) {
        return e != id;
    });
    $('.selected-styles-container #row-top-' + id).remove();

    var allEle = $('.selected-styles-container .row');
    if (allEle.length == 0) {
        var html = '<div class="row"><p class="records-not-found">No styles added.</p></div>';
        $('.selected-styles-container').html(html);
    }
});

//Cancel style modal
$('#addStylesModal #modal-cancel-btn').click(function () {
    $("body").removeClass("modal-open");
    $("#addStylesModal").hide();
});

//add kit into database.
function add_kit(shop) {
    $('#create_kit_container .create-btn').html('PLEASE WAIT....');
    var form, formData, file_object, style_name, style_enable;
    form = $('#add_kit_form');
    formData = new FormData();
    file_object = document.getElementById('create_kit_container').querySelector("#files");
    kit_name = $('#create_kit_container #add_kit_name').val();
    kit_description = $('#create_kit_container #add_kit_description').val();
    show_kit_name = $('#create_kit_container #add_kit_show_hide_name:checked').val();
    show_kit_description = $('#create_kit_container #add_kit_show_hide_description:checked').val();
    kit_manage_filter = $('#create_kit_container #add_style_manage_filter').is(':checked');

    if (
        file_object != undefined &&
        kit_name != '' &&
        kit_description != ''
    ) {
        formData.append('files', file_object.files[0]);
        var style_data = {
            shop: shop,
            kit_name: kit_name,
            kit_description: kit_description,
            show_kit_name: show_kit_name,
            show_kit_description: show_kit_description,
            kit_manage_filter: kit_manage_filter,
            selected_kit_styles: selected_kit_styles
        };
        formData.append('kit_data', JSON.stringify(style_data));
        $.ajax({
            url: base_url + '/kits/add_kit',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (data.msg == 'Success') {
                    $('#create_kit_container #add_kit_name').val('');
                    $('#create_kit_container #add_kit_description').val('');
                    $('#create_kit_container #add_kit_show_hide_name').attr('checked', false);
                    $('#create_kit_container #add_kit_show_hide_description').attr('checked', false);
                    $('#create_kit_container #add_style_manage_filter').attr('checked', false);
                    $('#create_kit_container #files').val('');
                    selected_kit_styles = [];
                    hide_add_kit_container();
                    loadKits();
                    $('#create_kit_container .create-btn').html('CREATE');
                    showToast('Your Kit has been saved.');
                } else {
                    $('#create_kit_container .create-btn').html('CREATE');
                    showToast(data.msg);
                }
            },
            error: function () {
                $('#create_kit_container .create-btn').html('CREATE');
            }
        });
    } else {
        $('#create_kit_container .create-btn').html('CREATE');
        showToast('Please fill all the details.');
    }
}
// Load all kits.
function loadKits() {
    $('#kit-data-selectall').prop('checked', false);
    $.get('/kits/', function (data) {
        allKits = data.kits;
        if (allKits.length == 0) {
            $('#no_kit_container').show();
            $('#kit_list_container').hide();
            $('#kitsTable')
                .dataTable()
                .fnClearTable();
            kitsTable.clear();
        } else {
            $('#kit_list_container').show();
            $('#no_kit_container').hide();
            $('#kitsTableDiv').show();
            $('#kitsTable')
                .dataTable()
                .fnClearTable();
            kitsTable.clear();
            kitsTable
                .search('')
                .columns()
                .search('');
            allKits.forEach(function (item, index) {
                var kitid = item._id;
                var link = 'https://' + item.shop + '.myshopify.com/apps/mix-match?kit=' + item.kit_name.replace(/ /g, "_");
                var img;
                if (item.image) {
                    img = '/uploads/' + item.image;
                } else {
                    img = 'public/images/placeholder.png';
                }

                kitsTable.row.add([
                    '<div class="checkbox checkbox-success kit-data-list"><label class="table-check-container all-kits"><input type="checkbox" name="kit-data-type" id="kit-' + item._id + '" class="table-kit_check" /><span class="checkmark"></span></label></div>',
                    '<img src="' + img + '" class="enabled image-class" />',
                    item.kit_name,
                    link,
                    '<a onclick="editKit(\'' +
                    kitid +
                    "','" +
                    item.kit_name +
                    '\')" class="btn btn-primary btn-edit btn-edit-sm">Edit</a>',
                    // '<a onclick="deleteKit(\'' + kitid + '\');" class="btn btn-primary btn-delete btn-delete-sm">Delete</a>',
                ]);
                kitsTable.draw(true);
            });
            if (allKits.length <= 10) {
                $('#kitsTable_paginate').hide();
            } else {
                $('#kitsTable_paginate').show();
            }
        }

    });
}

// search kits from table.
$('.search-kit').keyup(function () {
    kitsTable.search($(this).val()).draw();
});

// Select all kits.
$(document).on('click', '#kit-data-selectall', function () {
    // if ($('.style-data-list .style-data').prop('checked')) {
    //     $('.style-data-list .style-data').prop('checked', false);
    // } else {
    //     $('.style-data-list .style-data').prop('checked', true);
    // }
    var _this = this;
    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox");
    all_checkboxes.each(function () {
        $(_this).attr('checked', $(_this).is(':checked'));
        $(this).attr('checked', $(_this).is(':checked'));
        if ($(_this).is(':checked')) {
            $(_this)
                .next('.checkmark')
                .addClass('active');
            $(this)
                .next('.checkmark')
                .addClass('active');
        } else {
            $(_this)
                .next('.checkmark')
                .removeClass('active');
            $(this)
                .next('.checkmark')
                .removeClass('active');
        }
    });
});

// Select kit from table.
$(document).on('click', '.table-check-container.all-kits :checkbox', function () {
    var _this = this;
    $(this).attr('checked', $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $(this)
            .next('.checkmark')
            .addClass('active');
    } else {
        $(this)
            .next('.checkmark')
            .removeClass('active');
    }

    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox").length;
    var checked_count = $(this).closest("table").find("tbody > tr > td :checkbox:checked").length;
    var select_all_check = $(this).closest("table").find("thead > tr > th :checkbox");
    if (all_checkboxes == checked_count) {
        $(select_all_check).attr('checked', true);
        $(select_all_check)
            .next()
            .addClass('active');
    } else {
        $(select_all_check).attr('checked', false);
        $(select_all_check)
            .next()
            .removeClass('active');
    }
});

//delete kit
$('#kit-action').click(function () {
    var kit_array = [];
    var product_action_by = $('#kit-action')
        .find('option:selected')
        .val();
    if (product_action_by == 'delete_kit') {
        deleteKitModal.style.display = 'block';
        $('.close').click(function () {
            deleteKitModal.style.display = 'none';
        });
        var kit_length = $('input:checkbox[name=kit-data-type]:checked').length;
        if (kit_length > 0) {
            $('.style-modal-text').text('Deleted Kit cannot be recovered. Do you still want to continue?.');
            $('#delete-kit-button').show();
            $('#delete-kit-button').click(function () {
                $('input:checkbox[name=kit-data-type]:checked').each(function () {
                    if (
                        $(this)
                        .attr('id')
                        .indexOf('kit') >= 0 &&
                        $(this)
                        .attr('id')
                        .indexOf('kit-data-selectall') < 0
                    ) {
                        kit_array.push(
                            $(this)
                            .attr('id')
                            .split('-')[1]
                        );
                    }
                });
                $.post(
                    '/kits/delete', {
                        kit_array: kit_array,
                    },
                    function (data) {
                        deleteKitModal.style.display = 'none';
                        loadKits();
                        $('#kit-action').find('option:selected').val = '';
                        $('#kit-data-selectall').prop('checked', false);
                        showToast('Deleting Kit in background.');
                    }
                );
            });
        } else {
            $('.style-modal-text').text('No Styles are selected.');
            $('#delete-kit-button').hide();
        }
        $('#cancel-kit-button').click(function () {
            deleteKitModal.style.display = 'none';
        });
    }
});

// Edit kit
function editKit(kit_id, kit_name) {
    $('#edit_kit_container .selected-styles-container').html('');
    $('#edit_kit_container .image-window').css('background-image', 'none');

    $.post('/kits/get_kit/', {
        kit_id: kit_id
    }, function (data) {
        data = data.kit_data;
        $('#edit_kit_container #add_kit_name').val(data.kit_name);
        $('#edit_kit_container #add_kit_description').val(data.description);
        var img_url;
        if (data.image) {
            img_url = '/uploads/' + data.image;
        } else {
            img_url = '/public/images/placeholder.png';
        }

        $('#edit_kit_container .image-window').css("background-image", "url(" + img_url + ")");

        if (data.show_name != 'show') {
            $("#edit_kit_container input[name=add_kit_show_hide_name][value='hide']").attr('checked', false);
            $("#edit_kit_container input[name=add_kit_show_hide_name][value='hide']").next('.checkmark').removeClass('active');
        } else {
            $("#edit_kit_container input[name=add_kit_show_hide_name][value='show']").attr('checked', true);
            $("#edit_kit_container input[name=add_kit_show_hide_name][value='show']").next('.checkmark').addClass('active');
        }

        if (data.show_description != 'show') {
            $("#edit_kit_container input[name=add_kit_show_hide_description][value='hide']").attr('checked', false);
            $("#edit_kit_container input[name=add_kit_show_hide_description][value='hide']").next('.checkmark').removeClass('active');
        } else {
            $("#edit_kit_container input[name=add_kit_show_hide_description][value='show']").attr('checked', true);
            $("#edit_kit_container input[name=add_kit_show_hide_description][value='show']").next('.checkmark').addClass('active');
        }
        if (!data.show_filters) {
            $('#edit_kit_container #add_style_manage_filter').attr('checked', false);
        } else {
            $('#edit_kit_container #add_style_manage_filter').attr('checked', true);
        }
        selected_kit_styles = data.styles;
        $('#edit_kit_container #add_edit_kitid').val(kit_id);
        showSelectedStyles();
    });

    $('#no_kit_container').hide();
    $('#kit_list_container').hide();
    $('#edit_kit_container').show();
    $('.next-prev-row').hide();
}

// Update kit details
function kit_edit(shop) {
    $('#edit_kit_container .create-btn').html('PLEASE WAIT....');
    form = $('#edit_kit_container #edit_kit_form');
    formData = new FormData();
    file_object = document.getElementById('edit_kit_container').querySelector("#files");
    var kit_id = $('#edit_kit_container #add_edit_kitid').val();
    var kit_name = $('#edit_kit_container #add_kit_name').val();
    var kit_description = $('#edit_kit_container #add_kit_description').val();
    var add_kit_show_hide_name = $('#edit_kit_container #add_kit_show_hide_name:checked').val();
    var add_kit_show_hide_description = $('#edit_kit_container #add_kit_show_hide_description:checked').val();
    var add_style_manage_filter = $('#edit_kit_container #add_style_manage_filter').is(':checked');
    formData.append('files', file_object.files[0]);
    var kit_data = {
        kit_id: kit_id,
        shop: shop,
        kit_name: kit_name,
        kit_description: kit_description,
        add_kit_show_hide_name: add_kit_show_hide_name,
        add_kit_show_hide_description: add_kit_show_hide_description,
        add_style_manage_filter: add_style_manage_filter,
        selected_kit_styles: selected_kit_styles,
    };
    formData.append('kit_data', JSON.stringify(kit_data));
    $.ajax({
        url: base_url + '/kits/edit_kit',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            if (data.msg == 'Success') {
                $('#edit_kit_container').hide();
                $('#edit_kit_container .create-btn').html('SAVE');
                showToast('Your Kit  been updated.');
                loadKits();
            } else {
                $('#edit_kit_container .create-btn').html('SAVE');
                showToast(data.msg);
            }
            $('.next-prev-row').show();
        },
        error: function () {
            $('#edit_kit_container .create-btn').html('SAVE');
        }
    });
}

function importKits() {
    $('#importkitcsvfile').click();
}

function importKitChange() {
    ocpu.seturl("//public.opencpu.org/ocpu/library/utils/R")
    var myfile = $("#importkitcsvfile")[0].files[0];

    if (!myfile) {
        alert("No file selected.");
        return;
    }
    $("#submitbutton").attr("disabled", "disabled");
    var req = ocpu.call("read.csv", {
        "file": myfile,
        "header": true
    }, function (session) {
        session.getObject(function (data) {
            var arr = [];
            data.forEach((element, idx, array) => {
                var keys = Object.keys(element);
                if (keys.indexOf('kit_name') == -1) {
                    showToast('Please upload valid CSV file.');
                    return;
                }
                var params = {
                    _id: element.X_id,
                    shop: element.shop,
                    kit_name: element.kit_name,
                    description: element.description,
                    image: element.image,
                    show_name: element.show_name,
                    show_description: element.show_description,
                    show_filters: element.show_filters,
                    styles: JSON.parse(element.styles)
                };
                arr.push(params);
                if (idx === array.length - 1) {
                    $.post('/kits/import', {
                            shop: shopdata.shop,
                            kits: JSON.stringify(arr)
                        },
                        function (data) {
                            showToast('Kits imported successfully.');
                            loadKits();
                        }
                    );
                }
            });
        });
    });
    req.fail(function () {
        alert("Server error: " + req.responseText);
    });
    req.always(function () {
        $("#submitbutton").removeAttr("disabled")
    });
}

function exportKits() {
    var shop = shopdata.shop;
    $.get('/kits/export?shop=' + shop, function (data) {
        var url = 'public/exports/' + data.url;
        setTimeout(() => {
            window.open(url);
        }, 1500);
    });
}

/******************************Products Section*******************************/

// Load all products.
function loadProducts(page = 0, searchText = '') {
    $('.products-loader').show();
    $('#product-data-selectall').prop('checked', false);
    $('.products-table-conatiner').hide();
    $.get('/products/get_all_products/', function (data) {
        var allProducts = data.products;
        $('#productsTable')
            .dataTable()
            .fnClearTable();
        productsTable.clear();
        productsTable
            .search('')
            .columns()
            .search('');
        allProducts.forEach(function (item, index) {
            var productid = item.id;
            var img;
            var images = item.images;
            var img_url = '';
            var action = "add";
            var image_id = '';
            var new_arr = images.filter(ele => {
                if (ele.alt == 'Jozi-builder Image') {
                    return ele;
                }
            });
            if (new_arr.length > 0) {
                img_url = new_arr[0].src;
                image_id = new_arr[0].id;
                action = "update";
            } else {
                if (item.image) {
                    img_url = item.image.src;
                } else {
                    img_url = 'public/images/placeholder.png';
                }
            }

            img = '<img src="' + img_url + '" class="enabled image-class" />';
            productsTable.row.add([
                '<div class="checkbox checkbox-success product-data-list"><label class="table-check-container all-products"><input type="checkbox" name="product-data-type" id="product-' + item.id + '" class="table-product_check" /><span class="checkmark"></span></label></div>',
                img,
                item.title,
                '<input type="file" id="files_' + productid + '" name="files_' + productid + '" data-prodid="' + productid + '" data-action="' + action + '" onchange="uploadProdImage(this, ' + productid + ', ' + image_id + ');" style="display: none;"><a onclick="SelectFile(' + productid + ')" class="btn btn-primary btn-edit btn-edit-sm">Upload</a>'
                // '<a onclick="editProduct(\'' +
                // productid +
                // "','" +
                // item.title +
                // '\')" class="btn btn-primary btn-edit btn-edit-sm">Edit</a>',
            ]);
            productsTable.draw(true);
        });
        if (searchText != '' && page > 0) {
            productsTable.search(searchText).draw();
            productsTable.page(page).draw('page');
        } else if (searchText != '') {
            productsTable.search(searchText).draw();
        } else if (page > 0) {
            productsTable.page(page).draw('page');
        }
        if (allProducts.length <= 10) {
            $('#productsTable_paginate').hide();
        } else {
            $('#productsTable_paginate').show();
        }
        $('.products-loader').hide();
        $('.products-table-conatiner').show();
    });
}

function SelectFile(productid) {
    $('#files_' + productid).trigger('click');
}

function uploadProdImage(file_object, product_id, img_id) {
    showToast('Please wait image uploading in background.');
    readURL(file_object);
    var info = productsTable.page.info();
    var page = info.page;
    var searchText = $('#product_search_box').val();

    $.get('/products/get_all_products/', function (data) {
        var allProducts = data.products;
        var product = allProducts.filter(ele => {
            return ele.id == product_id;
        });
        if (product) {
            product = product[0];
            var shop = $('body').data('shop');
            var action = $(file_object).data('action');
            formData = new FormData();
            formData.append('files', file_object.files[0]);
            if (image_base64) {
                image_base64 = image_base64.split(';base64,')[1];
            }
            var filename = '';
            if (file_object.files && file_object.files.length > 0) {
                filename = file_object.files[0].name;
            }

            var product_data = {
                product_id: product_id,
                shop: shop,
                add_edit_product_img_action: action,
                add_edit_product_img_id: img_id,
                product_name: product.title,
                product_description: product.body_html,
                product_image_base64: image_base64,
                product_image_name: filename
            };
            formData.append('product_data', JSON.stringify(product_data));

            $.ajax({
                url: base_url + '/products/edit_product',
                data: formData,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data) {
                    if (data.msg == 'Success') {
                        showToast('Image uploaded successfully.');
                        if (page > 1) {
                            loadProducts(page, searchText);
                        } else {
                            loadProducts(page, searchText);
                        }

                    } else {
                        showToast(data.msg);
                    }
                },
                error: function (jqXHR, exception) {
                    showToast('Opps, Something went wrong. Please try again.');
                }
            });
        }
    });
}


// Search product fom table.
$('.search-product').keyup(function () {
    productsTable.search($(this).val()).draw();
});

// select all products.
$(document).on('click', '#product-data-selectall', function () {
    // if ($('.style-data-list .style-data').prop('checked')) {
    //     $('.style-data-list .style-data').prop('checked', false);
    // } else {
    //     $('.style-data-list .style-data').prop('checked', true);
    // }
    var _this = this;
    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox");
    all_checkboxes.each(function () {
        $(_this).attr('checked', $(_this).is(':checked'));
        $(this).attr('checked', $(_this).is(':checked'));
        if ($(_this).is(':checked')) {
            $(_this)
                .next('.checkmark')
                .addClass('active');
            $(this)
                .next('.checkmark')
                .addClass('active');
        } else {
            $(_this)
                .next('.checkmark')
                .removeClass('active');
            $(this)
                .next('.checkmark')
                .removeClass('active');
        }
    });
});

// select product
$(document).on('click', '.table-check-container.all-products :checkbox', function () {
    var _this = this;
    $(this).attr('checked', $(this).is(':checked'));
    if ($(this).is(':checked')) {
        $(this)
            .next('.checkmark')
            .addClass('active');
    } else {
        $(this)
            .next('.checkmark')
            .removeClass('active');
    }

    var all_checkboxes = $(this).closest("table").find("tbody > tr > td :checkbox").length;
    var checked_count = $(this).closest("table").find("tbody > tr > td :checkbox:checked").length;
    var select_all_check = $(this).closest("table").find("thead > tr > th :checkbox");
    if (all_checkboxes == checked_count) {
        $(select_all_check).attr('checked', true);
        $(select_all_check)
            .next()
            .addClass('active');
    } else {
        $(select_all_check).attr('checked', false);
        $(select_all_check)
            .next()
            .removeClass('active');
    }
});

//delete product
$('#product-action').click(function () {
    var product_array = [];
    var product_action_by = $('#product-action')
        .find('option:selected')
        .val();
    if (product_action_by == 'delete_product') {
        deleteProductModal.style.display = 'block';
        $('.close').click(function () {
            deleteProductModal.style.display = 'none';
        });
        var product_length = $('input:checkbox[name=product-data-type]:checked').length;
        if (product_length > 0) {
            $('.style-modal-text').text('Deleted Product cannot be recovered. Do you still want to continue?.');
            $('#delete-product-button').show();
            $('#delete-product-button').click(function () {
                $('input:checkbox[name=product-data-type]:checked').each(function () {
                    if (
                        $(this)
                        .attr('id')
                        .indexOf('product') >= 0 &&
                        $(this)
                        .attr('id')
                        .indexOf('product-data-selectall') < 0
                    ) {
                        product_array.push(
                            $(this)
                            .attr('id')
                            .split('-')[1]
                        );
                    }
                });
                $.post(
                    '/products/delete', {
                        product_array: product_array,
                    },
                    function (data) {
                        deleteProductModal.style.display = 'none';
                        loadProducts();
                        $('#product-action').find('option:selected').val = '';
                        $('#product-data-selectall').prop('checked', false);
                        showToast('Deleting Product in background.');
                    }
                );
            });
        } else {
            $('.style-modal-text').text('No Product are selected.');
            $('#delete-product-button').hide();
        }
        $('#cancel-product-button').click(function () {
            deleteProductModal.style.display = 'none';
        });
    }
});

// edit product
function editProduct(product_id, product_name) {
    $('#edit_product_container .image-window').css('background-image', 'none');

    $.post('/products/get_product/', {
        product_id: product_id
    }, function (data) {
        data = data.product_data;
        $('#edit_product_container #add_product_name').val(data.title);
        $('#edit_product_container #add_product_description').val(data.body_html);

        var images = data.images;
        var img_url = '';
        var add_edit_product_img_action = 'add';
        var image_id = '';
        var new_arr = images.filter(ele => {
            if (ele.alt == 'Jozi-builder Image') {
                return ele;
            }
        });
        if (new_arr.length > 0) {
            img_url = new_arr[0].src;
            image_id = new_arr[0].id;
            add_edit_product_img_action = 'update';
        } else {
            if (data.image) {
                img_url = data.image.src;
            } else {
                img_url = 'public/images/placeholder.png';
            }

        }

        $('#edit_product_container .image-window').css("background-image", "url(" + img_url + ")");

        $('#edit_product_container #add_edit_product_img_action').val(add_edit_product_img_action);
        $('#edit_product_container #add_edit_product_img_id').val(image_id);
        $('#edit_product_container #add_edit_productid').val(product_id);

    });

    $('#product_list_container').hide();
    $('#edit_product_container').show();
    $('.next-prev-row').hide();
}

// Update product details.
function product_edit(shop) {
    $('#edit_product_container .create-btn').html('PLEASE WAIT..');
    form = $('#edit_product_container #edit_product_form');
    formData = new FormData();
    file_object = document.getElementById('edit_product_container').querySelector("#files");
    var product_id = $('#edit_product_container #add_edit_productid').val();
    var add_edit_product_img_action = $('#edit_product_container #add_edit_product_img_action').val();
    var add_edit_product_img_id = $('#edit_product_container #add_edit_product_img_id').val();

    var product_name = $('#edit_product_container #add_product_name').val();
    var product_description = $('#edit_product_container #add_product_description').val();

    formData.append('files', file_object.files[0]);
    if (image_base64) {
        image_base64 = image_base64.split(';base64,')[1];
    }

    var filename = '';
    if (file_object.files && file_object.files.length > 0) {
        filename = file_object.files[0].name;
    }

    var product_data = {
        product_id: product_id,
        shop: shop,
        add_edit_product_img_action: add_edit_product_img_action,
        add_edit_product_img_id: add_edit_product_img_id,
        product_name: product_name,
        product_description: product_description,
        product_image_base64: image_base64,
        product_image_name: filename
    };
    formData.append('product_data', JSON.stringify(product_data));
    $.ajax({
        url: base_url + '/products/edit_product',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            if (data.msg == 'Success') {
                $('#edit_product_container').hide();
                showToast('Your Product  been updated.');
                $('#product_list_container').show();
                loadProducts();
            } else {
                showToast(data.msg);
            }
            $('.next-prev-row').show();
            $('#edit_product_container .create-btn').html('SAVE');
        },
        error: function (jqXHR, exception) {
            $('#edit_product_container .create-btn').html('SAVE');
        }
    });
}

//Hide edit product container.
function hide_edit_product_container() {
    $('#create_product_container').hide();
    $('#edit_product_container').hide();
    $('#product_list_container').show();
    loadProducts();
    $('.next-prev-row').show();
}

/******************************Settings Section*******************************/

//Save settings
function save_settings() {
    $('#settingListsDiv .btn-save-settings').html('PLEASE WAIT....');
    // var postdata = $('#settings_form').serialize();
    // var bg_color = $('#placeholder_bg_color').val();
    // var text_color = $('#placeholder_text_color').val();
    // var top_text = $('#top_text').val();
    // var bottom_text = $('#bottom_text').val();
    // var details_back_color = $('#placeholder_details_back_color').val();
    // var buy_btn_bg_color = $('#placeholder_buy_btn_bg_color').val();
    // var buy_btn_text_color = $('#placeholder_buy_btn_text_color').val();
    // var buy_button_text = $('#buy_button_text').val();

    // if (bg_color != '' && text_color != '' && top_text != '' && bottom_text != '' && details_back_color != '' && buy_btn_bg_color != '' && buy_btn_text_color != '' && buy_button_text != '') {
    //     $.post('/settings/save_settings', postdata, function (data) {
    //         if (data) {
    //             $('#placeholder_bg_color').val(data.placeholderbgColor);
    //             $('#placeholder_text_color').val(data.placeholderbgColor);
    //             $('#top_text').val(data.topText);
    //             $('#bottom_text').val(data.bottomText);
    //             $('#settingListsDiv .btn-save-settings').html('SAVE');
    //             showToast('Settings saved.');
    //         }
    //     });
    // } else {
    //     $('#settingListsDiv .btn-save-settings').html('SAVE');
    //     alert('All the fields are required. Please fill up all the fields');
    // }

    form = $('#settings_form');
    formData = new FormData();
    top_file_object = document.getElementById("placeholder-image-top-window").querySelector("#files");
    formData.append('top_files', top_file_object.files[0]);
    bottom_file_object = document.getElementById("placeholder-image-bottom-window").querySelector("#files");
    formData.append('bottom_files', bottom_file_object.files[0]);
    var bg_color = $('#placeholder_bg_color').val();
    var text_color = $('#placeholder_text_color').val();
    var top_text = $('#top_text').val();
    var bottom_text = $('#bottom_text').val();
    var details_back_color = $('#placeholder_details_back_color').val();
    var buy_btn_bg_color = $('#placeholder_buy_btn_bg_color').val();
    var buy_btn_text_color = $('#placeholder_buy_btn_text_color').val();
    var buy_button_text = $('#buy_button_text').val();

    var price_text_color = $('#placeholder_price_text_color').val();
    var price_text_desktop_size = $('#placeholder_price_text_desktop_size').val();
    var price_text_mobile_size = $('#placeholder_price_text_mobile_size').val();
    var builder_header_text = $('#builder_header_text').val();
    var builder_description_text = $('#builder_description_text').val();
    var builder_placeholder_top_text = $('#builder_placeholder_top_text').val();
    var builder_placeholder_bottom_text = $('#builder_placeholder_bottom_text').val();

    var settings_data = {
        placeholder_bg_color: bg_color,
        placeholder_text_color: text_color,
        top_text: top_text,
        bottom_text: bottom_text,
        placeholder_details_back_color: details_back_color,
        placeholder_buy_btn_bg_color: buy_btn_bg_color,
        placeholder_buy_btn_text_color: buy_btn_text_color,
        buy_button_text: buy_button_text,
        placeholder_price_text_color: price_text_color,
        placeholder_price_text_desktop_size: price_text_desktop_size,
        placeholder_price_text_mobile_size: price_text_mobile_size,
        builder_header_text: builder_header_text,
        builder_description_text: builder_description_text,
        builder_placeholder_top_text: builder_placeholder_top_text,
        builder_placeholder_bottom_text: builder_placeholder_bottom_text
    };
    formData.append('settings_data', JSON.stringify(settings_data));
    if (bg_color != '' && text_color != '' && top_text != '' && bottom_text != '' && details_back_color != '' && buy_btn_bg_color != '' && buy_btn_text_color != '' && buy_button_text != '', builder_placeholder_top_text != '', builder_placeholder_bottom_text != '') {
        $.ajax({
            url: base_url + '/settings/save_settings',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                $('#placeholder_bg_color').val(data.placeholderbgColor);
                $('#placeholder_text_color').val(data.placeholderbgColor);
                $('#top_text').val(data.topText);
                $('#bottom_text').val(data.bottomText);
                $('#settingListsDiv .btn-save-settings').html('SAVE');
                showToast('Settings saved.');
            },
        });
    } else {
        $('#settingListsDiv .btn-save-settings').html('SAVE');
        alert('All the fields are required. Please fill up all the fields');
    }
}

//Create randomstring to generate discount code
function randomstring(L) {
    var s = '';
    var randomchar = function () {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //1-10
        if (n < 36) return String.fromCharCode(n + 55); //A-Z
        return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < L) s += randomchar();
    return s.toUpperCase();
}

function generateCode() {
    var code = randomstring(10);
    $('#create_discount_code').val(code);
}