define(["model/area"], function (area) {
    return {
        "area": {
            "type" : "select",
            "multiple": true,
            "disabled": true,
            "placeholder": "请选择城市",
            "dataSource": area.city
        },
        "r_ctt": {
            "type" : "select",
            "multiple": true,
            "hide": true,
            "disabled": true,
            "placeholder": "请选择地域组类型",
            "dataSource": [
                {"text":"域组类型明细","value":"-10"},
                {"text":"国内未知","value":"0"},
                {"text":"一线城市","value":"1"},
                {"text":"二线城市","value":"2"},
                {"text":"三线城市","value":"3"},
                {"text":"四线城市","value":"4"},
                {"text":"国外","value":"5"}
            ]
        },
        "is_ie": {
            "type" : "select",
            "disabled": true,
            "placeholder": "请选择IE",
            "dataSource": [
                {
                    "value": "0",
                    "text": "老用户"
                },
                {
                    "value": "1",
                    "text": "本地"
                },
                {
                    "value": "2",
                    "text": "IE"
                }
            ]
        },
        "is_dpl" : {
            "type" : "select",
            "disabled": true,
            "hide" : true,
            "placeholder": "请选择dpl",
            "dataSource": [
                {
                    "value": "0",
                    "text": "否"
                },
                {
                    "value": "1",
                    "text": "是"
                }
            ]
        },
        "a_dpl" : {
            "type" : "select",
            "disabled": true,
            "hide" : true,
            "placeholder": "请选择dpl开关",
            "dataSource": [
                {
                    "value": "1",
                    "text": "开"
                },
                {
                    "value": "2",
                    "text": "关"
                }
            ]
        },
        "a_2pv" : {
            "type" : "select",
            "disabled": true,
            "hide" : true,
            "placeholder": "请选择2次开关",
            "dataSource": [
                {
                    "value": "1",
                    "text": "开"
                },
                {
                    "value": "2",
                    "text": "关"
                }
            ]
        },
        "type": {
            "type" : "select",
            "disabled": true,
            "placeholder": "请选择请求类型",
            "dataSource": [
                {
                    "value": "-10",
                    "text": "请求明细"
                },
                {
                    "value": "A",
                    "text": "A"
                },
                {
                    "value": "B",
                    "text": "B"
                },
                {
                    "value": "C",
                    "text": "C"
                },
                {
                    "value": "D",
                    "text": "D"
                }
            ]
        },
        "plt": {
            "type" : "select",
            "disabled": true,
            "placeholder": "请选择平台类型",
            "dataSource" : [
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
            ]
        },
        "posi": {
            "type" : "select",
            "disabled": true,
            "placeholder": "请选择广告位置类型",
            "dataSource": [
                {
                    "value": "-10",
                    "text": "位置明细"
                },
                {
                    "value": "1",
                    "text": "前播"
                },
                {
                    "value": "2",
                    "text": "中播"
                }
            ]
        },
        "e_exc": {
            "type" : "select",
            "disabled": true,
            "hide" : true,
            "placeholder": "请选择e_exc正常值",
            "dataSource": [
                {
                    "value": "1",
                    "text": "1"
                },
                {
                    "value": "2",
                    "text": "2"
                },
                {
                    "value": "3",
                    "text": "3"
                },
                {
                    "value": "4",
                    "text": "4"
                },
                {
                    "value": "5",
                    "text": "5"
                },
                {
                    "value": "6",
                    "text": "6"
                },
                {
                    "value": "7",
                    "text": "7"
                }
            ]
        },
        "ad_id": {
            "type": "text",
            "disabled": true,
            "hide": true,
            "label" : "广告id",
            "placeholder": "请输入广告id"
        },
        "mgs_id": {
            "type": "text",
            "disabled": true,
            "hide": true,
            "label" : "媒介组id",
            "placeholder": "请输入媒介组id"
        },
        "a_ags_id": {
            "type": "text",
            "disabled": true,
            "hide": true,
            "label" : "地域组id",
            "placeholder": "请输入地域组id"
        },
        "m_id": {
            "type": "text",
            "disabled": true,
            "hide": true,
            "label" : "物料id",
            "placeholder": "请输入物料id"
        }
    }
});