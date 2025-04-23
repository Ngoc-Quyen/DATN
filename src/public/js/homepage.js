$(document).ready(function () {
    $('#input-search').on('input', function () {
        let query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                method: 'POST',
                url: `${window.location.origin}/api/search`,
                data: { query: query },
                success: function (data) {
                    let results = data.results;
                    let htmlContent = '';
                    results.forEach((result) => {
                        htmlContent += `<div class="search-result-item">${result.name}</div>`;
                    });
                    $('#show-info-search').html(htmlContent);
                },
                error: function (err) {
                    console.log(err);
                    $('#show-info-search').html('<div class="search-result-item">Không tìm thấy kết quả</div>');
                },
            });
        } else {
            $('#show-info-search').html('');
        }
    });
    $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<i class="fa fa-angle-left prev-custom t-90"></i>',
        nextArrow: '<i class="fa fa-angle-right next-custom t-90"></i>',
    });

    $('.slider-nav-doctor').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<i class="fa fa-angle-left prev-custom t-120"></i>',
        nextArrow: '<i class="fa fa-angle-right next-custom t-120"></i>',
    });

    $('.slider-nav-posts').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<i class="fa fa-angle-left prev-custom"></i>',
        nextArrow: '<i class="fa fa-angle-right next-custom"></i>',
    });

    $('.menu-nav').on('click', function (e) {
        $('.home-nav').css('display', 'block');
    });

    $(document).mouseup(function (e) {
        var container = $('.home-nav');

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });
});
