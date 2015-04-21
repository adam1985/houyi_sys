define(['jquery', 'interface/ajax', 'component/tools',
        'component/template', './utility',  'model/province' ,
        './summaryChart',
        'component/jquery-migrate-1.2.1.min',
        'component/jquery-ui-1.10.3.custom.min',
        'component/bootstrap', "My97DatePicker",
    'chosen', 'validform', 'component/bootstrap-paginator'],
    function($, ajax, tools, template, utility, province, summaryChart ){

    /**
     * @fileOverview 全流程广告位运营
     * @exports controller/summary
     * @returns {function}
     */

    return function(){
        $('#area-selecter').append(template.render('area-template', {areas: province.city}));

        $(".chosen-select").chosen({
            width: "100%",
            allow_single_deselect: true,
            disable_search_threshold: 10
        });

        var datepicker = $( ".datepicker"),
            summaryForm = $("#summary-form"),
            pagesizeEle = $('#pagesize'),
            summaryBody = $('#summary-body'),
            pagelist = $('#pagelist'),
            summaryLists = $('#summary-lists'),
            url = "http://stats.wf.com/Stats/reportsum",
            ajaxDtd;

        datepicker.click(function(){
            var $this = $(this),
                config = {
                    skin:'twoer',
                    dateFmt:'yyyy-MM-dd'
                },
                isMday = $this.hasClass('mday-date');

            if(isMday){
                config = $.extend(config, {
                    el: 'cday',
                    onpicking:function(dp){
                        if(isMday){
                            var inputCal = $this.find('.mday'),
                                value = inputCal.val(),
                                newDate = dp.cal.getNewDateStr(),
                                values = [],
                                splitstr = ',';
                            if(value){
                                values = value.split(splitstr);
                            }

                            if($.inArray(newDate, values) == -1){
                                values.push(newDate);
                            }

                            inputCal.val(values.join(splitstr));
                        }

                    },
                    oncleared: function(){
                        var inputCal = $this.find('.mday');
                        inputCal.val('');
                    }
                });
            }
            WdatePicker(config);
        });

        /**
         * 表单验证
         */
        summaryForm.Validform({
            btnSubmit:"#submit-btn",
            tipSweep: true,
            showAllError: true,
            /** 自定义提示显示位置 */
            tiptype:function(msg,o,cssctl){
                var objtip=$("#err-tiper");
                if(o.type != 2 ) {
                    cssctl(objtip,o.type);
                    objtip.show().text(msg);
                } else {
                    objtip.hide();
                }
            },
            /** 验证通过之前回调 */
            beforeSubmit:function(){
                   var byhour = $('#byhour').prop('checked'),
                       pagesize = +pagesizeEle.val(),
                       getPageParam = function(page){
                           var data = summaryForm.serializeArray(), obj = {}, resData = [];

                           $.each(data, function(index, val){
                               if(obj[val.name]){
                                   obj[val.name].push(val.value);
                               } else {
                                   obj[val.name] = [val.value];
                               }
                           });

                           $.each(obj, function(key, val){
                               resData.push({
                                   name: key,
                                   value: val.join(',')
                               });
                           });

                           if(byhour){
                               resData = resData.concat([
                                   {
                                       "name": "page",
                                       "value": page
                                   },
                                   {
                                       "name": "limit",
                                       "value": pagesize
                                   },
                                   {
                                       "name": "start",
                                       "value": pagesize * ( page - 1 )
                                   }
                               ]);
                           }

                           return resData;
                       };

                   ajax({
                        url : url,
                        data : getPageParam(1),
                        dataType : 'jsonp',
                        success : function( data ){
                            var sourceDate = $.extend(true, {}, data);
                            if( data.items.length ) {
                                var items = data.items,
                                    currentPage = +data.page,
                                    totalNums = data.total,
                                    totalPages = Math.ceil( totalNums / pagesize );
                                    summaryLists.html(template.render('summary-list-template', {
                                        lists: utility.disposeSummary(items)
                                    }));

                                    summaryBody.removeClass('hide');

                                    //列表分页

                                    if(byhour){
                                        $('#summary-chart').addClass('hide').empty();

                                        if( totalPages > 1 ) {
                                            pagelist.bootstrapPaginator({
                                                bootstrapMajorVersion: 3,
                                                alignment: 'center',
                                                currentPage: currentPage,
                                                totalPages: totalPages,
                                                numberOfPages: 5,
                                                tooltipTitles: function (type, page, current) {
                                                    switch (type) {
                                                        case "first":
                                                            return "第一页";
                                                        case "prev":
                                                            return "上一页";
                                                        case "next":
                                                            return "下一页";
                                                        case "last":
                                                            return "最一页";
                                                        case "page":
                                                            return "第" + page + "页";
                                                    }
                                                },
                                                itemContainerClass: function (type, page, current) {
                                                    return (page === current) ? "active" : "pointer-cursor";
                                                },
                                                onPageClicked: function(e,originalEvent,type,page){
                                                    if( ajaxDtd ){
                                                        ajaxDtd.abort();
                                                    }

                                                    ajaxDtd = ajax({
                                                        url: url,
                                                        data: getPageParam(page),
                                                        dataType: 'jsonp',
                                                        success: function ( innerRes ) {
                                                            if( innerRes.items.length ){
                                                                summaryLists.html(template.render('summary-list-template', {
                                                                    lists: utility.disposeSummary(innerRes.items)
                                                                }));
                                                            } else {
                                                                //alert( innerRes.msg );
                                                            }

                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        summaryChart(utility.disposeSummaryChart(sourceDate.items));
                                    }

                            } else {
                                $('#summary-chart').addClass('hide').empty();
                                summaryBody.removeClass('hide');
                                summaryLists.html('<tr><td colspan="14">没有数据</td></tr>');
                                pagelist.empty();
                            }
                        }
                    });

                return false;
            }
        });

    };

});