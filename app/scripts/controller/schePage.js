define(['jquery', 'interface/ajax', 'component/tools', 'component/template', './utility',  './drawChart' ,  'conf/filterUnit', 'conf/option', 'conf/chartType','component/jquery-migrate-1.2.1.min',
        'component/jquery-ui-1.10.3.custom.min',
        'component/bootstrap', "My97DatePicker", 'chosen', 'validform', 'component/bootstrap-paginator'],  function($, ajax, tools, template, utility, drawChart , filterUnit, option, chartType){
    /**
     * @fileOverview 任务进度查询接口
     * @exports controller/schePage
     * @returns {function}
     */

    return function(){

        $(".chosen-select").chosen({
            width: "100%",
            disable_search_threshold: 10
        });

        var scheForm = $("#sche-form"),
            pagesizeEle = $('#pagesize'),
            scheBody = $('#sche-body'),
            scheLists = $('#sche-lists'),
            url = "http://stats.wf.com/Monthjob/getList",
            ajaxDtd;

        /**
         * 表单验证
         */
        scheForm.Validform({
            btnSubmit:"#submit-btn",
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
                   ajax({
                        url : url,
                        data : scheForm.serializeArray(),
                        dataType : 'jsonp',
                        success : function( res ){
                            if( res.success ) {
                                var data = res.data,
                                    items = utility.disposeTask(data.data),
                                    currentPage = +data.page,
                                    totalNums = data.num,
                                    pagesize = pagesizeEle.val(),
                                    totalPages = Math.ceil( totalNums / pagesize );
                                if( items.length >>> 0){

                                    scheLists.html(template.render('sche-list-template', {
                                        lists: items
                                    }));

                                    scheBody.removeClass('hide');

                                    // 用户列表分页
                                    var pagelist = $('#pagelist');
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
                                                var serializeArray = scheForm.serializeArray();
                                                serializeArray.push({
                                                    "name": "page",
                                                    "value": page
                                                });

                                                if( ajaxDtd ){
                                                    ajaxDtd.abort();
                                                }

                                                ajaxDtd = ajax({
                                                    url: url,
                                                    data: serializeArray,
                                                    dataType: 'jsonp',
                                                    success: function ( innerRes ) {
                                                        if( innerRes.success ){
                                                            scheLists.html(template.render('sche-list-template', {
                                                                lists: utility.disposeTask(innerRes.data.data)
                                                            }));
                                                        } else {
                                                            alert( innerRes.msg );
                                                        }

                                                    }
                                                });
                                            }
                                        });
                                    }

                                }

                            } else {
                                alert( res.msg );
                            }
                        }
                    });

                return false;
            }
        });

    };

});