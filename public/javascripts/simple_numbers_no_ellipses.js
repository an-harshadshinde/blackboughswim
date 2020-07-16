/**
 *  Plug-in offers the same functionality as `simple_numbers` pagination type 
 *  (see `pagingType` option) but without ellipses.
 *
 *  See [example](http://www.gyrocode.com/articles/jquery-datatables-pagination-without-ellipses) for demonstration.
 *
 *  @name Simple Numbers - No Ellipses
 *  @summary Same pagination as 'simple_numbers' but without ellipses
 *  @author [Michael Ryvkin](http://www.gyrocode.com)
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "pagingType": "simple_numbers_no_ellipses"
 *        } );
 *    } );
 */

$.fn.DataTable.ext.pager.simple_numbers_no_ellipses = function (page, pages) {
    var numbers = [];
    var buttons = $.fn.DataTable.ext.pager.numbers_length;
    // var half = Math.floor(buttons / 2);
    var half = buttons - 1;
    // console.log("page :", page);
    // console.log("pages :", pages);
    // console.log("buttons :", buttons);
    // console.log("half :", half);
    var _range = function (len, start) {
        var end;

        if (typeof start === "undefined") {
            start = 0;
            end = len;
            // console.log("undefined start :", start);
            // console.log("end :", end);
        } else {
            end = start;
            start = len;
            // console.log("start :", start);
            // console.log("end :", end);
        }

        var out = [];
        for (var i = start; i < end; i++) {
            out.push(i);
        }

        return out;
    };


    if (pages <= buttons) {
        // console.log("Into 1st condition...");
        numbers = _range(0, pages);

    } else if (page < half) {
        // console.log("Into 2nd condition...");
        numbers = _range(0, buttons);

    } else if (page >= pages - half) {
        // console.log("Into 3rd condition...");
        numbers = _range(pages - buttons, pages);

    } else {
        // console.log("Into 4th condition...");
        numbers = _range(page - half, page + half + 1);
    }
    // console.log(numbers);
    numbers.DT_el = 'span';

    return ['previous', numbers, 'next'];
};