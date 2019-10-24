$(window).on("load", async function () {
    const sleep = ms => new Promise((r, j) => setTimeout(r, ms));

    var settings = {
        history: {
            data: []
        }
    }
    
    var normshop = 'rakuten';
    var frimashop = 'rakuma';

    function addEvents() {
        var searchBrands = $('.search.brands');
        var searchButton = $('.search.btn');
        var tasksButton = $('.tasks.btn');

        searchBrands.on('click', function () {
            //$('#detailsModal').modal('show');
        });

        tasksButton.on('click', function () {
            $('#centralModal_tasks').modal('show');
        });

        searchButton.on('click', function () {
            location.hash = '#results-search';
        });
        
        $('#centralModal_tasks').find('.modal-footer').find('button').eq(1).on('click', function() {
            var ele = $(this).parents('.modal-content.shadow').find('[action="create"]').find('input').eq(0);
            var ele2 = $(this).parents('.modal-content.shadow').find('[action="create"]').find('input').eq(1);

            var profileName = ele2.val().trim();
            if(profileName === '') {
                ele2.addClass('danger').addClass('vibration').delay(1000).queue(function() {
                  $(this).removeClass('danger').removeClass('vibration');
                  $(this).dequeue();  
                });
            } else {
               var tbody = $('table.tasks').find('tbody');
               var baseTr = tbody.find('tr.base').eq(0);
               var clone = baseTr.clone().css('display', '');

               clone.find('td > input[style="font-size: 14.4px !important; font-weight: 500 !important;"]').eq(0).val(ele.val());
               tbody.append(clone);
            }
        })
        $('svg.back').on('click', function () {
            history.back();
        });

        $('img.w-logo').on('click', function () {
            if (frimashop == 'mercari') {
                $('.card-header').removeClass('mercari');
                searchButton.removeClass('mercari');
                tasksButton.removeClass('mercari');
                $('img.w-logo').attr('src', './assets/images/rakuma-logo.png');
                frimashop = 'rakuma';
            } else if (frimashop == 'rakuma') {
                $('.card-header').addClass('mercari');
                searchButton.addClass('mercari');
                tasksButton.addClass('mercari');
                $('img.w-logo').attr('src', './assets/images/mercari-logo.svg');
                frimashop = 'mercari';
            }
        });
        $('.collapsible-header.frimashops').next().find('li > a').eq(0).on('click', function () {
            $('.card-header').addClass('mercari');
            searchButton.addClass('mercari');
            tasksButton.addClass('mercari');
            $('img.w-logo').attr('src', './assets/images/mercari-logo.svg');
            frimashop = 'mercari';
        });
        $('.collapsible-header.frimashops').next().find('li > a').eq(1).on('click', function () {
            $('.card-header').removeClass('mercari');
            searchButton.removeClass('mercari');
            tasksButton.removeClass('mercari');
            $('img.w-logo').attr('src', './assets/images/rakuma-logo.png');
            frimashop = 'rakuma';
        });
        $('.search.brands').find('select').on('focus', function() {
            alert(1);
        });

        (async function () {
            for (; ;) {
                await sleep(5000);

                var clone = $('p.typing_txt').clone();

                $('p.typing_txt').remove();
                $('.typing_anim').append(clone);
            }
        })();
        (async function () {
          var d = [false, false, false, false];
          for (;;) {
              await sleep(100);

              if(d[0] != true && $('.select-wrapper.mdb-select').length != 0) {
                var ul = $('.search.categories').find('ul');
                var select = $('.search.categories').find('select');

                var branches = select.find('optgroup.branch');

                var groupSpanList = ul.find('li.optgroup > span');
                
                var groupSpan = null, optionSpan = null;

                groupSpanList.each((i, v) => {
                  var elem = $(v);
                  branches.each((i_, v_) => {
                    var elem_ = $(v_);
                    if(elem.text() === elem_.attr('label')) {
                      groupSpan = elem;
                      optionSpan = groupSpan.parent().next().children().eq(0);
                      groupSpan.attr('style', 'margin-left: 0');
                      optionSpan.attr('style', 'margin-left: 10px');
                    }
                  });
                });
                
                d[0] = true;
              }
          }
      })();
        window.invokeQueues = [

        ];
    }

    function addRoutes() {
        var pages = $('[class^="page-"]');

        var ctx = {
            data: []
        };

        function hash(hash, callback) {
            ctx.data.push({
                hash: hash,
                callback: callback
            });
        };

        $(window).on('hashchange', () => {
            var hash = location.hash;

            ctx.data.some(v => {
                if (v.hash === hash) {
                    v.callback();
                    return true;
                }

            });
        });

        hash('', index);
        hash('#brands', brands);
        hash('#results-search', results_search);
        hash('#page-tasks', tasks);
        hash('#page-settings_history', settings_history);

        {
            var hash = location.hash;

            ctx.data.some(v => {
                if (v.hash === hash) {
                    v.callback();
                    return true;
                }

            });
        }

        function switchProc(cname) {
            pages.each((i, v) => {
                var elem = $(v);
                if (elem.attr('class') !== cname) {
                    elem.hide();
                } else {
                    if (elem.attr('class') === 'page-index') {
                        $('div.text-white').addClass('option2');
                        $('div.text-white').removeClass('option1');
                        $('svg.back').hide();
                    }
                    else {
                        $('div.text-white').removeClass('option2');
                        $('div.text-white').addClass('option1');
                        $('svg.back').show();
                    }
                    elem.show();
                }
            });
        }

        function changeTitle(text) {
            var elem = $('div.text-white > span');
            elem.text(text);
        }

        function index() {
            var cname = "page-index";

            changeTitle('ホーム');
            switchProc(cname);
        }

        function brands() {
            var cname = "page-brands";

            changeTitle('ブランド');
            switchProc(cname);
        }

        function tasks() {
            var cname = 'page-tasks';

            changeTitle('タスク');
            switchProc(cname);
        }

        function settings_history() {
            var cname = 'page-settings_history';

            changeTitle('検索履歴');
            switchProc(cname);
        }

        function results_search() {
            var cname = "page-results_search";

            changeTitle('検索結果');
            switchProc(cname);

            var url = 'http://localhost/frink/api/?frimashop=' + frimashop + '&query=' + $('.search.keywords').val() + '&base_amount=' + $('.search.base_amount').find('input').val() +
            //var url = 'http://api.luckle.cf/?frimashop=' + frimashop + '&query=' + $('.search.keywords').val() + '&base_amount=' + $('.search.base_amount').find('input').val() +
                '&brands=' + ($('.search.brands').find('select').val() === '-1' ? '' : $('.search.brands').find('select').val()) + '&categories=' + $('.search.categories').find('select').val();
            $.ajax({
                url: url,
                dataType: 'html',
                xhrFields: {
                    withCredentials: true,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                // 通信成功時処理
                success: function (result) {
                    var res = JSON.parse(result);
                    var obj = res['response'];

                    var item_element = $('div.item').eq(0);

                    $('div.item').each((v, o) => {
                        if (v >= 1)
                            o.remove();
                    });

                    if (frimashop == 'mercari') {
                        obj.forEach(v => {
                            var extra = v['extra'];
                            var item = v['item'];

                            var item_name = item['item_name'];
                            var img_url = item['thumbnails'][0];
                            var pc_url = 'https://item.mercari.com/jp/' + item['id'] + '/';
                            var price = item['price'];
                            var diffPrice = extra['diff'];

                            var fmt_price = new Intl.NumberFormat('ja-JP').format(price);
                            var fmt_diffPrice = new Intl.NumberFormat('ja-JP', {
                                style: 'currency',
                                currency: 'JPY'
                            }).format(diffPrice);

                            var clone = item_element.clone().css('display', '');

                            clone.find('.link_search_title > span').text(item_name);
                            clone.find('img').attr('src', img_url);
                            clone.find('[itemprop="price"]').attr('data-content', price).text(
                                fmt_price);

                            if (Math.sign(diffPrice) == 1)
                                clone.find('[itemprop="price_diff"]').text('(' +
                                    ('+' + fmt_diffPrice) + ')'
                                ).css('color', 'red');
                            else if (Math.sign(diffPrice) == -1)
                                clone.find('[itemprop="price_diff"]').text('(' +
                                    ('' + fmt_diffPrice) + ')'
                                ).css('color', 'green');

                            clone.find('.link_search_title').attr('href', pc_url);
                            clone.find('.item-box__image-wrapper > a').attr('href', pc_url);

                            $('.view_grid').append(clone);
                        });
                    } else if (frimashop == 'rakuma') {
                        obj.forEach(v => {
                            var extra = v['extra'];
                            var item = v['item'];

                            var item_name = item['item_name'];
                            var img_url = item['img_url'];
                            var pc_url = item['pc_url'];
                            var price = item['price'];
                            var diffPrice = extra['diff'];

                            var fmt_price = new Intl.NumberFormat('ja-JP').format(price);
                            var fmt_diffPrice = new Intl.NumberFormat('ja-JP', {
                                style: 'currency',
                                currency: 'JPY'
                            }).format(diffPrice);

                            var clone = item_element.clone().css('display', '');

                            clone.find('.link_search_title > span').text(item_name);
                            clone.find('img').attr('src', img_url);
                            clone.find('[itemprop="price"]').attr('data-content', price).text(
                                fmt_price);

                            if (Math.sign(diffPrice) == 1)
                                clone.find('[itemprop="price_diff"]').text('(' +
                                    ('+' + fmt_diffPrice) + ')'
                                ).css('color', 'red');
                            else if (Math.sign(diffPrice) == -1)
                                clone.find('[itemprop="price_diff"]').text('(' +
                                    ('' + fmt_diffPrice) + ')'
                                ).css('color', 'green');

                            clone.find('.link_search_title').attr('href', pc_url);
                            clone.find('.item-box__image-wrapper > a').attr('href', pc_url);

                            $('.view_grid').append(clone);
                        });
                    }

                    settings.history.data.push({
                        url: url,
                        date: new Date()
                    });

                    var fmtd = settings.history.data.slice(-1)[0].date.toLocaleDateString('ja').replace('/', '-').replace('/', '-').replace('/', '-');
                    var fmta = fmtd.split('-');

                    fmta[1] = ('0' + parseInt(fmta[1])).slice(-2);
                    fmta[2] = ('0' + parseInt(fmta[2])).slice(-2);

                    var li = $('.page-settings_history').find('li').eq(0).clone().css('display', '');
                    li.find('.keywords').text(new URLSearchParams(url).get('query'));
                    li.find('.date').html('<span>日付</span>：' + fmta.join('-'));

                    $('.page-settings_history ul').eq(0).append(li);
                },
                // 通信失敗時処理
                error: function (result) { }
            });
        }
    }

    function initData() {
        return;
        $.ajax({
            url: './assets/files/brands.html',
            dataType: 'html',
            success: function (data) {
                var dom = $(data);

                var ranges = [
                    [1, 5], // 67(ヴ)
                    [6, 15],
                    [16, 25],
                    [26, 33],
                    [34, 38],
                    [39, 53],
                    [54, 58],
                    [59, 61],
                    [62, 66],
                    [67, 68],
                ];

                ranges.forEach((v, idx) => {
                    for (var i = v[0]; i < v[1]; i++) {
                        // console.log(dom.filter('h3#1'));
                        $('#phonetic' + ('00' + idx).slice(-2) + '-ex').append(dom.filter('#' + i).next());
                    }
                });
            },
            error: function (data) {
                // error
            }
        });
    }

    async function main() {
        // implement code here like the render.js
        window.fm = {
            accounts: [{
                email: '',
                password: '',
                cookie: '',
            }]
        };
    }

    addEvents();
    addRoutes();
    initData();

    main();
});