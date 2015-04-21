define(['jquery', 'component/jquery.cookie'], function ($) {
    if( window.localStorage ) {

        return window.localStorage;


    } else {
        return localStorage = {
            getItem : function( name ){
                return $.cookie(name);
            },
            setItem : function( name , val ){
                $.cookie(name, val, {
                    expires : 365,
                    domain : '.baofeng.net'
                });
            },
            removeItem : function( name ){
                $.removeCookie(name, {
                    domain : '.baofeng.net'
                });
            }

        };
    }

});
