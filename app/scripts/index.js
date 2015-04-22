require.config({
    baseUrl: 'scripts',
    "paths": {
        "jquery": "jquery/jquery",
        "bootstrap": "bootstrap/bootstrap",
        "angular": "angular/angular",
        'angular-route': 'angular/angular-route',
        "angular-ui-router": "angular/angular-ui-router",
        "ztree": "component/jquery.ztree.all-3.5",
        "ext": "ext/ext-all",
        'ext-locale': 'ext/ext-locale-zh_CN',
        "My97DatePicker" : "component/My97DatePicker/WdatePicker",
        "chosen" : "component/chosen/chosen.jquery",
        "validform" : "component/validform/js/Validform_v5.3.2",
        "datatables" : "component/datatables",
        "amcharts" : "component/amcharts/amcharts",
        "serial" : "component/amcharts/serial"
    },
    "shim": {
        "My97DatePicker" : [],
        "angular": {
            "deps": ["jquery"],
            "exports": 'angular'
        },
        "bootstrap": ["jquery"],
        "angular-route": ["angular"],
        "angular-ui-router": ["angular"],
        'ext-locale':['ext'],
        "chosen" : ["jquery"],
        "validform" : ["jquery"],
        "amcharts" : [],
        "serial" : ["amcharts"]
    }
});

require(['controller/pageinit']);
