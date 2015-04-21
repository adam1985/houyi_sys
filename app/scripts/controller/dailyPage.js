define(['jquery', 'interface/ajax', 'component/tools', 'component/template', './utility',  './drawChart' ,  'conf/dailyFilterUnit', 'conf/dailyOption', 'conf/dailyChartType',  'component/jquery-migrate-1.2.1.min',
    'component/jquery-ui-1.10.3.custom.min',
    'component/bootstrap', "My97DatePicker", 'chosen', 'validform', 'component/dataTables.bootstrap'],  function($, ajax, tools, template, utility, drawChart , filterUnit, option, dailyChartType){

    /**
     * @fileOverview 按天统计图表处理程序
     * @exports controller/dailyPage
     * @returns {function}
     */
    return function(){

        var datepicker = $( ".datepicker"),
            styleSelecter = $('#style-slecter'),
            nowDays = new Date().getDate(),
            startTime = new Date(),
            endTime = new Date();
            startTime.setDate(nowDays - 8);
            endTime.setDate(nowDays - 1);

        /** 加载日历控件 */
        datepicker.click(function(){
            WdatePicker({
                skin:'twoer',
                dateFmt:'yyyy-MM-dd'
            });
        });

        $('.start-time').val(startTime.format('yyyy-MM-dd'));
        $('.end-time').val(endTime.format('yyyy-MM-dd'));

        /** 缓存数据 */
        $.data(document.body, 'filter-unit', JSON.stringify(filterUnit));

        $(".style-chosen-select").chosen({
            width: "99%",
            disable_search_threshold: 10
        });


        /** 联动下拉框实现 */
        $(document).on('change', '.style-chosen-select', function(e, sel){
            $('#chart-type').html(template.render('chart-type-template', {
                lists: dailyChartType[sel.selected]
            }));
            $(".init-chosen-select").chosen({
                width: "99%",
                disable_search_threshold: 10
            });
        });

        $(document).on('change', '.init-chosen-select', function(e, sel){
            utility.renderFilterUnit(sel.selected, option[styleSelecter.val()]);
        });

        // 选择城市明细处理
        $(document).on('change', '#area-selecter,#r_ctt-selecter', function(e, sel){
            var $this = $(this),
                values = $this.val() || [],
                rebuild = false,
                value = sel.selected;

            if( value == -10 ) {
                rebuild = true;
                $this.val( -10 );
            } else {
                $.each(values.concat(), function(i, v){
                    if( v == -10){
                        values.splice(i, 1);
                        rebuild = true;
                        return false;
                    }
                });
                if( rebuild ){
                    $this.val( values );
                }

            }

            if( rebuild ){
                utility.changeComponentState( this );
            }


        });

        var filterForm = $("#filter-form"),
            /** 请求接口地址
             * @enum {string}
             */
            interfaceUrls = {
                "cs" : "http://stats.wf.com/Everyday/dayConsu",
                "ct" : "http://stats.wf.com/Everyday/dayCount",
                "ck" : "http://stats.wf.com/Everyday/dayClick"
            };

        /**
         * 表单验证
         */
        filterForm.Validform({
            btnSubmit:"#submit-btn",
            datatype : {

                "id":function(gets){

                    /** 添加一个自定义datatype
                     * @param {string} gets - 当前文本框内容
                     * @returns {boolean}
                     */

                    var idGroup = gets.split(/[^\d-]/) || [], _valid = true;

                    $.each(idGroup, function(i, v){
                        if( v < 0  ) {
                            _valid = false;
                            return false;
                        }
                    });

                    if( !_valid ){
                        return "ID必须大于0";
                    } else {
                        return _valid;
                    }
                }
            },
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

                var postParam = filterForm.serializeArray(),
                    formParam = [];

                filterForm.find('select[multiple]').each(function(){
                    var $this = $(this), name = this.name;
                    if(!$this.val() && !/area/.test(name)){
                        postParam.push({
                            name: this.name,
                            value: ''
                        });
                    }
                });

                $.each(postParam, function(i, v){
                    if( /_id/.test(v.name) && !v.value ){
                        postParam[i].value = -10;
                    }
                });

                /** 是否选择明细 */
                var idMultiple = (function() {
                    var multiple_ = false;
                    $.each(postParam, function(key, val){
                            if( val.value == -10) {
                                multiple_ = true;
                                return false;
                            }
                    });
                    return multiple_;
                }());

                $.each(postParam, function (i, v) {
                    var value = v.value, name = v.name;
                    if (/t[se]/i.test(name)) {
                        value = value.replace(/\D/g, '-');
                    }
                    if (!value) {
                        value = -9;
                    }
                    formParam.push({
                        name : name,
                        value : value
                    });
                });

                var timeRand = (function(){
                    var _timeRand = {}, postKeys = ["ts", "te"];
                    $.each(postParam, function(index, val){
                        if ($.inArray(val.name, postKeys) != -1) {
                            _timeRand[val.name] = $.trim(val.value);
                        }
                    });
                    return _timeRand;

                }()),

                /** 发送给丢失接口请求数据 */
                timeParam = (function(){
                    var _timeParam = [], postKeys = ["style", "ts", "te"];
                    $.each(postParam, function(index, val){
                        var name = val.name;
                        if ($.inArray(name, postKeys) != -1) {
                            if( name == "ts" ) {
                                _timeParam.push({
                                    name : name,
                                    value : val.value.replace(/\D/g, '') + '00'
                                });
                            } else if( name == "te" ) {
                                _timeParam.push({
                                    name : name,
                                    value : val.value.replace(/\D/g, '') + '23'
                                });
                            } else {
                                _timeParam.push({
                                    name : val.name,
                                    value : val.value
                                });
                            }
                        }
                    });
                    return _timeParam;
                }());



                formParam = utility.disposeParam( formParam );

                var chartbox = $('#chartbox'),

                    chartTypes = $('#ty-selecter').val(),
                    chartData,
                    dayDataSource,
                    dayData,
                    lossData;


                var dayDtd = ajax({
                    url : interfaceUrls[styleSelecter.val()],
                    data : formParam,
                    dataType : 'jsonp',
                    success : function( res ){
                        if( res.success ) {
                            var data = res.data;
                            dayDataSource = data;
                            if( data.length ) {

                                /** 数据转换处理 */
                                dayData = utility.disposeData( data, chartTypes, true);
                            }

                        }

                    }
                }),

                /** 数据丢失接口 */
                lossDtd = ajax({
                    url : 'http://stats.wf.com/Stats/loss',
                    data : timeParam,
                    dataType : 'jsonp',
                    success : function( res ){
                        if( res.success ) {
                            lossData = res.data;
                        }
                    }
                }, true);


                $.when(dayDtd, lossDtd).done(function(){

                    var dataCount = dayDataSource.length,
                        MaxCount = 500;

                    if( dataCount >>> 0 ){

                        if( idMultiple ||  dataCount > MaxCount ) {
                            /** 明细数据表格显示 */
                            utility.renderDataTable( $('#chartbox'), dayDataSource);
                        } else {
                            /** 以下部分都是处理数据丢失 */
                            $.each(lossData, function(index, val){
                                var startMilliSec = tools.getMilliSec(val.day, val.hour),
                                    endMilliSec = tools.getMilliSec(val.day_e, val.hour_e),
                                    tmpDateSt = new Date( timeRand.ts ),
                                    tmpDateSe = new Date( timeRand.te ),
                                    ts = tools.getMilliSec( tmpDateSt ),
                                    te = tools.getMilliSec( tmpDateSe );

                                if( ts > startMilliSec ) {
                                    lossData[index].day = tmpDateSt.format("yyyy-MM-dd");
                                    lossData[index].hour = tools.preZero(tmpDateSt.getHours());
                                    lossData[index].ts = ts;

                                } else {
                                    lossData[index].ts = startMilliSec;
                                }

                                if( te < endMilliSec ) {
                                    lossData[index].day_e = tmpDateSe.format("yyyy-MM-dd");
                                    lossData[index].hour_e = tools.preZero(tmpDateSe.getHours());
                                    lossData[index].te = te;
                                } else {
                                    lossData[index].te = endMilliSec;
                                }
                            });

                            $.each(dayData, function(index, val){
                                var times = val.date.getTime();
                                $.each(lossData, function(i, v){
                                    if( times >= v.ts && times <= v.te ) {

                                        dayData[index].bulletColor = '#f00';
                                        dayData[index].bulletSize = 10;
                                        //hourData[index].bulletLabel = 'loss';
                                        if( !dayData[index].lossData ) {
                                            dayData[index].lossData = {};
                                        }

                                        if( !dayData[index].lossData.list ) {
                                            dayData[index].lossData.list = [];
                                        }

                                        if( !dayData[index].lossData.time ) {
                                            dayData[index].lossData.time = val.date.format('yyyy-MM-dd');
                                        }

                                        dayData[index].lossData.list.push({
                                            detail : v.detail,
                                            timeRand : {
                                                ts : new Date( v.ts ).format('yyyy-MM-dd'),
                                                te : new Date( v.te ).format('yyyy-MM-dd')
                                            }
                                        });

                                    }
                                });
                            });

                            chartData = dayData;

                            /**
                             * 开始绘画图表
                             */
                            drawChart( chartData, 'daily' );
                        }

                        $('#export-csv-wrap').html(template.render('export-csv-template', {
                            csvUrl: interfaceUrls[styleSelecter.val()] + '?' + $.param(formParam) + '&csv=1'
                        }));

                    } else {
                        $('#chartbox').height('auto').html('<div class="none-data">没有数据!!</div>');
                    }


                });

                return false;
            }
        });

    };

});