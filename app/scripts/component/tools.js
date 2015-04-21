define(['jquery'], function ($) {

    Date.prototype.format = function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    };

    var preZero = function (num) {
        num = parseInt(num);
        return ( num < 10 ? '0' : '' ) + num;
    };

    var formatTime = function (sDate) {
        var date;

        if (sDate instanceof Date) {
            date = sDate;
        } else {
            if (/\d{9,}/.test(sDate)) {
                date = new Date(parseInt(sDate) * 1000);
            } else {
                sDate = sDate.replace(/-/g, '/');
                date = new Date(sDate);
            }
        }

        return preZero(date.getHours()) + ':' + preZero(date.getMinutes()) + ':' + preZero(date.getSeconds());
    },
    getMilliSec = function(day , hour) {
        var date;
        if( !( day instanceof Date )) {
            day = day.replace(/\D/g, '/');
            date = new Date( day );
            date.setHours(hour);
        } else {
            date = day;
        }

        return date.getTime();
    };




    return {
        preZero : preZero,
        formatTime: formatTime,
        getMilliSec: getMilliSec
    };

});
