define(['jquery', 'component/template', 'component/tools'],  function($, template, tools){

    /**
     * @fileOverview 专门处理图表数据转换与控制页面UI组件显示
     * @exports controller/utility
     * @enum {function}
     */

    /**
     * 控制下拉框是否可以用
     * @param {Element} ele - 当前元素
     * @param {string} state - 当前状态
     */
    var changeComponentState = function (ele, state) {
        ele = $(ele);

        if (state === 'disabled') {
            ele.attr('disabled', 'disabled');
        } else if (state === 'able') {
            ele.removeAttr('disabled');
            ele.removeAttr('ignore');

        }

        ele.trigger("chosen:updated");

        /*ele.chosen({
             width: "254px",
             allow_single_deselect: true,
             disable_search_threshold: 10,
             no_results_text: "没有找到任何结果!"
         });*/
    };


    /**
     * 控制过滤条件显示与隐藏，包括数据处理与转换工作
     * @param {string} type - 图表类型
     * @param {object} option - 验证规则单元集合
     */
    var renderFilterUnit = function (type, option) {
        var copyFilterUnit = JSON.parse($.data(document.body, 'filter-unit'));
        var filtUnit = option[type] || [];

        $.each(filtUnit, function (key, val) {

            if( val.show === true ) {
                copyFilterUnit[key].hide = false;
            }

            //copyFilterUnit[key].dataSource.unshift({"text":"明细","value":"-10"});

            if (val.value) {
                var value = val.value, valueList = [];
                if ($.type(value) == 'object') {

                    /** 这里是联动验证，坑人~~ */
                    $(document).on('change', '#' + key + '-selecter', function (e, option) {
                        var targetUnit = value[option.selected];
                        if (targetUnit.ableList) {
                            $.each(targetUnit.ableList, function (i, val2) {
                                changeComponentState($('#' + val2 + '-selecter'), 'able');
                            });
                        }
                        if (targetUnit.disableList) {
                            $.each(targetUnit.disableList, function (i, val2) {
                                changeComponentState($('#' + val2 + '-selecter'), 'disabled');
                            });
                        }

                    });

                    $.each(value, function (key1, val1) {
                        valueList.push(+key1);
                    });

                } else {
                    valueList = value;
                }


                /** 以下是关键部分的数据处理 */
                var dataSource = copyFilterUnit[key].dataSource, data = [];
                $.each(dataSource, function (index, target) {
                    if ($.inArray(+target.value, valueList) != -1) {
                        data.push(target);
                    }
                });
                copyFilterUnit[key].options = data;

            } else {
                copyFilterUnit[key].options = copyFilterUnit[key].dataSource;
            }

            if (val.required) {
                copyFilterUnit[key].required = val.required;
            }

            if( val.datatype ){
                copyFilterUnit[key].datatype = val.datatype;
            }

            copyFilterUnit[key].disabled = !val.able;

            if( val.fn ) {
               copyFilterUnit[key].fn = val.fn;
            }

        });


        /** 最后部分是渲染模板，加载初化始控件 */
        $('#filter-unit').html(template.render('filter-unit-template', {
            data: copyFilterUnit
        }));

        $.each(copyFilterUnit, function(key, val){
           if( val.fn ){
               val.fn( changeComponentState );
           }
        });

        $('.chosen-select').chosen({
            width: "99%",
            allow_single_deselect: true,
            search_contains : true,
            disable_search_threshold: 10,
            no_results_text: "没有找到任何结果!"
        });

    };

    /**
     * 处理serializeArray数据
     * @param params － 待处理form参数
     * @returns {Array}
     */
    var disposeParam = function (params) {
        var obj = {}, arr = [];
        $.each(params, function (i, v) {
            if (obj[v.name]) {
                obj[v.name].push(v.value);
            } else {
                obj[v.name] = [v.value];
            }
        });

        $.each(obj, function (key, val) {
            arr.push({
                name: key,
                value: val.join('|')
            });
        });

        return arr;

    };

    /**
     * 把后台接口数据转换成图表所需的数据格式
     * @param {object} data - 待转换的数据
     * @param {string} type - 图表类型
     * @param {boolean} isDay - 是否为按天查询
     * @returns {Array}
     */
    var disposeData = function (data, type, isDay) {
        var dataList = [], obj = {};
        $.each(data, function (i, v) {
            var date = new Date(v.day.replace(/\D/g, '/')), dateStr;
            if( isDay ) {
                dateStr = v.day;
            } else {
                dateStr = v.day + v.hour;
                date.setHours(v.hour);
            }

            if (!obj[dateStr]) {
                obj[dateStr] = {};
            }
            obj[dateStr].date = date;
            var multiple = false, legend = '';
            if( isDay ) {

                $.each(v, function(key, val){
                    if(key != 'day' && key != type) {
                        if( val && val != -1 ) {
                            legend += val;
                        }
                    }
                });

            } else {
                $.each(v, function(key, val){
                    if(key == 'area' || key == 'adid') {
                        if( val && val != -1 ) {
                            legend += val;
                        }
                    }
                });

            }

            obj[dateStr][legend ? legend : '-1'] = v[type];

        });

        $.each(obj, function (key, v) {
            dataList.push(v);
        });

        return dataList;

    };

    /**
     * 把后台接口数据转换成图表所需的数据格式
     * @param {object} data - 待转换的数据
     * @returns {Array}
     */
    var disposeSummaryChart = function (data) {
        var dataList = [], obj = {}, filter = {
            'active': '报活',
            'play_sum': '播放量',
            'try_display': '尝试协商数',
            'display': '成功协商数',
            'try_consu': '尝试展现数',
            'consu': '成功展现数',
            'store_rate': '库存转化率',
            'consu_rate': '协商成功率',
            'display_rate': '展现成功率'
        },
        getValueAxis = function(name){
            var valueAxisDes = 'left', filterKey = (function(){
                 var filterKey_ = '';
                $.each(filter, function(key, val){
                    if(val == name){
                        filterKey_ = key;
                    }
                });
                return filterKey_;
            }());

            if($.inArray(filterKey, ['store_rate', 'consu_rate', 'display_rate'])  > -1){
                valueAxisDes = 'right';
            }

            return valueAxisDes;

        };
        $.each(data, function (i, v) {
            var dateStr = v.date, date = new Date(dateStr.replace(/\D/g, '/'));

            if (!obj[dateStr]) {
                obj[dateStr] = {};
            }
            obj[dateStr].date = date;

            $.each(v, function(key, val){
                if($.inArray( key, Object.keys(filter) ) > -1) {
                    if( val && val != -1 ) {
                        obj[dateStr][filter[key]] = +val.toString().replace(/%$/, '');
                    }
                }
            });

        });

        $.each(obj, function (key, v) {
            dataList.push(v);
        });

        return {
            getValueAxis: getValueAxis,
            dataList: dataList
        };

    };

    /**
     * 处理summary
     * @param data － 待处理data
     * @returns {Array}
     */

    var disposeSummary = function(data){
            var summaryTips = {
                    area: {
                        "-1" : "全国"
                    },
                    plt: {
                        "-1": "全部",
                        "3": "网页",
                        "10":"在线",
                        "11": "无线"
                    },
                    posi: {
                        "-1": "全部",
                        "1": "前播",
                        "2": "中播",
                        "5": "角标"
                    }

                };

        $.each(data, function(index, val){
            if(val){
                $.each(val, function(key, value){
                    if($.isNumeric(value)){
                        data[index][key] = formatNumber(value, true);
                    }

                    if( summaryTips[key] && summaryTips[key][value] ){
                        data[index][key] = summaryTips[key][value];
                    }
                });
            }
        });

        return data;
    };

    /**
     * 处理时间间隔
     * @param data － 待处理data
     * @returns {Array}
     */
    var disposeTask = function( data ){
        data = data || [];
        // 0/任务执行中,1/数据结果生成中,2/任务完成 -1/任务失败,-2/生成结果集失败
        var statusTxt = {
                "0" : {"text": "任务执行中", "cls" : "yellow"},
                "1" : {"text": "数据结果生成中", "cls" : "yellow"},
                "2" : {"text": "任务完成", "cls" : "green"},
                "-1" : {"text": "任务失败", "cls" : "red"},
                "-2" : {"text": "生成结果集失败", "cls" : "red"}
            };
        $.each(data, function (index, val) {
            var startDate = new Date(val.start_day.replace(/\D/g, '/')),
                endDate = new Date(val.end_day.replace(/\D/g, '/')),
                startMilli = startDate.getTime(),
                endMilli = endDate.getTime(),
                dayMilli = 24 * 60 * 60 * 1000,
                status = val.status,
                intervalDay = Math.round( ( endMilli - startMilli ) / dayMilli ),
                dateran = '';


                if( startDate.getTime() >= endDate.getTime()) {
                    dateran = val.start_day;
                } else {
                    dateran = val.start_day + '至' + val.end_day;
                }

                data[index].dateran = dateran;

                if( intervalDay <= 0) {
                    data[index].interval = "一天";
                } else if( intervalDay <= 7 ) {
                    data[index].interval = "一周";
                } else if( intervalDay <= 14 ){
                    data[index].interval = "两周";
                } else if( intervalDay <= 21 ) {
                    data[index].interval = "三周";
                } else if( intervalDay <= 28 ) {
                    data[index].interval = "四周";
                } else {
                    data[index].interval = "一个月";
                }
            data[index].statusTxt = statusTxt[status];
            data[index].date = startDate.format('yyyy年MM月');
        });

        return data;
    };


    var matchOption = {
        "day": "时间", "area": "城市", "ad_id" : "广告id",
        "adid" : "广告id", "mgs_id" : "媒介组id",
        "a_ags_id" :  "地域组id", "m_id" : "物料id",
        "type": "请求类型",
        "po": "广告位置",
        "posi": "广告位置",
        "plt": "平台类型",
        "r_ctt": "地域组类型"
    },
    platnames = [
        {
            "value": "-10",
            "text": "平台明细"
        },
        {
            "value": "0",
            "text": "客户端"
        },
        {
            "value": "1",
            "text": "易览"
        },
        {
            "value": "2",
            "text": "网站"
        },
        {
            "value": "3",
            "text": "网站flash"
        },
        {
            "value": "4",
            "text": "无线"
        }
    ];

    /**
     * 加载dataTable表格
     * @param {jQuery} container 表格容器
     * @param {object} data - 处理好的数据用于表格展示
     * @param {boolean} isHour 是否按小时数据
     */
    var renderDataTable = function (container, data, isHour) {
        var typeSelect = $('#ty-selecter'),
            type = typeSelect.val(),
            singleData = data[0],
            theadTmps = [],
            theads = [],
            theadSorts = ["^day$", "^area$", "\\w+_id$", "^adid$", "^type$", "^po$", "^posi$", "^plt$", "^r_ctt$", type];

        var getPaltname = function( key, value ){
                if( key == 'plt' ){
                    var find = false;
                    $.each(platnames, function(i, v){
                        if( value == v.value ){
                            value = v.text;
                            find = true;
                            return false;
                        }
                    });
                    if( !find ){
                        value = '未知';
                    }

                }
                return value;
            };

        $.each(singleData, function (key, val) {
            if( val != -1 ) {
                if (key == type) {
                    var select = typeSelect[0];
                    theadTmps.push({
                        name: key,
                        value: select.options[select.selectedIndex].text
                    });
                } else {
                    theadTmps.push({
                        name: key,
                        value: matchOption[key]
                    });
                }
            }

        });

        $.each(theadSorts, function (i, v) {
            var rex = new RegExp(v);
            $.each(theadTmps, function (n, val) {
                if (rex.test(val.name) && val.value ) {
                    theads.push(val);
                    theadTmps.splice(n, 1);
                    return false;
                }
            });

        });

        var doneData = [];
        $.each(data, function(index, val){
            var arr = [];
            $.each(theadSorts, function (i, v) {
                var rex = new RegExp(v);
                $.each(val, function(key, value){
                    value = getPaltname(key, value);
                    if (rex.test(key)) {
                        if( value != -1 ){
                            if( isHour && key == 'day' ){
                                arr.push( value + ' ' + val.hour + '点' );
                            } else {
                                arr.push( value );
                            }
                        }
                        delete val[key];
                        return false;
                    }
                });
            });



            doneData.push( arr );

        });


        container.height('auto').html(template.render('multiple-id-template', {
            theads: theads
        }));

        $('#multipleTable').dataTable({
            "data": doneData,
            'bPaginate': true,
            "bProcessing": true,
            'bLengthChange': true,
            "aaSorting": [
                [ 0, "desc" ]
            ],
            "oLanguage": {
                "sProcessing": "正在加载数据...",
                'sSearch': '数据筛选:',
                "sLengthMenu": "每页显示 _MENU_ 项记录",
                "sZeroRecords": "没有符合项件的数据...",
                "sInfo": "当前数据从第 _START_ 到第 _END_ 项数据；总共有 _TOTAL_ 项记录",
                "sInfoEmpty": "显示 0 至 0 共 0 项",
                "sInfoFiltered": "(_MAX_)"
            }
        });
    };


    /**
     * 数字千分位
     * @methon formatNumber
     * @param num
     * @returns {string}
     */
    var formatNumber = function (num, isInit) {
        if (typeof num != 'number') {
            num = parseFloat(num.toString().replace(/,/g, ''));
        }

        if( num > 999 ){
            if (!isInit) {
                num = num.toFixed(2).toString();
            }

            num = num.toString();

            num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }


        return num;
    };

    return {

        renderFilterUnit : renderFilterUnit,
        disposeParam : disposeParam,
        disposeData : disposeData,
        disposeTask: disposeTask,
        renderDataTable: renderDataTable,
        changeComponentState: changeComponentState,
        disposeSummary: disposeSummary,
        disposeSummaryChart: disposeSummaryChart,
        formatNumber: formatNumber

    };
});