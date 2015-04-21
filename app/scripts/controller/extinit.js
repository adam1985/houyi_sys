define(['jquery', './checkLogin', './adput-data', './byhour'],
    function($, checkLogin, adputdata, byhour){

        /**
         * 初始化模块
         * @exports controller/extinit
         * @version 1.0
         */

        checkLogin(function(){

            if( $('#byhour').length ){
                byhour();
            }

            if( $('#adput-table').length ){
                adputdata();
            }


        });
    });
