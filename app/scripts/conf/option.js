define({
    "cs" : {
        "consu_count": {
            "ct": {
                "able": true
            },
            "plt": {
                "able": true
            },
            "tp": {
                "able": true
            },
            "po": {
                "able": true
            }
        },
        "plt_count": {
            "ct": {
                "able": false
            },
            "plt": {
                "able": true,
                "required": true,
                "value": {
                    "0": {
                        "ableList": [
                            "ct"
                        ]
                    },
                    "1": {
                        "disableList": [
                            "ct"
                        ]
                    },
                    "2": {
                        "disableList": [
                            "ct"
                        ]
                    },
                    "3": {
                        "ableList": [
                            "ct"
                        ]
                    },
                    "4": {
                        "ableList": [
                            "ct"
                        ]
                    }
                }
            }
        },
        "posi_count": {
            "ct": {
                "able": true
            },
            "po": {
                "able": true,
                "required": true
            }
        },
        "type_count": {
            "ct": {
                "able": true
            },
            "tp": {
                "able": true,
                "required": true
            }
        },
        "is_ie_count": {
            "ct": {
                "able": true
            },
            "ie": {
                "able": true,
                "required": true
            },
            "plt": {
                "able": true,
                "required": true,
                "value": [
                    0
                ]
            },
            "po": {
                "able": true,
                "required": true,
                "value": [
                    1
                ]
            }
        },
        "e_sk_count": {
            "ct": {
                "able": true
            },
            "sk": {
                "able": true,
                "show": true
            }
        },
        "e_exc_count": {
            "xc": {
                "able": true,
                "show": true
            }
        },
        "sps_sum": {
            "ct": {
                "able": true
            },
            "plt": {
                "able": true
            },
            "tp": {
                "able": true
            },
            "po": {
                "able": true
            },
            "a_ags_id": {
                "able": true,
                "show": true,
                "datatype" : "id"
            }
        },
        "ads_sum": {
            "ct": {
                "able": true
            },
            "plt": {
                "able": true
            },
            "tp": {
                "able": true
            },
            "adid" : {
                "able": true,
                "show": true
            },
            "po": {
                "able": true
            },
            "a_ags_id": {
                "able": true,
                "show": true,
                "datatype" : "id"
            }
        },
        "u_12_count": {
            "ct": {
                "able": true
            },
            "plt": {
                "able": true,
                "value": [
                    0
                ]
            },
            "po": {
                "able": true,
                "required": true,
                "value": [
                    1
                ]
            }
        }
    },
    "ct" : {
        "adid_sum" : {
            "ct": {
                "able": true
            },
            "tp": {
                "able": true
            },
            "adid" : {
                "able": true,
                "show": true
            }
        },

        "posi_count" : {
            "ct": {
                "able": true
            },
            "po": {
                "able": true,
                "required": true
            }
        },

        "et_sum" : {
            "ct": {
                "able": true
            }
        }
    },
    "ck" : {
        "adid_sum" : {
            "ct": {
                "able": true
            },
            "tp": {
                "able": true
            },
            "adid" : {
                "able": true,
                "show": true
            }
        },
        "et_sum" : {

        }
    }
});