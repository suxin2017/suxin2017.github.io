---
title: mac-键盘映射
date: 2021-05-12 07:24:05
tags:
category:
---

使用 karabiner-elemenet 进行mac键盘映射的修改

修改 大写按键 -> esc 
修改 control + hjkl -> 方向按键
修改 shift -> 切换输入法
修改 shift + shift vscode 下 -> command + p

```json 
{
    "title": "my mac key mapping",
    "rules": [
        {
            "description": "capslock",
            "manipulators": [
                {
                    "type": "basic",
                    "from": {
                        "key_code": "caps_lock"
                    },
                    "to": [
                        {
                            "repeat": false,
                            "key_code": "escape"
                        }
                    ]
                }
            ]
        },
        {
            "description": "shift",
            "manipulators":[
                {
                    "type": "basic",
                    "from": {
                        "key_code": "left_shift",
                        "modifiers": {
                            "optional": ["any"]
                        }
                    },
                    "to": [
                        {
                            "key_code": "p",
                            "modifiers": ["left_gui"]
                        }
                    ],
                    "conditions": [
                        {
                            "type": "variable_if",
                            "name": "left_shift pressed",
                            "value": 1
                        },
                        {
                            "type":"frontmost_application_if",
                            "bundle_identifiers":[
                                "com\\.microsoft\\.VSCode"
                            ]
                        }
                    ]
                },
                {
                    "type": "basic",
                    "from": {
                        "key_code": "left_shift",
                        "modifiers": {
                            "optional": ["any"]
                        }
                    },
                    "to_if_alone": [
                        {
                            "repeat": false,
                            "key_code": "caps_lock"
                        }
                    ],
                    "to": [
                        {
                            "set_variable": {
                                "name": "left_shift pressed",
                                "value": 1
                            }
                        },
                        {
                            "key_code": "left_shift"
                        }
                    ],
                    "to_delayed_action": {
                        "to_if_invoked": [
                            {
                                "set_variable": {
                                    "name": "left_shift pressed",
                                    "value": 0
                                }
                            }
                        ],
                        "to_if_canceled": [
                            {
                                "set_variable": {
                                    "name": "left_shift pressed",
                                    "value": 0
                                }
                            }
                        ]
                    }
                }
            ]
        },{
            "description":"hjkl",
            "manipulators": [
                {
                    "type": "basic",
                    "from": {
                        "key_code": "h",
                        "modifiers": {
                            "mandatory": [
                              "left_control"
                            ]
                          }
                    },
                    "to": [
                        {
                            "key_code": "left_arrow"
                        }
                    ]
                },  {
                    "type": "basic",
                    "from": {
                        "key_code": "j",
                        "modifiers": {
                            "mandatory": [
                              "left_control"
                            ]
                          }
                    },
                    "to": [
                        {
                            "key_code": "down_arrow"
                        }
                    ]
                },  {
                    "type": "basic",
                    "from": {
                        "key_code": "k",
                        "modifiers": {
                            "mandatory": [
                              "left_control"
                            ]
                          }
                    },
                    "to": [
                        {
                            "key_code": "up_arrow"
                        }
                    ]
                },  {
                    "type": "basic",
                    "from": {
                        "key_code": "l",
                        "modifiers": {
                            "mandatory": [
                              "left_control"
                            ]
                          }
                    },
                    "to": [
                        {
                            "key_code": "right_arrow"
                        }
                    ]
                }
            ]
        }
    ]
}
```