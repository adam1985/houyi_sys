define( ['jquery', 'ext', 'ext-locale'], function ($) {

    /**
     * @fileOverview 投放数据报表
     * @exports controller/adput_data
     * @returns {function}
     */

    return function () {
            Ext.require([
                'Ext.grid.*',
                'Ext.data.*',
                'Ext.util.*',
                'Ext.state.*'
            ]);

            Ext.onReady(function () {
                Ext.QuickTips.init();
                var itemsPerPage = 50,
                    extraParams = {},
                    forceFit = true,
                    forceFitLabelArr = [ '满屏显示', '宽屏显示'],
                    forceFitLabel = forceFitLabelArr[+forceFit],
                    dataForceFit = localStorage.getItem('data-forceFit');

                    if(dataForceFit !== undefined){
                        forceFit = !!+dataForceFit;
                    }

                    forceFitLabel = forceFitLabelArr[+forceFit];


                var userHideColumn = function(field, isremove){
                        var columns = readHideColumn();
                        if( isremove ){
                            delete columns[field];
                        } else {
                            columns[field] = 1;
                        }
                        localStorage.setItem('hide-column', JSON.stringify(columns))
                    },

                    readHideColumn = function(){
                        var columns = {};
                        try{
                            columns = JSON.parse(localStorage.getItem('hide-column'));
                        }catch (e){

                        }
                        return columns || {};
                    },

                    hideColumn = readHideColumn();



                Ext.define('adputData', {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: "id", type: "int"}, //第一个必须指定mapping,其他可以省略
                        'date',
                        'ad_id',
                        'name',
                        'expect',
                        'real',
                        'ads_sum',
                        'display',
                        'click',
                        'ctr',
                        'complete',
                        'accumulate',
                        'area_match',
                        'area_rate',
                        'remain_day',
                        'try_consu',
                        'consu',
                        'try_display',
                        'dynamic_base',
                        'return_rate'
                    ]
                });



                var adputData = Ext.create('Ext.data.Store', {
                    //分页大小
                    pageSize: itemsPerPage,
                    model: 'adputData',
                    remoteSort: true,
                    proxy: {
                        type: 'jsonp',
                        url: 'http://stats.wf.com/Stats/report',
                        reader: { root: 'items', totalProperty: 'total' }
                    },

                    sorters: [
                        {
                            property: 'id', //排序字段
                            direction: 'asc'// 默认ASC
                        }
                    ],
                    baseParams: {
                    },
                    listeners: {
                        beforeload: function(store){
                            Ext.apply(store.proxy.extraParams, extraParams);
                        }
                    }
                });

                var dypageSize = Ext.create('Ext.data.Store', {
                    fields: ['value', 'name'],
                    data : [
                        {"value":"50", "name":"50"},
                        {"value":"100", "name":"100"},
                        {"value":"200", "name":"200"},
                        {"value":"500", "name":"500"},
                        {"value":"1000", "name":"1000"}
                    ]
                });

                var pagingToolbar = Ext.create('Ext.toolbar.Paging',{
                    store: adputData,  // same store GridPanel is using
                    dock: 'bottom', //分页 位置
                    emptyMsg: '没有数据',
                    displayInfo: true,
                    displayMsg: '当前显示{0}-{1}条记录 / 共{2}条记录 ',
                    beforePageText: '第',
                    afterPageText: '页/共{0}页',
                    items: [
                        {
                            xtype: 'combobox',
                            labelWidth: 40,
                            width: 110,
                            autoSelect: true,
                            fieldLabel: '条数',
                            labelAlign:"right",
                            labelSeparator : '',
                            value : 50,
                            editable : true,
                            store: dypageSize,
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value',
                            style:{
                                marginLeft: 20
                            },
                            listeners : {
                                change: function( field, newValue) {
                                    itemsPerPage = parseInt(newValue);
                                    adputData.setPageSize(itemsPerPage);
                                    adputData.loadPage(1);
                                }
                            }
                        },
                        {
                            text: '下载报表CSV',
                            xtype: 'button',
                            listeners: {
                                click: function () {
                                    var params = $.extend({}, extraParams, {csv: 1});
                                    window.open('http://stats.wf.com/Stats/report?' + $.param(params));
                                }
                            }
                        },
                        {
                            text: forceFitLabel,
                            xtype: 'button',
                            listeners: {
                                click: function (o) {

                                    forceFit = !forceFit;

                                    forceFitLabel = forceFitLabelArr[+forceFit];

                                    o.setText(forceFitLabel);

                                    grid.forceFit = forceFit;

                                    grid.updateLayout();

                                    localStorage.setItem('data-forceFit', +forceFit);

                                    location.reload();
                                }
                            }
                        }
                    ]
                });

                var form = Ext.create('Ext.form.Panel', {
                    bodyPadding: 5,
                    layout:"hbox",
                    border: 0,
                    animateTarget: true,
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'ts',
                            fieldLabel: '开始日期',
                            format: 'Y-m-d',
                            margin: '0 10 0 0',
                            editable: false,
                            labelWidth: 60,
                            width: 180,
                            emptyText: ''
                        },
                        {
                            xtype: 'datefield',
                            name: 'te',
                            fieldLabel: '结束日期',
                            format: 'Y-m-d',
                            margin: '0 10 0 0',
                            editable: false,
                            labelWidth: 60,
                            width: 180,
                            emptyText: ''
                        },
                        {
                            xtype: 'textfield',
                            name: 'name',
                            fieldLabel: '广告名称',
                            margin: '0 10 0 0',
                            labelWidth: 60,
                            width: 180,
                            emptyText: ''
                        },
                        {
                            xtype: 'textfield',
                            name: 'ad_id',
                            fieldLabel: '广告ID',
                            margin: '0 20 0 0',
                            labelWidth: 60,
                            width: 180,
                            emptyText: ''
                        },
                        {
                            text: '查询',
                            xtype: 'button',
                            handler: function () {
                                $.extend(extraParams, form.getValues());
                                adputData.loadPage(1);
                            }
                        }
                    ]
                });

                var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToMoveEditor: 1,
                    autoCancel: false
                });


                var celleditor = {
                    xtype: 'textfield',
                    selectOnFocus: true,
                    allowBlank: false
                };

                var gridColumn = [
                    //{header: '',xtype: 'rownumberer', width: 40, sortable: false},
                    {
                        header: '序号', dataIndex: 'id',
                        editor: celleditor
                    },
                    {
                        header: '日期', dataIndex: 'date',
                        editor: celleditor
                    },
                    {
                        header: '广告ID', dataIndex: 'ad_id',
                        editor: celleditor
                    },
                    {
                        header: '广告名称', dataIndex: 'name',
                        editor: celleditor,
                        minWidth: 250
                    },
                    {
                        header: '当天预期', dataIndex: 'expect',
                        editor: celleditor
                    },
                    {
                        header: '当天实际', dataIndex: 'real',
                        editor: celleditor
                    },
                    {
                        header: '下发量', dataIndex: 'ads_sum',
                        editor: celleditor
                    },
                    {
                        header: '展现成功', dataIndex: 'display',
                        editor: celleditor
                    },
                    {
                        header: '点击次数', dataIndex: 'click',
                        editor: celleditor
                    },
                    {
                        header: 'CTR', dataIndex: 'ctr',
                        editor: celleditor
                    },
                    {
                        header: '当日完成率', dataIndex: 'complete',
                        editor: celleditor
                    },
                    {
                        header: '累计完成率', dataIndex: 'accumulate',
                        editor: celleditor
                    },
                    {
                        header: '地域匹配量', dataIndex: 'area_match',
                        editor: celleditor
                    },


                    {
                        header: '地域匹配率', dataIndex: 'area_rate',
                        editor: celleditor
                    },
                    {
                        header: '投放剩余天数', dataIndex: 'remain_day',
                        editor: celleditor
                    },
                    {
                        header: '尝试协商', dataIndex: 'try_consu',
                        editor: celleditor
                    },

                    {
                        header: '协商成功', dataIndex: 'consu',
                        editor: celleditor
                    },
                    {
                        header: '尝试展示', dataIndex: 'try_display',
                        editor: celleditor
                    },
                    {
                        header: '动态打底', dataIndex: 'dynamic_base',
                        editor: celleditor
                    },
                    {
                        header: '返还比', dataIndex: 'return_rate',
                        editor: celleditor
                    }
                ];

                $.each(gridColumn, function(i, v){
                    if(hideColumn[v.dataIndex]){
                        gridColumn[i].hidden = true;
                    } else {
                        delete gridColumn[i].hidden;
                    }
                });

                var grid = Ext.create('Ext.grid.Panel', {
                    title: '投放报表',
                    store: adputData,
                    closable: false,
                    forceFit:forceFit,
                    height: $(window).height() - 40,
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 1
                    },
                    loadMask: true, //加载提示{ msg: '正在加载数据，请稍侯……' }
                    columns: gridColumn,
                    dockedItems: [
                        pagingToolbar,
                        {
                            xtype: 'toolbar',
                            id: 'adput-form',
                            items: form
                        }
                    ],
                    listeners: {
                        columnshow: function( ct, column, eOpts ){
                            userHideColumn(column.dataIndex, true);
                        },
                        columnhide: function( ct, column, eOpts ){
                            userHideColumn(column.dataIndex);
                        }
                    },
                    renderTo: 'adput-table'
                });
                //初始加载第1页
                /*adputData.load({
                    params: {
                        start: 0,
                        limit: itemsPerPage
                    }
                });*/

                adputData.loadPage(1);


            });





    };

});