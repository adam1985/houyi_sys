define(['jquery', 'component/template', 'amcharts', "serial"],  function($, template){
    return function( itemData ) {

        var chartData = itemData.dataList;

        AmCharts.monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        AmCharts.shortMonthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        AmCharts.dayNames=["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        AmCharts.shortDayNames=["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

        var chart;

        // 处理值为0的数据
        $.each(chartData, function(i, v) {
            $.each(v, function(key, val){
                if( !(val instanceof Date) && val == 0 ){
                    delete chartData[i][key];
                }
            });
        });

        //AmCharts.ready(function () {

        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "images/";
        chart.dataProvider = chartData;
        chart.categoryField = "date";

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true

        categoryAxis.minPeriod = "DD";


        categoryAxis.dateFormats = [
            {period:'fff',format:'JJ:NN:SS'},
            {period:'ss',format:'JJ:NN:SS'},
            {period:'mm',format:'JJ:NN'},
            {period:'hh',format:'JJ'},
            {period:'DD',format:'DD'},
            {period:'WW',format:'MMM DD'},
            {period:'MM',format:'MMM'},
            {period:'YYYY',format:'YYYY'}];
        categoryAxis.gridAlpha = 0.10;
        categoryAxis.axisAlpha = 0;
        categoryAxis.inside = true;
        categoryAxis.minorGridEnabled =  true;

        // value
        var valueAxisLeft = new AmCharts.ValueAxis();
        valueAxisLeft.tickLength = 0;
        valueAxisLeft.axisAlpha = 0;
        valueAxisLeft.gridAlpha = 0;
        valueAxisLeft.axisColor = "#FF6600";
        valueAxisLeft.position = "left";
        //valueAxis.axisThickness = 2;
        valueAxisLeft.showFirstLabel = false;
        valueAxisLeft.showLastLabel = false;
        //valueAxis.dashLength = 1;
        valueAxisLeft.logarithmic = true; // this line makes axis logarithmic
        chart.addValueAxis(valueAxisLeft);

        var valueAxisRight = new AmCharts.ValueAxis();
        valueAxisRight.tickLength = 0;
        valueAxisRight.axisAlpha = 0;
        valueAxisRight.gridAlpha = 0;
        valueAxisRight.axisColor = "#FF6600";
        valueAxisRight.position = "right";
        //valueAxis.axisThickness = 2;
        valueAxisRight.showFirstLabel = false;
        valueAxisRight.showLastLabel = false;
        //valueAxis.dashLength = 1;
        valueAxisRight.logarithmic = true; // this line makes axis logarithmic
        chart.addValueAxis(valueAxisRight);

        // GRAPH
        var maxLegend = {length : 0, index : 0};
        $.each(chartData, function(index, val){
            var length = Object.keys(val).length;
            if( length > maxLegend.length ){
                maxLegend.length = length;
                maxLegend.index = index;
            }
        });

        Object.create = function (o) {

            var F = function () {};

            F.prototype = o;

            return new F();

        };

        var singleData = chartData[maxLegend.index],
            readyData = {},
            colors = ['#FF6600', '#FCD202', '#B0DE09'],
            blackList = ["date", "bulletColor", "bulletSize", "bulletLabel", "detail", "lossData"],
            chartIndex = 0;

        $.each(singleData, function(key , val){
            readyData[key] = val;
        });


        $.each(singleData, function(key){

            if( $.inArray(key, blackList) == -1 ) {
                var graph = new AmCharts.AmGraph();
                //graph.dashLength = 3;
                graph.lineThickness = 1;
                //graph.type = "smoothedLine";
                graph.title = key;
                //graph.lineColor = "#00CC00";
                graph.colorField = "bulletColor";
                graph.bulletSizeField = "bulletSize";
                //graph.labelText = "[[bulletLabel]]";
                graph.valueField = key;
                graph.bullet = "round";
                graph.balloonText = "[[category]]<br><b><span>" + key + ": [[value]]</span></b>";
                graph.bulletColor = "#FFFFFF";
                graph.useLineColorForBulletBorder = true;
                graph.bulletBorderAlpha = 1;
                graph.bulletBorderThickness = 2;
                graph.bulletSize = 7;
                graph.lineThickness = 2;
                if(itemData.getValueAxis(key) == 'left'){
                    graph.valueAxis = valueAxisLeft;
                } else if(itemData.getValueAxis(key) == 'right') {
                    graph.valueAxis = valueAxisRight;
                }

                //graph.bulletBorderColor = "#00BBCC";
                //graph.lineColor = "#00BBCC";
                chart.addGraph(graph);
            }
        });

        $.each(readyData, function(key){
            if($.inArray(key, blackList) != -1) {
                delete readyData[key];
            }
        });

        var chartAmount = Object.keys(readyData).length;

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chartScrollbar.scrollbarHeight = 20;
        //chartScrollbar.graph = graph; // as we want graph to be displayed in the scrollbar, we set graph here
        chartScrollbar.graphType = "line"; // we don't want candlesticks to be displayed in the scrollbar
        chartScrollbar.gridCount = 4;
        chartScrollbar.color = "#FFFFFF";
        chart.addChartScrollbar(chartScrollbar);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chartCursor.zoomable = true;
        chartCursor.categoryBalloonDateFormat = "YYYY-MM-DD EEEE";

        //chartCursor.cursorAlpha = 0;
        chartCursor.bulletsEnabled = true;
        chart.addChartCursor(chartCursor);

        // HORIZONTAL GREEN RANGE
        var guide = new AmCharts.Guide();
        guide.value = 10;
        guide.toValue = 20;
        guide.fillColor = "#00CC00";
        guide.inside = true;
        guide.fillAlpha = 0.2;
        guide.lineAlpha = 0;
        valueAxisLeft.addGuide(guide);
        valueAxisRight.addGuide(guide);

        // LEGEND
        if( chartAmount > 1 ) {
            var legend = new AmCharts.AmLegend();
            legend.marginLeft = 110;
            chart.addLegend(legend);
        }

        function zoomChart() {
            // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
            chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
        }

        chart.addListener("dataUpdated", zoomChart);


        // WRITE
        $('#summary-chart').height(600).removeClass('hide');
        chart.write("summary-chart");

        //});
    }

});