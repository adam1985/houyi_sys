define(['jquery', 'interface/ajax'], function($, ajax){

        /**
         * 检测用户是否登录
         * @exports controller/checkLogin
         * @version 1.0
         */
        return function( bootstrap ){
            $(function(){
                var writeList = ['stats.wf.com', 'wf.com'],
                    loginList = ['wf_cms'],
                    checkPass = (function(){
                        var _checkPass = false;
                        $.each(writeList, function(i, v){
                            if(location.href.indexOf(v) != -1) {
                                _checkPass = true;
                                return false;
                            }
                        });
                        return _checkPass;
                    }()),
                    /**
                     * @returns {boolean} 检测是否要登录
                     */
                    requireLogin = (function(){
                        var _requireLogin = false;
                        $.each(loginList, function(i, v){
                            if(location.href.indexOf(v)) {
                                _requireLogin = true;
                                return false;
                            }
                        });
                        return _requireLogin;
                    }());

                if( checkPass ) {
                    $('.navi-bar').show();
                    bootstrap();
                } else if( requireLogin ){
                    $('.main-content').removeClass('col-md-10').addClass('col-md-12');
                    /** 检测是否登录 */
                    ajax({
                        url: 'http://wf_cms/Statistics/Datastatistics/logininfo',
                        dataType : 'text',
                        success: function (res) {
                            var _isLogin = false, resJson = {};
                            try{
                                resJson = JSON.parse( res );
                                if( resJson.success ){
                                    if( resJson.data.login ) {
                                        _isLogin = true;
                                    }
                                }
                            } catch (e){

                            }

                            if( _isLogin ) {
                                bootstrap();
                            } else {
                                location.href = 'http://wf_cms/';
                            }
                        }
                    });
                }
            });
        };

    });