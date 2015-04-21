define(['jquery', 'interface/ajax', 'component/template', './utility',  './drawChart' ,  'conf/filterUnit', 'conf/option', 'component/jquery-migrate-1.2.1.min',
        'component/jquery-ui-1.10.3.custom.min',
        'component/bootstrap', "My97DatePicker", 'chosen', 'validform'],  function($, ajax, template, utility, drawChart , filterUnit, option){
    return function(){

        var datepicker = $( ".datepicker" );
            datepicker.click(function(){
                WdatePicker({
                    skin:'twoer',
                    dateFmt:'yyyy-MM-dd HH点'
                });
            });

        $.data(document.body, 'filter-unit', JSON.stringify(filterUnit));

        $(".init-chosen-select").chosen({
            width: "205px"
        });

        $(document).on('change', '.init-chosen-select', function(e, sel){
            utility.renderFilterUnit(sel.selected, option);
        });

        var filterForm = $("#filter-form");
        filterForm.Validform({
            btnSubmit:"#submit-btn",
            tiptype:function(msg,o,cssctl){
                var objtip=$("#err-tiper");
                if(o.type != 2 ) {
                    cssctl(objtip,o.type);
                    objtip.show().text(msg);
                } else {
                    objtip.hide();
                }
            },
            beforeSubmit:function(){

                    var postParam = filterForm.serializeArray(),
                        formParam = [];

                    $.each(postParam, function (i, v) {
                        var value = v.value, name = v.name;
                        if (value && value != -1) {
                            if (/t[se]/i.test(name)) {
                                value = value.replace(/\D/g, '');
                            }
                            formParam.push({
                                name : name,
                                value : value
                            });
                        }
                    });

                    formParam = utility.disposeParam( formParam );

                    var chartType = $('#ty-slecter').val(), chartData;

                    ajax({
                        url : 'http://stats.wf18.com/Hour/hourstats',
                        data : formParam,
                        success : function( res ){
                            if( res.success ) {
                                var data = res.data;
                                chartData = utility.disposeData( data, chartType);
                                if( chartData.length ) {
                                    drawChart( chartData );
                                } else {
                                    $('#chartbox').height('auto').html('<div class="none-data">没有数据!!</div>');
                                }

                            }

                        }
                    });
                return false;
            }
        });

    };

});