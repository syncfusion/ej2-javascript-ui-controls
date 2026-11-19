/* Generated from ECMA-376 presetShapeDefinitions.xml by tools/generate-s2-batch-b-cases.mjs. */
import { PresetDefinitionMap } from '../preset-geometry-types';

/**
 * @internal
 */
export const BATCH_B_PRESET_DATA: PresetDefinitionMap = {
    'rightArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 100000 w ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'dx1',
                '*/ ss a2 100000'
            ],
            [
                'x1',
                '+- r 0 dx1'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc dy1 0'
            ],
            [
                'dx2',
                '*/ y1 dx1 hd2'
            ],
            [
                'x2',
                '+- x1 dx2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 100000 w ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'dx2',
                '*/ ss a2 100000'
            ],
            [
                'x2',
                '+- l dx2 0'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc dy1 0'
            ],
            [
                'dx1',
                '*/ y1 dx2 hd2'
            ],
            [
                'x1',
                '+- x2  0 dx1'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'upArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 100000 h ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'dy1',
                '*/ ss a2 100000'
            ],
            [
                'y1',
                '+- b 0 dy1'
            ],
            [
                'dx1',
                '*/ w a1 200000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc dx1 0'
            ],
            [
                'dy2',
                '*/ x1 dy1 wd2'
            ],
            [
                'y2',
                '+- y1 dy2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ],
        'mirrorY': true
    },
    'downArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 100000 h ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'dy1',
                '*/ ss a2 100000'
            ],
            [
                'y1',
                '+- b 0 dy1'
            ],
            [
                'dx1',
                '*/ w a1 200000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc dx1 0'
            ],
            [
                'dy2',
                '*/ x1 dy1 wd2'
            ],
            [
                'y2',
                '+- y1 dy2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftRightArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 w ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'x2',
                '*/ ss a2 100000'
            ],
            [
                'x3',
                '+- r 0 x2'
            ],
            [
                'dy',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy'
            ],
            [
                'y2',
                '+- vc dy 0'
            ],
            [
                'dx1',
                '*/ y1 x2 hd2'
            ],
            [
                'x1',
                '+- x2 0 dx1'
            ],
            [
                'x4',
                '+- x3 dx1 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'upDownArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'y2',
                '*/ ss a2 100000'
            ],
            [
                'y3',
                '+- b 0 y2'
            ],
            [
                'dx1',
                '*/ w a1 200000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc dx1 0'
            ],
            [
                'dy1',
                '*/ x1 y2 wd2'
            ],
            [
                'y1',
                '+- y2 0 dy1'
            ],
            [
                'y4',
                '+- y3 dy1 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'quadArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 22500,
            'adj2': 22500,
            'adj3': 22500
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'q1',
                '+- 100000 0 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ q1 1 2'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'x1',
                '*/ ss a3 100000'
            ],
            [
                'dx2',
                '*/ ss a2 100000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x5',
                '+- hc dx2 0'
            ],
            [
                'dx3',
                '*/ ss a1 200000'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc dx3 0'
            ],
            [
                'x6',
                '+- r 0 x1'
            ],
            [
                'y2',
                '+- vc 0 dx2'
            ],
            [
                'y5',
                '+- vc dx2 0'
            ],
            [
                'y3',
                '+- vc 0 dx3'
            ],
            [
                'y4',
                '+- vc dx3 0'
            ],
            [
                'y6',
                '+- b 0 x1'
            ],
            [
                'il',
                '*/ dx3 x1 dx2'
            ],
            [
                'ir',
                '+- r 0 il'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'bentArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 43750
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'a3',
                'pin 0 adj3 50000'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw2',
                '*/ ss a2 100000'
            ],
            [
                'th2',
                '*/ th 1 2'
            ],
            [
                'dh2',
                '+- aw2 0 th2'
            ],
            [
                'ah',
                '*/ ss a3 100000'
            ],
            [
                'bw',
                '+- r 0 ah'
            ],
            [
                'bh',
                '+- b 0 dh2'
            ],
            [
                'bs',
                'min bw bh'
            ],
            [
                'maxAdj4',
                '*/ 100000 bs ss'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'bd',
                '*/ ss a4 100000'
            ],
            [
                'bd3',
                '+- bd 0 th'
            ],
            [
                'bd2',
                'max bd3 0'
            ],
            [
                'x3',
                '+- th bd2 0'
            ],
            [
                'x4',
                '+- r 0 ah'
            ],
            [
                'y3',
                '+- dh2 th 0'
            ],
            [
                'y4',
                '+- y3 dh2 0'
            ],
            [
                'y5',
                '+- dh2 bd 0'
            ],
            [
                'y6',
                '+- y3 bd2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd',
                        'heightRadius': 'bd',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'dh2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'aw2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd2',
                        'heightRadius': 'bd2',
                        'startAngle': '3cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'th',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftRightUpArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 22500,
            'adj2': 22500,
            'adj3': 22500
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'q1',
                '+- 100000 0 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ q1 1 2'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'x1',
                '*/ ss a3 100000'
            ],
            [
                'dx2',
                '*/ ss a2 100000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x5',
                '+- hc dx2 0'
            ],
            [
                'dx3',
                '*/ ss a1 200000'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc dx3 0'
            ],
            [
                'x6',
                '+- r 0 x1'
            ],
            [
                'dy2',
                '*/ ss a2 50000'
            ],
            [
                'y2',
                '+- b 0 dy2'
            ],
            [
                'y4',
                '+- b 0 dx2'
            ],
            [
                'y3',
                '+- y4 0 dx3'
            ],
            [
                'y5',
                '+- y4 dx3 0'
            ],
            [
                'il',
                '*/ dx3 x1 dx2'
            ],
            [
                'ir',
                '+- r 0 il'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'uturnArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 43750,
            'adj5': 75000
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 25000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'q2',
                '*/ a1 ss h'
            ],
            [
                'q3',
                '+- 100000 0 q2'
            ],
            [
                'maxAdj3',
                '*/ q3 h ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q1',
                '+- a3 a1 0'
            ],
            [
                'minAdj5',
                '*/ q1 ss h'
            ],
            [
                'a5',
                'pin minAdj5 adj5 100000'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw2',
                '*/ ss a2 100000'
            ],
            [
                'th2',
                '*/ th 1 2'
            ],
            [
                'dh2',
                '+- aw2 0 th2'
            ],
            [
                'y5',
                '*/ h a5 100000'
            ],
            [
                'ah',
                '*/ ss a3 100000'
            ],
            [
                'y4',
                '+- y5 0 ah'
            ],
            [
                'x9',
                '+- r 0 dh2'
            ],
            [
                'bw',
                '*/ x9 1 2'
            ],
            [
                'bs',
                'min bw y4'
            ],
            [
                'maxAdj4',
                '*/ bs 100000 ss'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'bd',
                '*/ ss a4 100000'
            ],
            [
                'bd3',
                '+- bd 0 th'
            ],
            [
                'bd2',
                'max bd3 0'
            ],
            [
                'x3',
                '+- th bd2 0'
            ],
            [
                'x8',
                '+- r 0 aw2'
            ],
            [
                'x6',
                '+- x8 0 aw2'
            ],
            [
                'x7',
                '+- x6 dh2 0'
            ],
            [
                'x4',
                '+- x9 0 bd'
            ],
            [
                'x5',
                '+- x7 0 bd2'
            ],
            [
                'cx',
                '+/ th x7 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'bd'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd',
                        'heightRadius': 'bd',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd',
                        'heightRadius': 'bd',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'x3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd2',
                        'heightRadius': 'bd2',
                        'startAngle': '0',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'th'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'bd2',
                        'heightRadius': 'bd2',
                        'startAngle': '3cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'th',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftUpArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '+- 100000 0 maxAdj1'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'x1',
                '*/ ss a3 100000'
            ],
            [
                'dx2',
                '*/ ss a2 50000'
            ],
            [
                'x2',
                '+- r 0 dx2'
            ],
            [
                'y2',
                '+- b 0 dx2'
            ],
            [
                'dx4',
                '*/ ss a2 100000'
            ],
            [
                'x4',
                '+- r 0 dx4'
            ],
            [
                'y4',
                '+- b 0 dx4'
            ],
            [
                'dx3',
                '*/ ss a1 200000'
            ],
            [
                'x3',
                '+- x4 0 dx3'
            ],
            [
                'x5',
                '+- x4 dx3 0'
            ],
            [
                'y3',
                '+- y4 0 dx3'
            ],
            [
                'y5',
                '+- y4 dx3 0'
            ],
            [
                'il',
                '*/ dx3 x1 dx4'
            ],
            [
                'cx1',
                '+/ x1 x5 2'
            ],
            [
                'cy1',
                '+/ x1 y5 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'x1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'bentUpArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 50000'
            ],
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'a3',
                'pin 0 adj3 50000'
            ],
            [
                'y1',
                '*/ ss a3 100000'
            ],
            [
                'dx1',
                '*/ ss a2 50000'
            ],
            [
                'x1',
                '+- r 0 dx1'
            ],
            [
                'dx3',
                '*/ ss a2 100000'
            ],
            [
                'x3',
                '+- r 0 dx3'
            ],
            [
                'dx2',
                '*/ ss a1 200000'
            ],
            [
                'x2',
                '+- x3 0 dx2'
            ],
            [
                'x4',
                '+- x3 dx2 0'
            ],
            [
                'dy2',
                '*/ ss a1 100000'
            ],
            [
                'y2',
                '+- b 0 dy2'
            ],
            [
                'x0',
                '*/ x4 1 2'
            ],
            [
                'y3',
                '+/ y2 b 2'
            ],
            [
                'y15',
                '+/ y1 b 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'curvedRightArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 25000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'a1',
                'pin 0 adj1 a2'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw',
                '*/ ss a2 100000'
            ],
            [
                'q1',
                '+/ th aw 4'
            ],
            [
                'hR',
                '+- hd2 0 q1'
            ],
            [
                'q7',
                '*/ hR 2 1'
            ],
            [
                'q8',
                '*/ q7 q7 1'
            ],
            [
                'q9',
                '*/ th th 1'
            ],
            [
                'q10',
                '+- q8 0 q9'
            ],
            [
                'q11',
                'sqrt q10'
            ],
            [
                'idx',
                '*/ q11 w q7'
            ],
            [
                'maxAdj3',
                '*/ 100000 idx ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'ah',
                '*/ ss a3 100000'
            ],
            [
                'y3',
                '+- hR th 0'
            ],
            [
                'q2',
                '*/ w w 1'
            ],
            [
                'q3',
                '*/ ah ah 1'
            ],
            [
                'q4',
                '+- q2 0 q3'
            ],
            [
                'q5',
                'sqrt q4'
            ],
            [
                'dy',
                '*/ q5 hR w'
            ],
            [
                'y5',
                '+- hR dy 0'
            ],
            [
                'y7',
                '+- y3 dy 0'
            ],
            [
                'q6',
                '+- aw 0 th'
            ],
            [
                'dh',
                '*/ q6 1 2'
            ],
            [
                'y4',
                '+- y5 0 dh'
            ],
            [
                'y8',
                '+- y7 dh 0'
            ],
            [
                'aw2',
                '*/ aw 1 2'
            ],
            [
                'y6',
                '+- b 0 aw2'
            ],
            [
                'x1',
                '+- r 0 ah'
            ],
            [
                'swAng',
                'at2 ah dy'
            ],
            [
                'stAng',
                '+- cd2 0 swAng'
            ],
            [
                'mswAng',
                '+- 0 0 swAng'
            ],
            [
                'ix',
                '+- r 0 idx'
            ],
            [
                'iy',
                '+/ hR y3 2'
            ],
            [
                'q12',
                '*/ th 1 2'
            ],
            [
                'dang2',
                'at2 idx q12'
            ],
            [
                'swAng2',
                '+- dang2 0 cd4'
            ],
            [
                'swAng3',
                '+- cd4 dang2 0'
            ],
            [
                'stAng3',
                '+- cd2 0 dang2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': 'mswAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'stAng',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'th'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'stAng3',
                        'sweepAngle': 'swAng3'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': 'mswAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'stAng',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'th'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'swAng2'
                    }
                ]
            }
        ]
    },
    'curvedLeftArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 25000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'a1',
                'pin 0 adj1 a2'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw',
                '*/ ss a2 100000'
            ],
            [
                'q1',
                '+/ th aw 4'
            ],
            [
                'hR',
                '+- hd2 0 q1'
            ],
            [
                'q7',
                '*/ hR 2 1'
            ],
            [
                'q8',
                '*/ q7 q7 1'
            ],
            [
                'q9',
                '*/ th th 1'
            ],
            [
                'q10',
                '+- q8 0 q9'
            ],
            [
                'q11',
                'sqrt q10'
            ],
            [
                'idx',
                '*/ q11 w q7'
            ],
            [
                'maxAdj3',
                '*/ 100000 idx ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'ah',
                '*/ ss a3 100000'
            ],
            [
                'y3',
                '+- hR th 0'
            ],
            [
                'q2',
                '*/ w w 1'
            ],
            [
                'q3',
                '*/ ah ah 1'
            ],
            [
                'q4',
                '+- q2 0 q3'
            ],
            [
                'q5',
                'sqrt q4'
            ],
            [
                'dy',
                '*/ q5 hR w'
            ],
            [
                'y5',
                '+- hR dy 0'
            ],
            [
                'y7',
                '+- y3 dy 0'
            ],
            [
                'q6',
                '+- aw 0 th'
            ],
            [
                'dh',
                '*/ q6 1 2'
            ],
            [
                'y4',
                '+- y5 0 dh'
            ],
            [
                'y8',
                '+- y7 dh 0'
            ],
            [
                'aw2',
                '*/ aw 1 2'
            ],
            [
                'y6',
                '+- b 0 aw2'
            ],
            [
                'x1',
                '+- l ah 0'
            ],
            [
                'swAng',
                'at2 ah dy'
            ],
            [
                'mswAng',
                '+- 0 0 swAng'
            ],
            [
                'ix',
                '+- l idx 0'
            ],
            [
                'iy',
                '+/ hR y3 2'
            ],
            [
                'q12',
                '*/ th 1 2'
            ],
            [
                'dang2',
                'at2 idx q12'
            ],
            [
                'swAng2',
                '+- dang2 0 swAng'
            ],
            [
                'swAng3',
                '+- swAng dang2 0'
            ],
            [
                'stAng3',
                '+- 0 0 dang2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'swAng',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'stAng3',
                        'sweepAngle': 'swAng3'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'w',
                        'heightRadius': 'hR',
                        'startAngle': 'swAng',
                        'sweepAngle': 'swAng2'
                    }
                ]
            }
        ]
    },
    'curvedDownArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 25000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 w ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw',
                '*/ ss a2 100000'
            ],
            [
                'q1',
                '+/ th aw 4'
            ],
            [
                'wR',
                '+- wd2 0 q1'
            ],
            [
                'q7',
                '*/ wR 2 1'
            ],
            [
                'q8',
                '*/ q7 q7 1'
            ],
            [
                'q9',
                '*/ th th 1'
            ],
            [
                'q10',
                '+- q8 0 q9'
            ],
            [
                'q11',
                'sqrt q10'
            ],
            [
                'idy',
                '*/ q11 h q7'
            ],
            [
                'maxAdj3',
                '*/ 100000 idy ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'ah',
                '*/ ss adj3 100000'
            ],
            [
                'x3',
                '+- wR th 0'
            ],
            [
                'q2',
                '*/ h h 1'
            ],
            [
                'q3',
                '*/ ah ah 1'
            ],
            [
                'q4',
                '+- q2 0 q3'
            ],
            [
                'q5',
                'sqrt q4'
            ],
            [
                'dx',
                '*/ q5 wR h'
            ],
            [
                'x5',
                '+- wR dx 0'
            ],
            [
                'x7',
                '+- x3 dx 0'
            ],
            [
                'q6',
                '+- aw 0 th'
            ],
            [
                'dh',
                '*/ q6 1 2'
            ],
            [
                'x4',
                '+- x5 0 dh'
            ],
            [
                'x8',
                '+- x7 dh 0'
            ],
            [
                'aw2',
                '*/ aw 1 2'
            ],
            [
                'x6',
                '+- r 0 aw2'
            ],
            [
                'y1',
                '+- b 0 ah'
            ],
            [
                'swAng',
                'at2 ah dx'
            ],
            [
                'mswAng',
                '+- 0 0 swAng'
            ],
            [
                'iy',
                '+- b 0 idy'
            ],
            [
                'ix',
                '+/ wR x3 2'
            ],
            [
                'q12',
                '*/ th 1 2'
            ],
            [
                'dang2',
                'at2 idy q12'
            ],
            [
                'stAng',
                '+- 3cd4 swAng 0'
            ],
            [
                'stAng2',
                '+- 3cd4 0 dang2'
            ],
            [
                'swAng2',
                '+- dang2 0 cd4'
            ],
            [
                'swAng3',
                '+- cd4 dang2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng',
                        'sweepAngle': 'mswAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': '3cd4',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ix',
                                'y': 'iy'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng2',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd2',
                        'sweepAngle': 'swAng3'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ix',
                                'y': 'iy'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng2',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': '3cd4',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng',
                        'sweepAngle': 'mswAng'
                    }
                ]
            }
        ]
    },
    'curvedUpArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 25000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 w ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'aw',
                '*/ ss a2 100000'
            ],
            [
                'q1',
                '+/ th aw 4'
            ],
            [
                'wR',
                '+- wd2 0 q1'
            ],
            [
                'q7',
                '*/ wR 2 1'
            ],
            [
                'q8',
                '*/ q7 q7 1'
            ],
            [
                'q9',
                '*/ th th 1'
            ],
            [
                'q10',
                '+- q8 0 q9'
            ],
            [
                'q11',
                'sqrt q10'
            ],
            [
                'idy',
                '*/ q11 h q7'
            ],
            [
                'maxAdj3',
                '*/ 100000 idy ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'ah',
                '*/ ss adj3 100000'
            ],
            [
                'x3',
                '+- wR th 0'
            ],
            [
                'q2',
                '*/ h h 1'
            ],
            [
                'q3',
                '*/ ah ah 1'
            ],
            [
                'q4',
                '+- q2 0 q3'
            ],
            [
                'q5',
                'sqrt q4'
            ],
            [
                'dx',
                '*/ q5 wR h'
            ],
            [
                'x5',
                '+- wR dx 0'
            ],
            [
                'x7',
                '+- x3 dx 0'
            ],
            [
                'q6',
                '+- aw 0 th'
            ],
            [
                'dh',
                '*/ q6 1 2'
            ],
            [
                'x4',
                '+- x5 0 dh'
            ],
            [
                'x8',
                '+- x7 dh 0'
            ],
            [
                'aw2',
                '*/ aw 1 2'
            ],
            [
                'x6',
                '+- r 0 aw2'
            ],
            [
                'y1',
                '+- t ah 0'
            ],
            [
                'swAng',
                'at2 ah dx'
            ],
            [
                'mswAng',
                '+- 0 0 swAng'
            ],
            [
                'iy',
                '+- t idy 0'
            ],
            [
                'ix',
                '+/ wR x3 2'
            ],
            [
                'q12',
                '*/ th 1 2'
            ],
            [
                'dang2',
                'at2 idy q12'
            ],
            [
                'swAng2',
                '+- dang2 0 swAng'
            ],
            [
                'mswAng2',
                '+- 0 0 swAng2'
            ],
            [
                'stAng3',
                '+- cd4 0 swAng'
            ],
            [
                'swAng3',
                '+- swAng dang2 0'
            ],
            [
                'stAng2',
                '+- cd4 0 dang2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng3',
                        'sweepAngle': 'swAng3'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng2',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'wR',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'th',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd2',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ix',
                                'y': 'iy'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng2',
                        'sweepAngle': 'swAng2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'stAng3',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wR',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'th',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wR',
                        'heightRadius': 'h',
                        'startAngle': 'cd2',
                        'sweepAngle': '-5400000'
                    }
                ]
            }
        ]
    },
    'stripedRightArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 84375 w ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'x4',
                '*/ ss 5 32'
            ],
            [
                'dx5',
                '*/ ss a2 100000'
            ],
            [
                'x5',
                '+- r 0 dx5'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc dy1 0'
            ],
            [
                'dx6',
                '*/ dy1 dx5 hd2'
            ],
            [
                'x6',
                '+- r 0 dx6'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ssd32',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ssd32',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ssd16',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ssd8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ssd8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ssd16',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'notchedRightArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 100000 w ss'
            ],
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'dx2',
                '*/ ss a2 100000'
            ],
            [
                'x2',
                '+- r 0 dx2'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc dy1 0'
            ],
            [
                'x1',
                '*/ dy1 dx2 hd2'
            ],
            [
                'x3',
                '+- r 0 x1'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'homePlate': {
        'family': 'arrows',
        'defaults': {
            'adj': 50000
        },
        'guides': [
            [
                'maxAdj',
                '*/ 100000 w ss'
            ],
            [
                'a',
                'pin 0 adj maxAdj'
            ],
            [
                'dx1',
                '*/ ss a 100000'
            ],
            [
                'x1',
                '+- r 0 dx1'
            ],
            [
                'ir',
                '+/ x1 r 2'
            ],
            [
                'x2',
                '*/ x1 1 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'chevron': {
        'family': 'arrows',
        'defaults': {
            'adj': 50000
        },
        'guides': [
            [
                'maxAdj',
                '*/ 100000 w ss'
            ],
            [
                'a',
                'pin 0 adj maxAdj'
            ],
            [
                'x1',
                '*/ ss a 100000'
            ],
            [
                'x2',
                '+- r 0 x1'
            ],
            [
                'x3',
                '*/ x2 1 2'
            ],
            [
                'dx',
                '+- x2 0 x1'
            ],
            [
                'il',
                '?: dx x1 l'
            ],
            [
                'ir',
                '?: dx x2 r'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'rightArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 64977
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ 100000 w ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 ss w'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'dy1',
                '*/ ss a2 100000'
            ],
            [
                'dy2',
                '*/ ss a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc dy2 0'
            ],
            [
                'y4',
                '+- vc dy1 0'
            ],
            [
                'dx3',
                '*/ ss a3 100000'
            ],
            [
                'x3',
                '+- r 0 dx3'
            ],
            [
                'x2',
                '*/ w a4 100000'
            ],
            [
                'x1',
                '*/ x2 1 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'downArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 64977
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 w ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ 100000 h ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 ss h'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'dx1',
                '*/ ss a2 100000'
            ],
            [
                'dx2',
                '*/ ss a1 200000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc dx2 0'
            ],
            [
                'x4',
                '+- hc dx1 0'
            ],
            [
                'dy3',
                '*/ ss a3 100000'
            ],
            [
                'y3',
                '+- b 0 dy3'
            ],
            [
                'y2',
                '*/ h a4 100000'
            ],
            [
                'y1',
                '*/ y2 1 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 64977
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ 100000 w ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 ss w'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'dy1',
                '*/ ss a2 100000'
            ],
            [
                'dy2',
                '*/ ss a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc dy2 0'
            ],
            [
                'y4',
                '+- vc dy1 0'
            ],
            [
                'x1',
                '*/ ss a3 100000'
            ],
            [
                'dx2',
                '*/ w a4 100000'
            ],
            [
                'x2',
                '+- r 0 dx2'
            ],
            [
                'x3',
                '+/ x2 r 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'upArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 64977
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 w ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ 100000 h ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 ss h'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'dx1',
                '*/ ss a2 100000'
            ],
            [
                'dx2',
                '*/ ss a1 200000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc dx2 0'
            ],
            [
                'x4',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '*/ ss a3 100000'
            ],
            [
                'dy2',
                '*/ h a4 100000'
            ],
            [
                'y2',
                '+- b 0 dy2'
            ],
            [
                'y3',
                '+/ y2 b 2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftRightArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 25000,
            'adj3': 25000,
            'adj4': 48123
        },
        'guides': [
            [
                'maxAdj2',
                '*/ 50000 h ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '*/ 50000 w ss'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 ss wd2'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin 0 adj4 maxAdj4'
            ],
            [
                'dy1',
                '*/ ss a2 100000'
            ],
            [
                'dy2',
                '*/ ss a1 200000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc dy2 0'
            ],
            [
                'y4',
                '+- vc dy1 0'
            ],
            [
                'x1',
                '*/ ss a3 100000'
            ],
            [
                'x4',
                '+- r 0 x1'
            ],
            [
                'dx2',
                '*/ w a4 200000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc dx2 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'quadArrowCallout': {
        'family': 'arrows',
        'defaults': {
            'adj1': 18515,
            'adj2': 18515,
            'adj3': 18515,
            'adj4': 48123
        },
        'guides': [
            [
                'a2',
                'pin 0 adj2 50000'
            ],
            [
                'maxAdj1',
                '*/ a2 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'maxAdj3',
                '+- 50000 0 a2'
            ],
            [
                'a3',
                'pin 0 adj3 maxAdj3'
            ],
            [
                'q2',
                '*/ a3 2 1'
            ],
            [
                'maxAdj4',
                '+- 100000 0 q2'
            ],
            [
                'a4',
                'pin a1 adj4 maxAdj4'
            ],
            [
                'dx2',
                '*/ ss a2 100000'
            ],
            [
                'dx3',
                '*/ ss a1 200000'
            ],
            [
                'ah',
                '*/ ss a3 100000'
            ],
            [
                'dx1',
                '*/ w a4 200000'
            ],
            [
                'dy1',
                '*/ h a4 200000'
            ],
            [
                'x8',
                '+- r 0 ah'
            ],
            [
                'x2',
                '+- hc 0 dx1'
            ],
            [
                'x7',
                '+- hc dx1 0'
            ],
            [
                'x3',
                '+- hc 0 dx2'
            ],
            [
                'x6',
                '+- hc dx2 0'
            ],
            [
                'x4',
                '+- hc 0 dx3'
            ],
            [
                'x5',
                '+- hc dx3 0'
            ],
            [
                'y8',
                '+- b 0 ah'
            ],
            [
                'y2',
                '+- vc 0 dy1'
            ],
            [
                'y7',
                '+- vc dy1 0'
            ],
            [
                'y3',
                '+- vc 0 dx2'
            ],
            [
                'y6',
                '+- vc dx2 0'
            ],
            [
                'y4',
                '+- vc 0 dx3'
            ],
            [
                'y5',
                '+- vc dx3 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ah',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ah',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ah'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ah'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'ah'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'ah'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ah',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ah',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'circularArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 12500,
            'adj2': 19,
            'adj3': 341,
            'adj4': 180,
            'adj5': 12500
        },
        'guides': [
            [
                'a5',
                'pin 0 adj5 25000'
            ],
            [
                'maxAdj1',
                '*/ a5 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'enAng',
                'pin 1 adj3 21599999'
            ],
            [
                'stAng',
                'pin 0 adj4 21599999'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'thh',
                '*/ ss a5 100000'
            ],
            [
                'th2',
                '*/ th 1 2'
            ],
            [
                'rw1',
                '+- wd2 th2 thh'
            ],
            [
                'rh1',
                '+- hd2 th2 thh'
            ],
            [
                'rw2',
                '+- rw1 0 th'
            ],
            [
                'rh2',
                '+- rh1 0 th'
            ],
            [
                'rw3',
                '+- rw2 th2 0'
            ],
            [
                'rh3',
                '+- rh2 th2 0'
            ],
            [
                'wtH',
                'sin rw3 enAng'
            ],
            [
                'htH',
                'cos rh3 enAng'
            ],
            [
                'dxH',
                'cat2 rw3 htH wtH'
            ],
            [
                'dyH',
                'sat2 rh3 htH wtH'
            ],
            [
                'xH',
                '+- hc dxH 0'
            ],
            [
                'yH',
                '+- vc dyH 0'
            ],
            [
                'rI',
                'min rw2 rh2'
            ],
            [
                'u1',
                '*/ dxH dxH 1'
            ],
            [
                'u2',
                '*/ dyH dyH 1'
            ],
            [
                'u3',
                '*/ rI rI 1'
            ],
            [
                'u4',
                '+- u1 0 u3'
            ],
            [
                'u5',
                '+- u2 0 u3'
            ],
            [
                'u6',
                '*/ u4 u5 u1'
            ],
            [
                'u7',
                '*/ u6 1 u2'
            ],
            [
                'u8',
                '+- 1 0 u7'
            ],
            [
                'u9',
                'sqrt u8'
            ],
            [
                'u10',
                '*/ u4 1 dxH'
            ],
            [
                'u11',
                '*/ u10 1 dyH'
            ],
            [
                'u12',
                '+/ 1 u9 u11'
            ],
            [
                'u13',
                'at2 1 u12'
            ],
            [
                'u14',
                '+- u13 21600000 0'
            ],
            [
                'u15',
                '?: u13 u13 u14'
            ],
            [
                'u16',
                '+- u15 0 enAng'
            ],
            [
                'u17',
                '+- u16 21600000 0'
            ],
            [
                'u18',
                '?: u16 u16 u17'
            ],
            [
                'u19',
                '+- u18 0 cd2'
            ],
            [
                'u20',
                '+- u18 0 21600000'
            ],
            [
                'u21',
                '?: u19 u20 u18'
            ],
            [
                'maxAng',
                'abs u21'
            ],
            [
                'aAng',
                'pin 0 adj2 maxAng'
            ],
            [
                'ptAng',
                '+- enAng aAng 0'
            ],
            [
                'wtA',
                'sin rw3 ptAng'
            ],
            [
                'htA',
                'cos rh3 ptAng'
            ],
            [
                'dxA',
                'cat2 rw3 htA wtA'
            ],
            [
                'dyA',
                'sat2 rh3 htA wtA'
            ],
            [
                'xA',
                '+- hc dxA 0'
            ],
            [
                'yA',
                '+- vc dyA 0'
            ],
            [
                'wtE',
                'sin rw1 stAng'
            ],
            [
                'htE',
                'cos rh1 stAng'
            ],
            [
                'dxE',
                'cat2 rw1 htE wtE'
            ],
            [
                'dyE',
                'sat2 rh1 htE wtE'
            ],
            [
                'xE',
                '+- hc dxE 0'
            ],
            [
                'yE',
                '+- vc dyE 0'
            ],
            [
                'dxG',
                'cos thh ptAng'
            ],
            [
                'dyG',
                'sin thh ptAng'
            ],
            [
                'xG',
                '+- xH dxG 0'
            ],
            [
                'yG',
                '+- yH dyG 0'
            ],
            [
                'dxB',
                'cos thh ptAng'
            ],
            [
                'dyB',
                'sin thh ptAng'
            ],
            [
                'xB',
                '+- xH 0 dxB 0'
            ],
            [
                'yB',
                '+- yH 0 dyB 0'
            ],
            [
                'sx1',
                '+- xB 0 hc'
            ],
            [
                'sy1',
                '+- yB 0 vc'
            ],
            [
                'sx2',
                '+- xG 0 hc'
            ],
            [
                'sy2',
                '+- yG 0 vc'
            ],
            [
                'rO',
                'min rw1 rh1'
            ],
            [
                'x1O',
                '*/ sx1 rO rw1'
            ],
            [
                'y1O',
                '*/ sy1 rO rh1'
            ],
            [
                'x2O',
                '*/ sx2 rO rw1'
            ],
            [
                'y2O',
                '*/ sy2 rO rh1'
            ],
            [
                'dxO',
                '+- x2O 0 x1O'
            ],
            [
                'dyO',
                '+- y2O 0 y1O'
            ],
            [
                'dO',
                'mod dxO dyO 0'
            ],
            [
                'q1',
                '*/ x1O y2O 1'
            ],
            [
                'q2',
                '*/ x2O y1O 1'
            ],
            [
                'DO',
                '+- q1 0 q2'
            ],
            [
                'q3',
                '*/ rO rO 1'
            ],
            [
                'q4',
                '*/ dO dO 1'
            ],
            [
                'q5',
                '*/ q3 q4 1'
            ],
            [
                'q6',
                '*/ DO DO 1'
            ],
            [
                'q7',
                '+- q5 0 q6'
            ],
            [
                'q8',
                'max q7 0'
            ],
            [
                'sdelO',
                'sqrt q8'
            ],
            [
                'ndyO',
                '*/ dyO -1 1'
            ],
            [
                'sdyO',
                '?: ndyO -1 1'
            ],
            [
                'q9',
                '*/ sdyO dxO 1'
            ],
            [
                'q10',
                '*/ q9 sdelO 1'
            ],
            [
                'q11',
                '*/ DO dyO 1'
            ],
            [
                'dxF1',
                '+/ q11 q10 q4'
            ],
            [
                'q12',
                '+- q11 0 q10'
            ],
            [
                'dxF2',
                '*/ q12 1 q4'
            ],
            [
                'adyO',
                'abs dyO'
            ],
            [
                'q13',
                '*/ adyO sdelO 1'
            ],
            [
                'q14',
                '*/ DO dxO -1'
            ],
            [
                'dyF1',
                '+/ q14 q13 q4'
            ],
            [
                'q15',
                '+- q14 0 q13'
            ],
            [
                'dyF2',
                '*/ q15 1 q4'
            ],
            [
                'q16',
                '+- x2O 0 dxF1'
            ],
            [
                'q17',
                '+- x2O 0 dxF2'
            ],
            [
                'q18',
                '+- y2O 0 dyF1'
            ],
            [
                'q19',
                '+- y2O 0 dyF2'
            ],
            [
                'q20',
                'mod q16 q18 0'
            ],
            [
                'q21',
                'mod q17 q19 0'
            ],
            [
                'q22',
                '+- q21 0 q20'
            ],
            [
                'dxF',
                '?: q22 dxF1 dxF2'
            ],
            [
                'dyF',
                '?: q22 dyF1 dyF2'
            ],
            [
                'sdxF',
                '*/ dxF rw1 rO'
            ],
            [
                'sdyF',
                '*/ dyF rh1 rO'
            ],
            [
                'xF',
                '+- hc sdxF 0'
            ],
            [
                'yF',
                '+- vc sdyF 0'
            ],
            [
                'x1I',
                '*/ sx1 rI rw2'
            ],
            [
                'y1I',
                '*/ sy1 rI rh2'
            ],
            [
                'x2I',
                '*/ sx2 rI rw2'
            ],
            [
                'y2I',
                '*/ sy2 rI rh2'
            ],
            [
                'dxI',
                '+- x2I 0 x1I'
            ],
            [
                'dyI',
                '+- y2I 0 y1I'
            ],
            [
                'dI',
                'mod dxI dyI 0'
            ],
            [
                'v1',
                '*/ x1I y2I 1'
            ],
            [
                'v2',
                '*/ x2I y1I 1'
            ],
            [
                'DI',
                '+- v1 0 v2'
            ],
            [
                'v3',
                '*/ rI rI 1'
            ],
            [
                'v4',
                '*/ dI dI 1'
            ],
            [
                'v5',
                '*/ v3 v4 1'
            ],
            [
                'v6',
                '*/ DI DI 1'
            ],
            [
                'v7',
                '+- v5 0 v6'
            ],
            [
                'v8',
                'max v7 0'
            ],
            [
                'sdelI',
                'sqrt v8'
            ],
            [
                'v9',
                '*/ sdyO dxI 1'
            ],
            [
                'v10',
                '*/ v9 sdelI 1'
            ],
            [
                'v11',
                '*/ DI dyI 1'
            ],
            [
                'dxC1',
                '+/ v11 v10 v4'
            ],
            [
                'v12',
                '+- v11 0 v10'
            ],
            [
                'dxC2',
                '*/ v12 1 v4'
            ],
            [
                'adyI',
                'abs dyI'
            ],
            [
                'v13',
                '*/ adyI sdelI 1'
            ],
            [
                'v14',
                '*/ DI dxI -1'
            ],
            [
                'dyC1',
                '+/ v14 v13 v4'
            ],
            [
                'v15',
                '+- v14 0 v13'
            ],
            [
                'dyC2',
                '*/ v15 1 v4'
            ],
            [
                'v16',
                '+- x1I 0 dxC1'
            ],
            [
                'v17',
                '+- x1I 0 dxC2'
            ],
            [
                'v18',
                '+- y1I 0 dyC1'
            ],
            [
                'v19',
                '+- y1I 0 dyC2'
            ],
            [
                'v20',
                'mod v16 v18 0'
            ],
            [
                'v21',
                'mod v17 v19 0'
            ],
            [
                'v22',
                '+- v21 0 v20'
            ],
            [
                'dxC',
                '?: v22 dxC1 dxC2'
            ],
            [
                'dyC',
                '?: v22 dyC1 dyC2'
            ],
            [
                'sdxC',
                '*/ dxC rw2 rI'
            ],
            [
                'sdyC',
                '*/ dyC rh2 rI'
            ],
            [
                'xC',
                '+- hc sdxC 0'
            ],
            [
                'yC',
                '+- vc sdyC 0'
            ],
            [
                'ist0',
                'at2 sdxC sdyC'
            ],
            [
                'ist1',
                '+- ist0 21600000 0'
            ],
            [
                'istAng',
                '?: ist0 ist0 ist1'
            ],
            [
                'isw1',
                '+- stAng 0 istAng'
            ],
            [
                'isw2',
                '+- isw1 0 21600000'
            ],
            [
                'iswAng',
                '?: isw1 isw2 isw1'
            ],
            [
                'p1',
                '+- xF 0 xC'
            ],
            [
                'p2',
                '+- yF 0 yC'
            ],
            [
                'p3',
                'mod p1 p2 0'
            ],
            [
                'p4',
                '*/ p3 1 2'
            ],
            [
                'p5',
                '+- p4 0 thh'
            ],
            [
                'xGp',
                '?: p5 xF xG'
            ],
            [
                'yGp',
                '?: p5 yF yG'
            ],
            [
                'xBp',
                '?: p5 xC xB'
            ],
            [
                'yBp',
                '?: p5 yC yB'
            ],
            [
                'en0',
                'at2 sdxF sdyF'
            ],
            [
                'en1',
                '+- en0 21600000 0'
            ],
            [
                'en2',
                '?: en0 en0 en1'
            ],
            [
                'sw0',
                '+- en2 0 stAng'
            ],
            [
                'sw1',
                '+- sw0 21600000 0'
            ],
            [
                'swAng',
                '?: sw0 sw0 sw1'
            ],
            [
                'wtI',
                'sin rw3 stAng'
            ],
            [
                'htI',
                'cos rh3 stAng'
            ],
            [
                'dxI',
                'cat2 rw3 htI wtI'
            ],
            [
                'dyI',
                'sat2 rh3 htI wtI'
            ],
            [
                'xI',
                '+- hc dxI 0'
            ],
            [
                'yI',
                '+- vc dyI 0'
            ],
            [
                'aI',
                '+- stAng 0 cd4'
            ],
            [
                'aA',
                '+- ptAng cd4 0'
            ],
            [
                'aB',
                '+- ptAng cd2 0'
            ],
            [
                'idx',
                'cos rw1 2700000'
            ],
            [
                'idy',
                'sin rh1 2700000'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ib',
                '+- vc idy 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'xE',
                                'y': 'yE'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'rw1',
                        'heightRadius': 'rh1',
                        'startAngle': 'stAng',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xGp',
                                'y': 'yGp'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xA',
                                'y': 'yA'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xBp',
                                'y': 'yBp'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xC',
                                'y': 'yC'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'rw2',
                        'heightRadius': 'rh2',
                        'startAngle': 'istAng',
                        'sweepAngle': 'iswAng'
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftCircularArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 12500,
            'adj2': -1142319,
            'adj3': 1142319,
            'adj4': 10800000,
            'adj5': 12500
        },
        'guides': [
            [
                'a5',
                'pin 0 adj5 25000'
            ],
            [
                'maxAdj1',
                '*/ a5 2 1'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'enAng',
                'pin 1 adj3 21599999'
            ],
            [
                'stAng',
                'pin 0 adj4 21599999'
            ],
            [
                'th',
                '*/ ss a1 100000'
            ],
            [
                'thh',
                '*/ ss a5 100000'
            ],
            [
                'th2',
                '*/ th 1 2'
            ],
            [
                'rw1',
                '+- wd2 th2 thh'
            ],
            [
                'rh1',
                '+- hd2 th2 thh'
            ],
            [
                'rw2',
                '+- rw1 0 th'
            ],
            [
                'rh2',
                '+- rh1 0 th'
            ],
            [
                'rw3',
                '+- rw2 th2 0'
            ],
            [
                'rh3',
                '+- rh2 th2 0'
            ],
            [
                'wtH',
                'sin rw3 enAng'
            ],
            [
                'htH',
                'cos rh3 enAng'
            ],
            [
                'dxH',
                'cat2 rw3 htH wtH'
            ],
            [
                'dyH',
                'sat2 rh3 htH wtH'
            ],
            [
                'xH',
                '+- hc dxH 0'
            ],
            [
                'yH',
                '+- vc dyH 0'
            ],
            [
                'rI',
                'min rw2 rh2'
            ],
            [
                'u1',
                '*/ dxH dxH 1'
            ],
            [
                'u2',
                '*/ dyH dyH 1'
            ],
            [
                'u3',
                '*/ rI rI 1'
            ],
            [
                'u4',
                '+- u1 0 u3'
            ],
            [
                'u5',
                '+- u2 0 u3'
            ],
            [
                'u6',
                '*/ u4 u5 u1'
            ],
            [
                'u7',
                '*/ u6 1 u2'
            ],
            [
                'u8',
                '+- 1 0 u7'
            ],
            [
                'u9',
                'sqrt u8'
            ],
            [
                'u10',
                '*/ u4 1 dxH'
            ],
            [
                'u11',
                '*/ u10 1 dyH'
            ],
            [
                'u12',
                '+/ 1 u9 u11'
            ],
            [
                'u13',
                'at2 1 u12'
            ],
            [
                'u14',
                '+- u13 21600000 0'
            ],
            [
                'u15',
                '?: u13 u13 u14'
            ],
            [
                'u16',
                '+- u15 0 enAng'
            ],
            [
                'u17',
                '+- u16 21600000 0'
            ],
            [
                'u18',
                '?: u16 u16 u17'
            ],
            [
                'u19',
                '+- u18 0 cd2'
            ],
            [
                'u20',
                '+- u18 0 21600000'
            ],
            [
                'u21',
                '?: u19 u20 u18'
            ],
            [
                'u22',
                'abs u21'
            ],
            [
                'minAng',
                '*/ u22 -1 1'
            ],
            [
                'u23',
                'abs adj2'
            ],
            [
                'a2',
                '*/ u23 -1 1'
            ],
            [
                'aAng',
                'pin minAng a2 0'
            ],
            [
                'ptAng',
                '+- enAng aAng 0'
            ],
            [
                'wtA',
                'sin rw3 ptAng'
            ],
            [
                'htA',
                'cos rh3 ptAng'
            ],
            [
                'dxA',
                'cat2 rw3 htA wtA'
            ],
            [
                'dyA',
                'sat2 rh3 htA wtA'
            ],
            [
                'xA',
                '+- hc dxA 0'
            ],
            [
                'yA',
                '+- vc dyA 0'
            ],
            [
                'wtE',
                'sin rw1 stAng'
            ],
            [
                'htE',
                'cos rh1 stAng'
            ],
            [
                'dxE',
                'cat2 rw1 htE wtE'
            ],
            [
                'dyE',
                'sat2 rh1 htE wtE'
            ],
            [
                'xE',
                '+- hc dxE 0'
            ],
            [
                'yE',
                '+- vc dyE 0'
            ],
            [
                'wtD',
                'sin rw2 stAng'
            ],
            [
                'htD',
                'cos rh2 stAng'
            ],
            [
                'dxD',
                'cat2 rw2 htD wtD'
            ],
            [
                'dyD',
                'sat2 rh2 htD wtD'
            ],
            [
                'xD',
                '+- hc dxD 0'
            ],
            [
                'yD',
                '+- vc dyD 0'
            ],
            [
                'dxG',
                'cos thh ptAng'
            ],
            [
                'dyG',
                'sin thh ptAng'
            ],
            [
                'xG',
                '+- xH dxG 0'
            ],
            [
                'yG',
                '+- yH dyG 0'
            ],
            [
                'dxB',
                'cos thh ptAng'
            ],
            [
                'dyB',
                'sin thh ptAng'
            ],
            [
                'xB',
                '+- xH 0 dxB 0'
            ],
            [
                'yB',
                '+- yH 0 dyB 0'
            ],
            [
                'sx1',
                '+- xB 0 hc'
            ],
            [
                'sy1',
                '+- yB 0 vc'
            ],
            [
                'sx2',
                '+- xG 0 hc'
            ],
            [
                'sy2',
                '+- yG 0 vc'
            ],
            [
                'rO',
                'min rw1 rh1'
            ],
            [
                'x1O',
                '*/ sx1 rO rw1'
            ],
            [
                'y1O',
                '*/ sy1 rO rh1'
            ],
            [
                'x2O',
                '*/ sx2 rO rw1'
            ],
            [
                'y2O',
                '*/ sy2 rO rh1'
            ],
            [
                'dxO',
                '+- x2O 0 x1O'
            ],
            [
                'dyO',
                '+- y2O 0 y1O'
            ],
            [
                'dO',
                'mod dxO dyO 0'
            ],
            [
                'q1',
                '*/ x1O y2O 1'
            ],
            [
                'q2',
                '*/ x2O y1O 1'
            ],
            [
                'DO',
                '+- q1 0 q2'
            ],
            [
                'q3',
                '*/ rO rO 1'
            ],
            [
                'q4',
                '*/ dO dO 1'
            ],
            [
                'q5',
                '*/ q3 q4 1'
            ],
            [
                'q6',
                '*/ DO DO 1'
            ],
            [
                'q7',
                '+- q5 0 q6'
            ],
            [
                'q8',
                'max q7 0'
            ],
            [
                'sdelO',
                'sqrt q8'
            ],
            [
                'ndyO',
                '*/ dyO -1 1'
            ],
            [
                'sdyO',
                '?: ndyO -1 1'
            ],
            [
                'q9',
                '*/ sdyO dxO 1'
            ],
            [
                'q10',
                '*/ q9 sdelO 1'
            ],
            [
                'q11',
                '*/ DO dyO 1'
            ],
            [
                'dxF1',
                '+/ q11 q10 q4'
            ],
            [
                'q12',
                '+- q11 0 q10'
            ],
            [
                'dxF2',
                '*/ q12 1 q4'
            ],
            [
                'adyO',
                'abs dyO'
            ],
            [
                'q13',
                '*/ adyO sdelO 1'
            ],
            [
                'q14',
                '*/ DO dxO -1'
            ],
            [
                'dyF1',
                '+/ q14 q13 q4'
            ],
            [
                'q15',
                '+- q14 0 q13'
            ],
            [
                'dyF2',
                '*/ q15 1 q4'
            ],
            [
                'q16',
                '+- x2O 0 dxF1'
            ],
            [
                'q17',
                '+- x2O 0 dxF2'
            ],
            [
                'q18',
                '+- y2O 0 dyF1'
            ],
            [
                'q19',
                '+- y2O 0 dyF2'
            ],
            [
                'q20',
                'mod q16 q18 0'
            ],
            [
                'q21',
                'mod q17 q19 0'
            ],
            [
                'q22',
                '+- q21 0 q20'
            ],
            [
                'dxF',
                '?: q22 dxF1 dxF2'
            ],
            [
                'dyF',
                '?: q22 dyF1 dyF2'
            ],
            [
                'sdxF',
                '*/ dxF rw1 rO'
            ],
            [
                'sdyF',
                '*/ dyF rh1 rO'
            ],
            [
                'xF',
                '+- hc sdxF 0'
            ],
            [
                'yF',
                '+- vc sdyF 0'
            ],
            [
                'x1I',
                '*/ sx1 rI rw2'
            ],
            [
                'y1I',
                '*/ sy1 rI rh2'
            ],
            [
                'x2I',
                '*/ sx2 rI rw2'
            ],
            [
                'y2I',
                '*/ sy2 rI rh2'
            ],
            [
                'dxI',
                '+- x2I 0 x1I'
            ],
            [
                'dyI',
                '+- y2I 0 y1I'
            ],
            [
                'dI',
                'mod dxI dyI 0'
            ],
            [
                'v1',
                '*/ x1I y2I 1'
            ],
            [
                'v2',
                '*/ x2I y1I 1'
            ],
            [
                'DI',
                '+- v1 0 v2'
            ],
            [
                'v3',
                '*/ rI rI 1'
            ],
            [
                'v4',
                '*/ dI dI 1'
            ],
            [
                'v5',
                '*/ v3 v4 1'
            ],
            [
                'v6',
                '*/ DI DI 1'
            ],
            [
                'v7',
                '+- v5 0 v6'
            ],
            [
                'v8',
                'max v7 0'
            ],
            [
                'sdelI',
                'sqrt v8'
            ],
            [
                'v9',
                '*/ sdyO dxI 1'
            ],
            [
                'v10',
                '*/ v9 sdelI 1'
            ],
            [
                'v11',
                '*/ DI dyI 1'
            ],
            [
                'dxC1',
                '+/ v11 v10 v4'
            ],
            [
                'v12',
                '+- v11 0 v10'
            ],
            [
                'dxC2',
                '*/ v12 1 v4'
            ],
            [
                'adyI',
                'abs dyI'
            ],
            [
                'v13',
                '*/ adyI sdelI 1'
            ],
            [
                'v14',
                '*/ DI dxI -1'
            ],
            [
                'dyC1',
                '+/ v14 v13 v4'
            ],
            [
                'v15',
                '+- v14 0 v13'
            ],
            [
                'dyC2',
                '*/ v15 1 v4'
            ],
            [
                'v16',
                '+- x1I 0 dxC1'
            ],
            [
                'v17',
                '+- x1I 0 dxC2'
            ],
            [
                'v18',
                '+- y1I 0 dyC1'
            ],
            [
                'v19',
                '+- y1I 0 dyC2'
            ],
            [
                'v20',
                'mod v16 v18 0'
            ],
            [
                'v21',
                'mod v17 v19 0'
            ],
            [
                'v22',
                '+- v21 0 v20'
            ],
            [
                'dxC',
                '?: v22 dxC1 dxC2'
            ],
            [
                'dyC',
                '?: v22 dyC1 dyC2'
            ],
            [
                'sdxC',
                '*/ dxC rw2 rI'
            ],
            [
                'sdyC',
                '*/ dyC rh2 rI'
            ],
            [
                'xC',
                '+- hc sdxC 0'
            ],
            [
                'yC',
                '+- vc sdyC 0'
            ],
            [
                'ist0',
                'at2 sdxC sdyC'
            ],
            [
                'ist1',
                '+- ist0 21600000 0'
            ],
            [
                'istAng0',
                '?: ist0 ist0 ist1'
            ],
            [
                'isw1',
                '+- stAng 0 istAng0'
            ],
            [
                'isw2',
                '+- isw1 21600000 0'
            ],
            [
                'iswAng0',
                '?: isw1 isw1 isw2'
            ],
            [
                'istAng',
                '+- istAng0 iswAng0 0'
            ],
            [
                'iswAng',
                '+- 0 0 iswAng0'
            ],
            [
                'p1',
                '+- xF 0 xC'
            ],
            [
                'p2',
                '+- yF 0 yC'
            ],
            [
                'p3',
                'mod p1 p2 0'
            ],
            [
                'p4',
                '*/ p3 1 2'
            ],
            [
                'p5',
                '+- p4 0 thh'
            ],
            [
                'xGp',
                '?: p5 xF xG'
            ],
            [
                'yGp',
                '?: p5 yF yG'
            ],
            [
                'xBp',
                '?: p5 xC xB'
            ],
            [
                'yBp',
                '?: p5 yC yB'
            ],
            [
                'en0',
                'at2 sdxF sdyF'
            ],
            [
                'en1',
                '+- en0 21600000 0'
            ],
            [
                'en2',
                '?: en0 en0 en1'
            ],
            [
                'sw0',
                '+- en2 0 stAng'
            ],
            [
                'sw1',
                '+- sw0 0 21600000'
            ],
            [
                'swAng',
                '?: sw0 sw1 sw0'
            ],
            [
                'stAng0',
                '+- stAng swAng 0'
            ],
            [
                'swAng0',
                '+- 0 0 swAng'
            ],
            [
                'wtI',
                'sin rw3 stAng'
            ],
            [
                'htI',
                'cos rh3 stAng'
            ],
            [
                'dxI',
                'cat2 rw3 htI wtI'
            ],
            [
                'dyI',
                'sat2 rh3 htI wtI'
            ],
            [
                'xI',
                '+- hc dxI 0'
            ],
            [
                'yI',
                '+- vc dyI 0'
            ],
            [
                'aI',
                '+- stAng cd4 0'
            ],
            [
                'aA',
                '+- ptAng 0 cd4'
            ],
            [
                'aB',
                '+- ptAng cd2 0'
            ],
            [
                'idx',
                'cos rw1 2700000'
            ],
            [
                'idy',
                'sin rh1 2700000'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ib',
                '+- vc idy 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'xE',
                                'y': 'yE'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xD',
                                'y': 'yD'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'rw2',
                        'heightRadius': 'rh2',
                        'startAngle': 'istAng',
                        'sweepAngle': 'iswAng'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xBp',
                                'y': 'yBp'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xA',
                                'y': 'yA'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xGp',
                                'y': 'yGp'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xF',
                                'y': 'yF'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'rw1',
                        'heightRadius': 'rh1',
                        'startAngle': 'stAng0',
                        'sweepAngle': 'swAng0'
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'swooshArrow': {
        'family': 'arrows',
        'defaults': {
            'adj1': 25000,
            'adj2': 16667
        },
        'guides': [
            [
                'a1',
                'pin 1 adj1 75000'
            ],
            [
                'maxAdj2',
                '*/ 70000 w ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'ad1',
                '*/ h a1 100000'
            ],
            [
                'ad2',
                '*/ ss a2 100000'
            ],
            [
                'xB',
                '+- r 0 ad2'
            ],
            [
                'yB',
                '+- t ssd8 0'
            ],
            [
                'alfa',
                '*/ cd4 1 14'
            ],
            [
                'dx0',
                'tan ssd8 alfa'
            ],
            [
                'xC',
                '+- xB 0 dx0'
            ],
            [
                'dx1',
                'tan ad1 alfa'
            ],
            [
                'yF',
                '+- yB ad1 0'
            ],
            [
                'xF',
                '+- xB dx1 0'
            ],
            [
                'xE',
                '+- xF dx0 0'
            ],
            [
                'yE',
                '+- yF ssd8 0'
            ],
            [
                'dy2',
                '+- yE 0 t'
            ],
            [
                'dy22',
                '*/ dy2 1 2'
            ],
            [
                'dy3',
                '*/ h 1 20'
            ],
            [
                'yD',
                '+- t dy22 dy3'
            ],
            [
                'dy4',
                '*/ hd6 1 1'
            ],
            [
                'yP1',
                '+- hd6 dy4 0'
            ],
            [
                'xP1',
                'val wd6'
            ],
            [
                'dy5',
                '*/ hd6 1 2'
            ],
            [
                'yP2',
                '+- yF dy5 0'
            ],
            [
                'xP2',
                'val wd4'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'xP1',
                                'y': 'yP1'
                            },
                            {
                                'x': 'xB',
                                'y': 'yB'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xC',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'yD'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xE',
                                'y': 'yE'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xF',
                                'y': 'yF'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'xP2',
                                'y': 'yP2'
                            },
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'irregularSeal1': {
        'family': 'stars',
        'defaults': {},
        'guides': [
            [
                'x5',
                '*/ w 4627 21600'
            ],
            [
                'x12',
                '*/ w 8485 21600'
            ],
            [
                'x21',
                '*/ w 16702 21600'
            ],
            [
                'x24',
                '*/ w 14522 21600'
            ],
            [
                'y3',
                '*/ h 6320 21600'
            ],
            [
                'y6',
                '*/ h 8615 21600'
            ],
            [
                'y9',
                '*/ h 13937 21600'
            ],
            [
                'y18',
                '*/ h 13290 21600'
            ]
        ],
        'paths': [
            {
                'width': '21600',
                'height': '21600',
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '10800',
                                'y': '5800'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14522',
                                'y': '0'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14155',
                                'y': '5325'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '18380',
                                'y': '4457'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '16702',
                                'y': '7315'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '21097',
                                'y': '8137'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '17607',
                                'y': '10475'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '21600',
                                'y': '13290'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '16837',
                                'y': '12942'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '18145',
                                'y': '18095'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14020',
                                'y': '14457'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '13247',
                                'y': '19737'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '10532',
                                'y': '14935'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '8485',
                                'y': '21600'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '7715',
                                'y': '15627'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '4762',
                                'y': '17617'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '5667',
                                'y': '13937'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '135',
                                'y': '14587'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '3722',
                                'y': '11775'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '0',
                                'y': '8615'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '4627',
                                'y': '7617'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '370',
                                'y': '2295'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '7312',
                                'y': '6320'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '8352',
                                'y': '2295'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'irregularSeal2': {
        'family': 'stars',
        'defaults': {},
        'guides': [
            [
                'x2',
                '*/ w 9722 21600'
            ],
            [
                'x5',
                '*/ w 5372 21600'
            ],
            [
                'x16',
                '*/ w 11612 21600'
            ],
            [
                'x19',
                '*/ w 14640 21600'
            ],
            [
                'y2',
                '*/ h 1887 21600'
            ],
            [
                'y3',
                '*/ h 6382 21600'
            ],
            [
                'y8',
                '*/ h 12877 21600'
            ],
            [
                'y14',
                '*/ h 19712 21600'
            ],
            [
                'y16',
                '*/ h 18842 21600'
            ],
            [
                'y17',
                '*/ h 15935 21600'
            ],
            [
                'y24',
                '*/ h 6645 21600'
            ]
        ],
        'paths': [
            {
                'width': '21600',
                'height': '21600',
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '11462',
                                'y': '4342'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14790',
                                'y': '0'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14525',
                                'y': '5777'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '18007',
                                'y': '3172'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '16380',
                                'y': '6532'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '21600',
                                'y': '6645'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '16985',
                                'y': '9402'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '18270',
                                'y': '11290'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '16380',
                                'y': '12310'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '18877',
                                'y': '15632'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14640',
                                'y': '14350'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '14942',
                                'y': '17370'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '12180',
                                'y': '15935'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '11612',
                                'y': '18842'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '9872',
                                'y': '17370'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '8700',
                                'y': '19712'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '7527',
                                'y': '18125'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '4917',
                                'y': '21600'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '4805',
                                'y': '18240'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '1285',
                                'y': '17825'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '3330',
                                'y': '15370'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '0',
                                'y': '12877'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '3935',
                                'y': '11592'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '1172',
                                'y': '8270'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '5372',
                                'y': '7817'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '4502',
                                'y': '3625'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '8550',
                                'y': '6382'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': '9722',
                                'y': '1887'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star4': {
        'family': 'stars',
        'defaults': {
            'adj': 12500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx',
                'cos iwd2 45'
            ],
            [
                'sdy',
                'sin ihd2 45'
            ],
            [
                'sx1',
                '+- hc 0 sdx'
            ],
            [
                'sx2',
                '+- hc sdx 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy'
            ],
            [
                'sy2',
                '+- vc sdy 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star5': {
        'family': 'stars',
        'defaults': {
            'adj': 19098,
            'hf': 105146,
            'vf': 110557
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'swd2',
                '*/ wd2 hf 100000'
            ],
            [
                'shd2',
                '*/ hd2 vf 100000'
            ],
            [
                'svc',
                '*/ vc  vf 100000'
            ],
            [
                'dx1',
                'cos swd2 18'
            ],
            [
                'dx2',
                'cos swd2 306'
            ],
            [
                'dy1',
                'sin shd2 18'
            ],
            [
                'dy2',
                'sin shd2 306'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc dx2 0'
            ],
            [
                'x4',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- svc 0 dy1'
            ],
            [
                'y2',
                '+- svc 0 dy2'
            ],
            [
                'iwd2',
                '*/ swd2 a 50000'
            ],
            [
                'ihd2',
                '*/ shd2 a 50000'
            ],
            [
                'sdx1',
                'cos iwd2 342'
            ],
            [
                'sdx2',
                'cos iwd2 54'
            ],
            [
                'sdy1',
                'sin ihd2 54'
            ],
            [
                'sdy2',
                'sin ihd2 342'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc sdx2 0'
            ],
            [
                'sx4',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- svc 0 sdy1'
            ],
            [
                'sy2',
                '+- svc 0 sdy2'
            ],
            [
                'sy3',
                '+- svc ihd2 0'
            ],
            [
                'yAdj',
                '+- svc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star6': {
        'family': 'stars',
        'defaults': {
            'adj': 28868,
            'hf': 115470
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'swd2',
                '*/ wd2 hf 100000'
            ],
            [
                'dx1',
                'cos swd2 30'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc dx1 0'
            ],
            [
                'y2',
                '+- vc hd4 0'
            ],
            [
                'iwd2',
                '*/ swd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx2',
                '*/ iwd2 1 2'
            ],
            [
                'sx1',
                '+- hc 0 iwd2'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc sdx2 0'
            ],
            [
                'sx4',
                '+- hc iwd2 0'
            ],
            [
                'sdy1',
                'sin ihd2 60'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc sdy1 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'hd4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'hd4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star7': {
        'family': 'stars',
        'defaults': {
            'adj': 34601,
            'hf': 102572,
            'vf': 105210
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'swd2',
                '*/ wd2 hf 100000'
            ],
            [
                'shd2',
                '*/ hd2 vf 100000'
            ],
            [
                'svc',
                '*/ vc  vf 100000'
            ],
            [
                'dx1',
                '*/ swd2 97493 100000'
            ],
            [
                'dx2',
                '*/ swd2 78183 100000'
            ],
            [
                'dx3',
                '*/ swd2 43388 100000'
            ],
            [
                'dy1',
                '*/ shd2 62349 100000'
            ],
            [
                'dy2',
                '*/ shd2 22252 100000'
            ],
            [
                'dy3',
                '*/ shd2 90097 100000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc dx3 0'
            ],
            [
                'x5',
                '+- hc dx2 0'
            ],
            [
                'x6',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- svc 0 dy1'
            ],
            [
                'y2',
                '+- svc dy2 0'
            ],
            [
                'y3',
                '+- svc dy3 0'
            ],
            [
                'iwd2',
                '*/ swd2 a 50000'
            ],
            [
                'ihd2',
                '*/ shd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 97493 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 78183 100000'
            ],
            [
                'sdx3',
                '*/ iwd2 43388 100000'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc 0 sdx3'
            ],
            [
                'sx4',
                '+- hc sdx3 0'
            ],
            [
                'sx5',
                '+- hc sdx2 0'
            ],
            [
                'sx6',
                '+- hc sdx1 0'
            ],
            [
                'sdy1',
                '*/ ihd2 90097 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 22252 100000'
            ],
            [
                'sdy3',
                '*/ ihd2 62349 100000'
            ],
            [
                'sy1',
                '+- svc 0 sdy1'
            ],
            [
                'sy2',
                '+- svc 0 sdy2'
            ],
            [
                'sy3',
                '+- svc sdy3 0'
            ],
            [
                'sy4',
                '+- svc ihd2 0'
            ],
            [
                'yAdj',
                '+- svc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star8': {
        'family': 'stars',
        'defaults': {
            'adj': 37500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'dx1',
                'cos wd2 45'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc dx1 0'
            ],
            [
                'dy1',
                'sin hd2 45'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 92388 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 38268 100000'
            ],
            [
                'sdy1',
                '*/ ihd2 92388 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 38268 100000'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc sdx2 0'
            ],
            [
                'sx4',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc sdy2 0'
            ],
            [
                'sy4',
                '+- vc sdy1 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star10': {
        'family': 'stars',
        'defaults': {
            'adj': 42533,
            'hf': 105146
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'swd2',
                '*/ wd2 hf 100000'
            ],
            [
                'dx1',
                '*/ swd2 95106 100000'
            ],
            [
                'dx2',
                '*/ swd2 58779 100000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc dx2 0'
            ],
            [
                'x4',
                '+- hc dx1 0'
            ],
            [
                'dy1',
                '*/ hd2 80902 100000'
            ],
            [
                'dy2',
                '*/ hd2 30902 100000'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc dy2 0'
            ],
            [
                'y4',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ swd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 80902 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 30902 100000'
            ],
            [
                'sdy1',
                '*/ ihd2 95106 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 58779 100000'
            ],
            [
                'sx1',
                '+- hc 0 iwd2'
            ],
            [
                'sx2',
                '+- hc 0 sdx1'
            ],
            [
                'sx3',
                '+- hc 0 sdx2'
            ],
            [
                'sx4',
                '+- hc sdx2 0'
            ],
            [
                'sx5',
                '+- hc sdx1 0'
            ],
            [
                'sx6',
                '+- hc iwd2 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc sdy2 0'
            ],
            [
                'sy4',
                '+- vc sdy1 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star12': {
        'family': 'stars',
        'defaults': {
            'adj': 37500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'dx1',
                'cos wd2 30'
            ],
            [
                'dy1',
                'sin hd2 60'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x3',
                '*/ w 3 4'
            ],
            [
                'x4',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y3',
                '*/ h 3 4'
            ],
            [
                'y4',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                'cos iwd2 15'
            ],
            [
                'sdx2',
                'cos iwd2 45'
            ],
            [
                'sdx3',
                'cos iwd2 75'
            ],
            [
                'sdy1',
                'sin ihd2 75'
            ],
            [
                'sdy2',
                'sin ihd2 45'
            ],
            [
                'sdy3',
                'sin ihd2 15'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc 0 sdx3'
            ],
            [
                'sx4',
                '+- hc sdx3 0'
            ],
            [
                'sx5',
                '+- hc sdx2 0'
            ],
            [
                'sx6',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc 0 sdy3'
            ],
            [
                'sy4',
                '+- vc sdy3 0'
            ],
            [
                'sy5',
                '+- vc sdy2 0'
            ],
            [
                'sy6',
                '+- vc sdy1 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'hd4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'hd4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd4',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star16': {
        'family': 'stars',
        'defaults': {
            'adj': 37500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'dx1',
                '*/ wd2 92388 100000'
            ],
            [
                'dx2',
                '*/ wd2 70711 100000'
            ],
            [
                'dx3',
                '*/ wd2 38268 100000'
            ],
            [
                'dy1',
                '*/ hd2 92388 100000'
            ],
            [
                'dy2',
                '*/ hd2 70711 100000'
            ],
            [
                'dy3',
                '*/ hd2 38268 100000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc dx3 0'
            ],
            [
                'x5',
                '+- hc dx2 0'
            ],
            [
                'x6',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc 0 dy3'
            ],
            [
                'y4',
                '+- vc dy3 0'
            ],
            [
                'y5',
                '+- vc dy2 0'
            ],
            [
                'y6',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 98079 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 83147 100000'
            ],
            [
                'sdx3',
                '*/ iwd2 55557 100000'
            ],
            [
                'sdx4',
                '*/ iwd2 19509 100000'
            ],
            [
                'sdy1',
                '*/ ihd2 98079 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 83147 100000'
            ],
            [
                'sdy3',
                '*/ ihd2 55557 100000'
            ],
            [
                'sdy4',
                '*/ ihd2 19509 100000'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc 0 sdx3'
            ],
            [
                'sx4',
                '+- hc 0 sdx4'
            ],
            [
                'sx5',
                '+- hc sdx4 0'
            ],
            [
                'sx6',
                '+- hc sdx3 0'
            ],
            [
                'sx7',
                '+- hc sdx2 0'
            ],
            [
                'sx8',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc 0 sdy3'
            ],
            [
                'sy4',
                '+- vc 0 sdy4'
            ],
            [
                'sy5',
                '+- vc sdy4 0'
            ],
            [
                'sy6',
                '+- vc sdy3 0'
            ],
            [
                'sy7',
                '+- vc sdy2 0'
            ],
            [
                'sy8',
                '+- vc sdy1 0'
            ],
            [
                'idx',
                'cos iwd2 45'
            ],
            [
                'idy',
                'sin ihd2 45'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'ib',
                '+- vc idy 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star24': {
        'family': 'stars',
        'defaults': {
            'adj': 37500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'dx1',
                'cos wd2 15'
            ],
            [
                'dx2',
                'cos wd2 30'
            ],
            [
                'dx3',
                'cos wd2 45'
            ],
            [
                'dx4',
                'val wd4'
            ],
            [
                'dx5',
                'cos wd2 75'
            ],
            [
                'dy1',
                'sin hd2 75'
            ],
            [
                'dy2',
                'sin hd2 60'
            ],
            [
                'dy3',
                'sin hd2 45'
            ],
            [
                'dy4',
                'val hd4'
            ],
            [
                'dy5',
                'sin hd2 15'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc 0 dx4'
            ],
            [
                'x5',
                '+- hc 0 dx5'
            ],
            [
                'x6',
                '+- hc dx5 0'
            ],
            [
                'x7',
                '+- hc dx4 0'
            ],
            [
                'x8',
                '+- hc dx3 0'
            ],
            [
                'x9',
                '+- hc dx2 0'
            ],
            [
                'x10',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc 0 dy3'
            ],
            [
                'y4',
                '+- vc 0 dy4'
            ],
            [
                'y5',
                '+- vc 0 dy5'
            ],
            [
                'y6',
                '+- vc dy5 0'
            ],
            [
                'y7',
                '+- vc dy4 0'
            ],
            [
                'y8',
                '+- vc dy3 0'
            ],
            [
                'y9',
                '+- vc dy2 0'
            ],
            [
                'y10',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 99144 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 92388 100000'
            ],
            [
                'sdx3',
                '*/ iwd2 79335 100000'
            ],
            [
                'sdx4',
                '*/ iwd2 60876 100000'
            ],
            [
                'sdx5',
                '*/ iwd2 38268 100000'
            ],
            [
                'sdx6',
                '*/ iwd2 13053 100000'
            ],
            [
                'sdy1',
                '*/ ihd2 99144 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 92388 100000'
            ],
            [
                'sdy3',
                '*/ ihd2 79335 100000'
            ],
            [
                'sdy4',
                '*/ ihd2 60876 100000'
            ],
            [
                'sdy5',
                '*/ ihd2 38268 100000'
            ],
            [
                'sdy6',
                '*/ ihd2 13053 100000'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc 0 sdx3'
            ],
            [
                'sx4',
                '+- hc 0 sdx4'
            ],
            [
                'sx5',
                '+- hc 0 sdx5'
            ],
            [
                'sx6',
                '+- hc 0 sdx6'
            ],
            [
                'sx7',
                '+- hc sdx6 0'
            ],
            [
                'sx8',
                '+- hc sdx5 0'
            ],
            [
                'sx9',
                '+- hc sdx4 0'
            ],
            [
                'sx10',
                '+- hc sdx3 0'
            ],
            [
                'sx11',
                '+- hc sdx2 0'
            ],
            [
                'sx12',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc 0 sdy3'
            ],
            [
                'sy4',
                '+- vc 0 sdy4'
            ],
            [
                'sy5',
                '+- vc 0 sdy5'
            ],
            [
                'sy6',
                '+- vc 0 sdy6'
            ],
            [
                'sy7',
                '+- vc sdy6 0'
            ],
            [
                'sy8',
                '+- vc sdy5 0'
            ],
            [
                'sy9',
                '+- vc sdy4 0'
            ],
            [
                'sy10',
                '+- vc sdy3 0'
            ],
            [
                'sy11',
                '+- vc sdy2 0'
            ],
            [
                'sy12',
                '+- vc sdy1 0'
            ],
            [
                'idx',
                'cos iwd2 45'
            ],
            [
                'idy',
                'sin ihd2 45'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'ib',
                '+- vc idy 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx9',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx10',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx11',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx12',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx12',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx11',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx10',
                                'y': 'sy9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx9',
                                'y': 'sy10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'star32': {
        'family': 'stars',
        'defaults': {
            'adj': 37500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 50000'
            ],
            [
                'dx1',
                '*/ wd2 98079 100000'
            ],
            [
                'dx2',
                '*/ wd2 92388 100000'
            ],
            [
                'dx3',
                '*/ wd2 83147 100000'
            ],
            [
                'dx4',
                'cos wd2 45'
            ],
            [
                'dx5',
                '*/ wd2 55557 100000'
            ],
            [
                'dx6',
                '*/ wd2 38268 100000'
            ],
            [
                'dx7',
                '*/ wd2 19509 100000'
            ],
            [
                'dy1',
                '*/ hd2 98079 100000'
            ],
            [
                'dy2',
                '*/ hd2 92388 100000'
            ],
            [
                'dy3',
                '*/ hd2 83147 100000'
            ],
            [
                'dy4',
                'sin hd2 45'
            ],
            [
                'dy5',
                '*/ hd2 55557 100000'
            ],
            [
                'dy6',
                '*/ hd2 38268 100000'
            ],
            [
                'dy7',
                '*/ hd2 19509 100000'
            ],
            [
                'x1',
                '+- hc 0 dx1'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- hc 0 dx3'
            ],
            [
                'x4',
                '+- hc 0 dx4'
            ],
            [
                'x5',
                '+- hc 0 dx5'
            ],
            [
                'x6',
                '+- hc 0 dx6'
            ],
            [
                'x7',
                '+- hc 0 dx7'
            ],
            [
                'x8',
                '+- hc dx7 0'
            ],
            [
                'x9',
                '+- hc dx6 0'
            ],
            [
                'x10',
                '+- hc dx5 0'
            ],
            [
                'x11',
                '+- hc dx4 0'
            ],
            [
                'x12',
                '+- hc dx3 0'
            ],
            [
                'x13',
                '+- hc dx2 0'
            ],
            [
                'x14',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- vc 0 dy1'
            ],
            [
                'y2',
                '+- vc 0 dy2'
            ],
            [
                'y3',
                '+- vc 0 dy3'
            ],
            [
                'y4',
                '+- vc 0 dy4'
            ],
            [
                'y5',
                '+- vc 0 dy5'
            ],
            [
                'y6',
                '+- vc 0 dy6'
            ],
            [
                'y7',
                '+- vc 0 dy7'
            ],
            [
                'y8',
                '+- vc dy7 0'
            ],
            [
                'y9',
                '+- vc dy6 0'
            ],
            [
                'y10',
                '+- vc dy5 0'
            ],
            [
                'y11',
                '+- vc dy4 0'
            ],
            [
                'y12',
                '+- vc dy3 0'
            ],
            [
                'y13',
                '+- vc dy2 0'
            ],
            [
                'y14',
                '+- vc dy1 0'
            ],
            [
                'iwd2',
                '*/ wd2 a 50000'
            ],
            [
                'ihd2',
                '*/ hd2 a 50000'
            ],
            [
                'sdx1',
                '*/ iwd2 99518 100000'
            ],
            [
                'sdx2',
                '*/ iwd2 95694 100000'
            ],
            [
                'sdx3',
                '*/ iwd2 88192 100000'
            ],
            [
                'sdx4',
                '*/ iwd2 77301 100000'
            ],
            [
                'sdx5',
                '*/ iwd2 63439 100000'
            ],
            [
                'sdx6',
                '*/ iwd2 47140 100000'
            ],
            [
                'sdx7',
                '*/ iwd2 29028 100000'
            ],
            [
                'sdx8',
                '*/ iwd2 9802 100000'
            ],
            [
                'sdy1',
                '*/ ihd2 99518 100000'
            ],
            [
                'sdy2',
                '*/ ihd2 95694 100000'
            ],
            [
                'sdy3',
                '*/ ihd2 88192 100000'
            ],
            [
                'sdy4',
                '*/ ihd2 77301 100000'
            ],
            [
                'sdy5',
                '*/ ihd2 63439 100000'
            ],
            [
                'sdy6',
                '*/ ihd2 47140 100000'
            ],
            [
                'sdy7',
                '*/ ihd2 29028 100000'
            ],
            [
                'sdy8',
                '*/ ihd2 9802 100000'
            ],
            [
                'sx1',
                '+- hc 0 sdx1'
            ],
            [
                'sx2',
                '+- hc 0 sdx2'
            ],
            [
                'sx3',
                '+- hc 0 sdx3'
            ],
            [
                'sx4',
                '+- hc 0 sdx4'
            ],
            [
                'sx5',
                '+- hc 0 sdx5'
            ],
            [
                'sx6',
                '+- hc 0 sdx6'
            ],
            [
                'sx7',
                '+- hc 0 sdx7'
            ],
            [
                'sx8',
                '+- hc 0 sdx8'
            ],
            [
                'sx9',
                '+- hc sdx8 0'
            ],
            [
                'sx10',
                '+- hc sdx7 0'
            ],
            [
                'sx11',
                '+- hc sdx6 0'
            ],
            [
                'sx12',
                '+- hc sdx5 0'
            ],
            [
                'sx13',
                '+- hc sdx4 0'
            ],
            [
                'sx14',
                '+- hc sdx3 0'
            ],
            [
                'sx15',
                '+- hc sdx2 0'
            ],
            [
                'sx16',
                '+- hc sdx1 0'
            ],
            [
                'sy1',
                '+- vc 0 sdy1'
            ],
            [
                'sy2',
                '+- vc 0 sdy2'
            ],
            [
                'sy3',
                '+- vc 0 sdy3'
            ],
            [
                'sy4',
                '+- vc 0 sdy4'
            ],
            [
                'sy5',
                '+- vc 0 sdy5'
            ],
            [
                'sy6',
                '+- vc 0 sdy6'
            ],
            [
                'sy7',
                '+- vc 0 sdy7'
            ],
            [
                'sy8',
                '+- vc 0 sdy8'
            ],
            [
                'sy9',
                '+- vc sdy8 0'
            ],
            [
                'sy10',
                '+- vc sdy7 0'
            ],
            [
                'sy11',
                '+- vc sdy6 0'
            ],
            [
                'sy12',
                '+- vc sdy5 0'
            ],
            [
                'sy13',
                '+- vc sdy4 0'
            ],
            [
                'sy14',
                '+- vc sdy3 0'
            ],
            [
                'sy15',
                '+- vc sdy2 0'
            ],
            [
                'sy16',
                '+- vc sdy1 0'
            ],
            [
                'idx',
                'cos iwd2 45'
            ],
            [
                'idy',
                'sin ihd2 45'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'ib',
                '+- vc idy 0'
            ],
            [
                'yAdj',
                '+- vc 0 ihd2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx9',
                                'y': 'sy1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx10',
                                'y': 'sy2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx11',
                                'y': 'sy3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx12',
                                'y': 'sy4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x11',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx13',
                                'y': 'sy5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x12',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx14',
                                'y': 'sy6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x13',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx15',
                                'y': 'sy7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x14',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx16',
                                'y': 'sy8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'vc'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx16',
                                'y': 'sy9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x14',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx15',
                                'y': 'sy10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x13',
                                'y': 'y9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx14',
                                'y': 'sy11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x12',
                                'y': 'y10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx13',
                                'y': 'sy12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x11',
                                'y': 'y11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx12',
                                'y': 'sy13'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx11',
                                'y': 'sy14'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y13'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx10',
                                'y': 'sy15'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y14'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx9',
                                'y': 'sy16'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx8',
                                'y': 'sy16'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y14'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx7',
                                'y': 'sy15'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y13'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx6',
                                'y': 'sy14'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx5',
                                'y': 'sy13'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx4',
                                'y': 'sy12'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx3',
                                'y': 'sy11'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y9'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx2',
                                'y': 'sy10'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y8'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'sx1',
                                'y': 'sy9'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'ribbon': {
        'family': 'banners',
        'defaults': {
            'adj1': 16667,
            'adj2': 50000
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 33333'
            ],
            [
                'a2',
                'pin 25000 adj2 75000'
            ],
            [
                'x10',
                '+- r 0 wd8'
            ],
            [
                'dx2',
                '*/ w a2 200000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x9',
                '+- hc dx2 0'
            ],
            [
                'x3',
                '+- x2 wd32 0'
            ],
            [
                'x8',
                '+- x9 0 wd32'
            ],
            [
                'x5',
                '+- x2 wd8 0'
            ],
            [
                'x6',
                '+- x9 0 wd8'
            ],
            [
                'x4',
                '+- x5 0 wd32'
            ],
            [
                'x7',
                '+- x6 wd32 0'
            ],
            [
                'y1',
                '*/ h a1 200000'
            ],
            [
                'y2',
                '*/ h a1 100000'
            ],
            [
                'y4',
                '+- b 0 y2'
            ],
            [
                'y3',
                '*/ y4 1 2'
            ],
            [
                'hR',
                '*/ h a1 400000'
            ],
            [
                'y5',
                '+- b 0 hR'
            ],
            [
                'y6',
                '+- y2 0 hR'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'ribbon2': {
        'family': 'banners',
        'defaults': {
            'adj1': 16667,
            'adj2': 50000
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 33333'
            ],
            [
                'a2',
                'pin 25000 adj2 75000'
            ],
            [
                'x10',
                '+- r 0 wd8'
            ],
            [
                'dx2',
                '*/ w a2 200000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x9',
                '+- hc dx2 0'
            ],
            [
                'x3',
                '+- x2 wd32 0'
            ],
            [
                'x8',
                '+- x9 0 wd32'
            ],
            [
                'x5',
                '+- x2 wd8 0'
            ],
            [
                'x6',
                '+- x9 0 wd8'
            ],
            [
                'x4',
                '+- x5 0 wd32'
            ],
            [
                'x7',
                '+- x6 wd32 0'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'y1',
                '+- b 0 dy1'
            ],
            [
                'dy2',
                '*/ h a1 100000'
            ],
            [
                'y2',
                '+- b 0 dy2'
            ],
            [
                'y4',
                '+- t dy2 0'
            ],
            [
                'y3',
                '+/ y4 b 2'
            ],
            [
                'hR',
                '*/ h a1 400000'
            ],
            [
                'y6',
                '+- b 0 hR'
            ],
            [
                'y7',
                '+- y1 0 hR'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'hR'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x9',
                                'y': 'y7'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'ellipseRibbon': {
        'family': 'banners',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 12500
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 25000 adj2 75000'
            ],
            [
                'q10',
                '+- 100000 0 a1'
            ],
            [
                'q11',
                '*/ q10 1 2'
            ],
            [
                'q12',
                '+- a1 0 q11'
            ],
            [
                'minAdj3',
                'max 0 q12'
            ],
            [
                'a3',
                'pin minAdj3 adj3 a1'
            ],
            [
                'dx2',
                '*/ w a2 200000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- x2 wd8 0'
            ],
            [
                'x4',
                '+- r 0 x3'
            ],
            [
                'x5',
                '+- r 0 x2'
            ],
            [
                'x6',
                '+- r 0 wd8'
            ],
            [
                'dy1',
                '*/ h a3 100000'
            ],
            [
                'f1',
                '*/ 4 dy1 w'
            ],
            [
                'q1',
                '*/ x3 x3 w'
            ],
            [
                'q2',
                '+- x3 0 q1'
            ],
            [
                'y1',
                '*/ f1 q2 1'
            ],
            [
                'cx1',
                '*/ x3 1 2'
            ],
            [
                'cy1',
                '*/ f1 cx1 1'
            ],
            [
                'cx2',
                '+- r 0 cx1'
            ],
            [
                'q1',
                '*/ h a1 100000'
            ],
            [
                'dy3',
                '+- q1 0 dy1'
            ],
            [
                'q3',
                '*/ x2 x2 w'
            ],
            [
                'q4',
                '+- x2 0 q3'
            ],
            [
                'q5',
                '*/ f1 q4 1'
            ],
            [
                'y3',
                '+- q5 dy3 0'
            ],
            [
                'q6',
                '+- dy1 dy3 y3'
            ],
            [
                'q7',
                '+- q6 dy1 0'
            ],
            [
                'cy3',
                '+- q7 dy3 0'
            ],
            [
                'rh',
                '+- b 0 q1'
            ],
            [
                'q8',
                '*/ dy1 14 16'
            ],
            [
                'y2',
                '+/ q8 rh 2'
            ],
            [
                'y5',
                '+- q5 rh 0'
            ],
            [
                'y6',
                '+- y3 rh 0'
            ],
            [
                'cx4',
                '*/ x2 1 2'
            ],
            [
                'q9',
                '*/ f1 cx4 1'
            ],
            [
                'cy4',
                '+- q9 rh 0'
            ],
            [
                'cx5',
                '+- r 0 cx4'
            ],
            [
                'cy6',
                '+- cy3 rh 0'
            ],
            [
                'y7',
                '+- y1 dy3 0'
            ],
            [
                'cy7',
                '+- q1 q1 y7'
            ],
            [
                'y8',
                '+- b 0 dy1'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx1',
                                'y': 'cy1'
                            },
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx2',
                                'y': 'cy1'
                            },
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'rh'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx5',
                                'y': 'cy4'
                            },
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy6'
                            },
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx4',
                                'y': 'cy4'
                            },
                            {
                                'x': 'l',
                                'y': 'rh'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy7'
                            },
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx1',
                                'y': 'cy1'
                            },
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx2',
                                'y': 'cy1'
                            },
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'rh'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx5',
                                'y': 'cy4'
                            },
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy6'
                            },
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx4',
                                'y': 'cy4'
                            },
                            {
                                'x': 'l',
                                'y': 'rh'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'ellipseRibbon2': {
        'family': 'banners',
        'defaults': {
            'adj1': 25000,
            'adj2': 50000,
            'adj3': 12500
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 100000'
            ],
            [
                'a2',
                'pin 25000 adj2 75000'
            ],
            [
                'q10',
                '+- 100000 0 a1'
            ],
            [
                'q11',
                '*/ q10 1 2'
            ],
            [
                'q12',
                '+- a1 0 q11'
            ],
            [
                'minAdj3',
                'max 0 q12'
            ],
            [
                'a3',
                'pin minAdj3 adj3 a1'
            ],
            [
                'dx2',
                '*/ w a2 200000'
            ],
            [
                'x2',
                '+- hc 0 dx2'
            ],
            [
                'x3',
                '+- x2 wd8 0'
            ],
            [
                'x4',
                '+- r 0 x3'
            ],
            [
                'x5',
                '+- r 0 x2'
            ],
            [
                'x6',
                '+- r 0 wd8'
            ],
            [
                'dy1',
                '*/ h a3 100000'
            ],
            [
                'f1',
                '*/ 4 dy1 w'
            ],
            [
                'q1',
                '*/ x3 x3 w'
            ],
            [
                'q2',
                '+- x3 0 q1'
            ],
            [
                'u1',
                '*/ f1 q2 1'
            ],
            [
                'y1',
                '+- b 0 u1'
            ],
            [
                'cx1',
                '*/ x3 1 2'
            ],
            [
                'cu1',
                '*/ f1 cx1 1'
            ],
            [
                'cy1',
                '+- b 0 cu1'
            ],
            [
                'cx2',
                '+- r 0 cx1'
            ],
            [
                'q1',
                '*/ h a1 100000'
            ],
            [
                'dy3',
                '+- q1 0 dy1'
            ],
            [
                'q3',
                '*/ x2 x2 w'
            ],
            [
                'q4',
                '+- x2 0 q3'
            ],
            [
                'q5',
                '*/ f1 q4 1'
            ],
            [
                'u3',
                '+- q5 dy3 0'
            ],
            [
                'y3',
                '+- b 0 u3'
            ],
            [
                'q6',
                '+- dy1 dy3 u3'
            ],
            [
                'q7',
                '+- q6 dy1 0'
            ],
            [
                'cu3',
                '+- q7 dy3 0'
            ],
            [
                'cy3',
                '+- b 0 cu3'
            ],
            [
                'rh',
                '+- b 0 q1'
            ],
            [
                'q8',
                '*/ dy1 14 16'
            ],
            [
                'u2',
                '+/ q8 rh 2'
            ],
            [
                'y2',
                '+- b 0 u2'
            ],
            [
                'u5',
                '+- q5 rh 0'
            ],
            [
                'y5',
                '+- b 0 u5'
            ],
            [
                'u6',
                '+- u3 rh 0'
            ],
            [
                'y6',
                '+- b 0 u6'
            ],
            [
                'cx4',
                '*/ x2 1 2'
            ],
            [
                'q9',
                '*/ f1 cx4 1'
            ],
            [
                'cu4',
                '+- q9 rh 0'
            ],
            [
                'cy4',
                '+- b 0 cu4'
            ],
            [
                'cx5',
                '+- r 0 cx4'
            ],
            [
                'cu6',
                '+- cu3 rh 0'
            ],
            [
                'cy6',
                '+- b 0 cu6'
            ],
            [
                'u7',
                '+- u1 dy3 0'
            ],
            [
                'y7',
                '+- b 0 u7'
            ],
            [
                'cu7',
                '+- q1 q1 u7'
            ],
            [
                'cy7',
                '+- b 0 cu7'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx1',
                                'y': 'cy1'
                            },
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx2',
                                'y': 'cy1'
                            },
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'q1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx5',
                                'y': 'cy4'
                            },
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy6'
                            },
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx4',
                                'y': 'cy4'
                            },
                            {
                                'x': 'l',
                                'y': 'q1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy7'
                            },
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'wd8',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'q1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx4',
                                'y': 'cy4'
                            },
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy6'
                            },
                            {
                                'x': 'x5',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx5',
                                'y': 'cy4'
                            },
                            {
                                'x': 'r',
                                'y': 'q1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx2',
                                'y': 'cy1'
                            },
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'cy3'
                            },
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'quad',
                        'points': [
                            {
                                'x': 'cx1',
                                'y': 'cy1'
                            },
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x5',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y7'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'verticalScroll': {
        'family': 'banners',
        'defaults': {
            'adj': 12500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 25000'
            ],
            [
                'ch',
                '*/ ss a 100000'
            ],
            [
                'ch2',
                '*/ ch 1 2'
            ],
            [
                'ch4',
                '*/ ch 1 4'
            ],
            [
                'x3',
                '+- ch ch2 0'
            ],
            [
                'x4',
                '+- ch ch 0'
            ],
            [
                'x6',
                '+- r 0 ch'
            ],
            [
                'x7',
                '+- r 0 ch2'
            ],
            [
                'x5',
                '+- x6 0 ch2'
            ],
            [
                'y3',
                '+- b 0 ch'
            ],
            [
                'y4',
                '+- b 0 ch2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': '3cd4'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x7',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'horizontalScroll': {
        'family': 'banners',
        'defaults': {
            'adj': 12500
        },
        'guides': [
            [
                'a',
                'pin 0 adj 25000'
            ],
            [
                'ch',
                '*/ ss a 100000'
            ],
            [
                'ch2',
                '*/ ch 1 2'
            ],
            [
                'ch4',
                '*/ ch 1 4'
            ],
            [
                'y3',
                '+- ch ch2 0'
            ],
            [
                'y4',
                '+- ch ch 0'
            ],
            [
                'y6',
                '+- b 0 ch'
            ],
            [
                'y7',
                '+- b 0 ch2'
            ],
            [
                'y5',
                '+- y6 0 ch2'
            ],
            [
                'x3',
                '+- r 0 ch'
            ],
            [
                'x4',
                '+- r 0 ch2'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '0',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '3cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd2',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '0',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '0',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-16200000'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd2',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y5'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y6'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y7'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': 'cd4',
                        'sweepAngle': '-5400000'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ch2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': '0',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch2',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch4',
                        'heightRadius': 'ch4',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'ch2',
                        'heightRadius': 'ch2',
                        'startAngle': '0',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'ch',
                                'y': 'y6'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'wave': {
        'family': 'banners',
        'defaults': {
            'adj1': 12500,
            'adj2': 0
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 20000'
            ],
            [
                'a2',
                'pin -10000 adj2 10000'
            ],
            [
                'y1',
                '*/ h a1 100000'
            ],
            [
                'dy2',
                '*/ y1 10 3'
            ],
            [
                'y2',
                '+- y1 0 dy2'
            ],
            [
                'y3',
                '+- y1 dy2 0'
            ],
            [
                'y4',
                '+- b 0 y1'
            ],
            [
                'y5',
                '+- y4 0 dy2'
            ],
            [
                'y6',
                '+- y4 dy2 0'
            ],
            [
                'dx1',
                '*/ w a2 100000'
            ],
            [
                'of2',
                '*/ w a2 50000'
            ],
            [
                'x1',
                'abs dx1'
            ],
            [
                'dx2',
                '?: of2 0 of2'
            ],
            [
                'x2',
                '+- l 0 dx2'
            ],
            [
                'dx5',
                '?: of2 of2 0'
            ],
            [
                'x5',
                '+- r 0 dx5'
            ],
            [
                'dx3',
                '+/ dx2 x5 3'
            ],
            [
                'x3',
                '+- x2 dx3 0'
            ],
            [
                'x4',
                '+/ x3 x5 2'
            ],
            [
                'x6',
                '+- l dx5 0'
            ],
            [
                'x10',
                '+- r dx2 0'
            ],
            [
                'x7',
                '+- x6 dx3 0'
            ],
            [
                'x8',
                '+/ x7 x10 2'
            ],
            [
                'x9',
                '+- r 0 x1'
            ],
            [
                'xAdj',
                '+- hc dx1 0'
            ],
            [
                'xAdj2',
                '+- hc 0 dx1'
            ],
            [
                'il',
                'max x2 x6'
            ],
            [
                'ir',
                'min x5 x10'
            ],
            [
                'it',
                '*/ h a1 50000'
            ],
            [
                'ib',
                '+- b 0 it'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            },
                            {
                                'x': 'x4',
                                'y': 'y3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x10',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x8',
                                'y': 'y6'
                            },
                            {
                                'x': 'x7',
                                'y': 'y5'
                            },
                            {
                                'x': 'x6',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'doubleWave': {
        'family': 'banners',
        'defaults': {
            'adj1': 6250,
            'adj2': 0
        },
        'guides': [
            [
                'a1',
                'pin 0 adj1 12500'
            ],
            [
                'a2',
                'pin -10000 adj2 10000'
            ],
            [
                'y1',
                '*/ h a1 100000'
            ],
            [
                'dy2',
                '*/ y1 10 3'
            ],
            [
                'y2',
                '+- y1 0 dy2'
            ],
            [
                'y3',
                '+- y1 dy2 0'
            ],
            [
                'y4',
                '+- b 0 y1'
            ],
            [
                'y5',
                '+- y4 0 dy2'
            ],
            [
                'y6',
                '+- y4 dy2 0'
            ],
            [
                'dx1',
                '*/ w a2 100000'
            ],
            [
                'of2',
                '*/ w a2 50000'
            ],
            [
                'x1',
                'abs dx1'
            ],
            [
                'dx2',
                '?: of2 0 of2'
            ],
            [
                'x2',
                '+- l 0 dx2'
            ],
            [
                'dx8',
                '?: of2 of2 0'
            ],
            [
                'x8',
                '+- r 0 dx8'
            ],
            [
                'dx3',
                '+/ dx2 x8 6'
            ],
            [
                'x3',
                '+- x2 dx3 0'
            ],
            [
                'dx4',
                '+/ dx2 x8 3'
            ],
            [
                'x4',
                '+- x2 dx4 0'
            ],
            [
                'x5',
                '+/ x2 x8 2'
            ],
            [
                'x6',
                '+- x5 dx3 0'
            ],
            [
                'x7',
                '+/ x6 x8 2'
            ],
            [
                'x9',
                '+- l dx8 0'
            ],
            [
                'x15',
                '+- r dx2 0'
            ],
            [
                'x10',
                '+- x9 dx3 0'
            ],
            [
                'x11',
                '+- x9 dx4 0'
            ],
            [
                'x12',
                '+/ x9 x15 2'
            ],
            [
                'x13',
                '+- x12 dx3 0'
            ],
            [
                'x14',
                '+/ x13 x15 2'
            ],
            [
                'x16',
                '+- r 0 x1'
            ],
            [
                'xAdj',
                '+- hc dx1 0'
            ],
            [
                'il',
                'max x2 x9'
            ],
            [
                'ir',
                'min x8 x15'
            ],
            [
                'it',
                '*/ h a1 50000'
            ],
            [
                'ib',
                '+- b 0 it'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y2'
                            },
                            {
                                'x': 'x4',
                                'y': 'y3'
                            },
                            {
                                'x': 'x5',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x6',
                                'y': 'y2'
                            },
                            {
                                'x': 'x7',
                                'y': 'y3'
                            },
                            {
                                'x': 'x8',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x15',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x14',
                                'y': 'y6'
                            },
                            {
                                'x': 'x13',
                                'y': 'y5'
                            },
                            {
                                'x': 'x12',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'cubic',
                        'points': [
                            {
                                'x': 'x11',
                                'y': 'y6'
                            },
                            {
                                'x': 'x10',
                                'y': 'y5'
                            },
                            {
                                'x': 'x9',
                                'y': 'y4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'leftRightRibbon': {
        'family': 'banners',
        'defaults': {
            'adj1': 50000,
            'adj2': 50000,
            'adj3': 16667
        },
        'guides': [
            [
                'a3',
                'pin 0 adj3 33333'
            ],
            [
                'maxAdj1',
                '+- 100000 0 a3'
            ],
            [
                'a1',
                'pin 0 adj1 maxAdj1'
            ],
            [
                'w1',
                '+- wd2 0 wd32'
            ],
            [
                'maxAdj2',
                '*/ 100000 w1 ss'
            ],
            [
                'a2',
                'pin 0 adj2 maxAdj2'
            ],
            [
                'x1',
                '*/ ss a2 100000'
            ],
            [
                'x4',
                '+- r 0 x1'
            ],
            [
                'dy1',
                '*/ h a1 200000'
            ],
            [
                'dy2',
                '*/ h a3 -200000'
            ],
            [
                'ly1',
                '+- vc dy2 dy1'
            ],
            [
                'ry4',
                '+- vc dy1 dy2'
            ],
            [
                'ly2',
                '+- ly1 dy1 0'
            ],
            [
                'ry3',
                '+- b 0 ly2'
            ],
            [
                'ly4',
                '*/ ly2 2 1'
            ],
            [
                'ry1',
                '+- b 0 ly4'
            ],
            [
                'ly3',
                '+- ly4 0 ly1'
            ],
            [
                'ry2',
                '+- b 0 ly3'
            ],
            [
                'hR',
                '*/ a3 ss 400000'
            ],
            [
                'x2',
                '+- hc 0 wd32'
            ],
            [
                'x3',
                '+- hc wd32 0'
            ],
            [
                'y1',
                '+- ly1 hR 0'
            ],
            [
                'y2',
                '+- ry2 0 hR'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'ly2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'ly1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'ry3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'ry4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'ly3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'darkenLess',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ry2'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'ly2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'ly1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd2'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': '3cd4',
                        'sweepAngle': '-10800000'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'ry3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'ry4'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'hc',
                                'y': 'ry4'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd32',
                        'heightRadius': 'hR',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'ly3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'ly4'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'ry2'
                            }
                        ]
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'ly3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'wedgeRectCallout': {
        'family': 'callouts',
        'defaults': {
            'adj1': -20833,
            'adj2': 62500
        },
        'guides': [
            [
                'dxPos',
                '*/ w adj1 100000'
            ],
            [
                'dyPos',
                '*/ h adj2 100000'
            ],
            [
                'xPos',
                '+- hc dxPos 0'
            ],
            [
                'yPos',
                '+- vc dyPos 0'
            ],
            [
                'dx',
                '+- xPos 0 hc'
            ],
            [
                'dy',
                '+- yPos 0 vc'
            ],
            [
                'dq',
                '*/ dxPos h w'
            ],
            [
                'ady',
                'abs dyPos'
            ],
            [
                'adq',
                'abs dq'
            ],
            [
                'dz',
                '+- ady 0 adq'
            ],
            [
                'xg1',
                '?: dxPos 7 2'
            ],
            [
                'xg2',
                '?: dxPos 10 5'
            ],
            [
                'x1',
                '*/ w xg1 12'
            ],
            [
                'x2',
                '*/ w xg2 12'
            ],
            [
                'yg1',
                '?: dyPos 7 2'
            ],
            [
                'yg2',
                '?: dyPos 10 5'
            ],
            [
                'y1',
                '*/ h yg1 12'
            ],
            [
                'y2',
                '*/ h yg2 12'
            ],
            [
                't1',
                '?: dxPos l xPos'
            ],
            [
                'xl',
                '?: dz l t1'
            ],
            [
                't2',
                '?: dyPos x1 xPos'
            ],
            [
                'xt',
                '?: dz t2 x1'
            ],
            [
                't3',
                '?: dxPos xPos r'
            ],
            [
                'xr',
                '?: dz r t3'
            ],
            [
                't4',
                '?: dyPos xPos x1'
            ],
            [
                'xb',
                '?: dz t4 x1'
            ],
            [
                't5',
                '?: dxPos y1 yPos'
            ],
            [
                'yl',
                '?: dz y1 t5'
            ],
            [
                't6',
                '?: dyPos t yPos'
            ],
            [
                'yt',
                '?: dz t6 t'
            ],
            [
                't7',
                '?: dxPos yPos y1'
            ],
            [
                'yr',
                '?: dz y1 t7'
            ],
            [
                't8',
                '?: dyPos yPos b'
            ],
            [
                'yb',
                '?: dz t8 b'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xt',
                                'y': 'yt'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xr',
                                'y': 'yr'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xb',
                                'y': 'yb'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xl',
                                'y': 'yl'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'wedgeRoundRectCallout': {
        'family': 'callouts',
        'defaults': {
            'adj1': -20833,
            'adj2': 62500,
            'adj3': 16667
        },
        'guides': [
            [
                'dxPos',
                '*/ w adj1 100000'
            ],
            [
                'dyPos',
                '*/ h adj2 100000'
            ],
            [
                'xPos',
                '+- hc dxPos 0'
            ],
            [
                'yPos',
                '+- vc dyPos 0'
            ],
            [
                'dq',
                '*/ dxPos h w'
            ],
            [
                'ady',
                'abs dyPos'
            ],
            [
                'adq',
                'abs dq'
            ],
            [
                'dz',
                '+- ady 0 adq'
            ],
            [
                'xg1',
                '?: dxPos 7 2'
            ],
            [
                'xg2',
                '?: dxPos 10 5'
            ],
            [
                'x1',
                '*/ w xg1 12'
            ],
            [
                'x2',
                '*/ w xg2 12'
            ],
            [
                'yg1',
                '?: dyPos 7 2'
            ],
            [
                'yg2',
                '?: dyPos 10 5'
            ],
            [
                'y1',
                '*/ h yg1 12'
            ],
            [
                'y2',
                '*/ h yg2 12'
            ],
            [
                't1',
                '?: dxPos l xPos'
            ],
            [
                'xl',
                '?: dz l t1'
            ],
            [
                't2',
                '?: dyPos x1 xPos'
            ],
            [
                'xt',
                '?: dz t2 x1'
            ],
            [
                't3',
                '?: dxPos xPos r'
            ],
            [
                'xr',
                '?: dz r t3'
            ],
            [
                't4',
                '?: dyPos xPos x1'
            ],
            [
                'xb',
                '?: dz t4 x1'
            ],
            [
                't5',
                '?: dxPos y1 yPos'
            ],
            [
                'yl',
                '?: dz y1 t5'
            ],
            [
                't6',
                '?: dyPos t yPos'
            ],
            [
                'yt',
                '?: dz t6 t'
            ],
            [
                't7',
                '?: dxPos yPos y1'
            ],
            [
                'yr',
                '?: dz y1 t7'
            ],
            [
                't8',
                '?: dyPos yPos b'
            ],
            [
                'yb',
                '?: dz t8 b'
            ],
            [
                'u1',
                '*/ ss adj3 100000'
            ],
            [
                'u2',
                '+- r 0 u1'
            ],
            [
                'v2',
                '+- b 0 u1'
            ],
            [
                'il',
                '*/ u1 29289 100000'
            ],
            [
                'ir',
                '+- r 0 il'
            ],
            [
                'ib',
                '+- b 0 il'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'u1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'u1',
                        'heightRadius': 'u1',
                        'startAngle': 'cd2',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xt',
                                'y': 'yt'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'u2',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'u1',
                        'heightRadius': 'u1',
                        'startAngle': '3cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xr',
                                'y': 'yr'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'v2'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'u1',
                        'heightRadius': 'u1',
                        'startAngle': '0',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xb',
                                'y': 'yb'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'u1',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'u1',
                        'heightRadius': 'u1',
                        'startAngle': 'cd4',
                        'sweepAngle': 'cd4'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'xl',
                                'y': 'yl'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'wedgeEllipseCallout': {
        'family': 'callouts',
        'defaults': {
            'adj1': -20833,
            'adj2': 62500
        },
        'guides': [
            [
                'dxPos',
                '*/ w adj1 100000'
            ],
            [
                'dyPos',
                '*/ h adj2 100000'
            ],
            [
                'xPos',
                '+- hc dxPos 0'
            ],
            [
                'yPos',
                '+- vc dyPos 0'
            ],
            [
                'sdx',
                '*/ dxPos h 1'
            ],
            [
                'sdy',
                '*/ dyPos w 1'
            ],
            [
                'pang',
                'at2 sdx sdy'
            ],
            [
                'stAng',
                '+- pang 660000 0'
            ],
            [
                'enAng',
                '+- pang 0 660000'
            ],
            [
                'dx1',
                'cos wd2 stAng'
            ],
            [
                'dy1',
                'sin hd2 stAng'
            ],
            [
                'x1',
                '+- hc dx1 0'
            ],
            [
                'y1',
                '+- vc dy1 0'
            ],
            [
                'dx2',
                'cos wd2 enAng'
            ],
            [
                'dy2',
                'sin hd2 enAng'
            ],
            [
                'x2',
                '+- hc dx2 0'
            ],
            [
                'y2',
                '+- vc dy2 0'
            ],
            [
                'stAng1',
                'at2 dx1 dy1'
            ],
            [
                'enAng1',
                'at2 dx2 dy2'
            ],
            [
                'swAng1',
                '+- enAng1 0 stAng1'
            ],
            [
                'swAng2',
                '+- swAng1 21600000 0'
            ],
            [
                'swAng',
                '?: swAng1 swAng1 swAng2'
            ],
            [
                'idx',
                'cos wd2 2700000'
            ],
            [
                'idy',
                'sin hd2 2700000'
            ],
            [
                'il',
                '+- hc 0 idx'
            ],
            [
                'ir',
                '+- hc idx 0'
            ],
            [
                'it',
                '+- vc 0 idy'
            ],
            [
                'ib',
                '+- vc idy 0'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'xPos',
                                'y': 'yPos'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'wd2',
                        'heightRadius': 'hd2',
                        'startAngle': 'stAng1',
                        'sweepAngle': 'swAng'
                    },
                    {
                        'type': 'close'
                    }
                ]
            }
        ]
    },
    'cloudCallout': {
        'family': 'callouts',
        'defaults': {
            'adj1': -20833,
            'adj2': 62500
        },
        'guides': [
            [
                'dxPos',
                '*/ w adj1 100000'
            ],
            [
                'dyPos',
                '*/ h adj2 100000'
            ],
            [
                'xPos',
                '+- hc dxPos 0'
            ],
            [
                'yPos',
                '+- vc dyPos 0'
            ],
            [
                'ht',
                'cat2 hd2 dxPos dyPos'
            ],
            [
                'wt',
                'sat2 wd2 dxPos dyPos'
            ],
            [
                'g2',
                'cat2 wd2 ht wt'
            ],
            [
                'g3',
                'sat2 hd2 ht wt'
            ],
            [
                'g4',
                '+- hc g2 0'
            ],
            [
                'g5',
                '+- vc g3 0'
            ],
            [
                'g6',
                '+- g4 0 xPos'
            ],
            [
                'g7',
                '+- g5 0 yPos'
            ],
            [
                'g8',
                'mod g6 g7 0'
            ],
            [
                'g9',
                '*/ ss 6600 21600'
            ],
            [
                'g10',
                '+- g8 0 g9'
            ],
            [
                'g11',
                '*/ g10 1 3'
            ],
            [
                'g12',
                '*/ ss 1800 21600'
            ],
            [
                'g13',
                '+- g11 g12 0'
            ],
            [
                'g14',
                '*/ g13 g6 g8'
            ],
            [
                'g15',
                '*/ g13 g7 g8'
            ],
            [
                'g16',
                '+- g14 xPos 0'
            ],
            [
                'g17',
                '+- g15 yPos 0'
            ],
            [
                'g18',
                '*/ ss 4800 21600'
            ],
            [
                'g19',
                '*/ g11 2 1'
            ],
            [
                'g20',
                '+- g18 g19 0'
            ],
            [
                'g21',
                '*/ g20 g6 g8'
            ],
            [
                'g22',
                '*/ g20 g7 g8'
            ],
            [
                'g23',
                '+- g21 xPos 0'
            ],
            [
                'g24',
                '+- g22 yPos 0'
            ],
            [
                'g25',
                '*/ ss 1200 21600'
            ],
            [
                'g26',
                '*/ ss 600 21600'
            ],
            [
                'x23',
                '+- xPos g26 0'
            ],
            [
                'x24',
                '+- g16 g25 0'
            ],
            [
                'x25',
                '+- g23 g12 0'
            ],
            [
                'il',
                '*/ w 2977 21600'
            ],
            [
                'it',
                '*/ h 3262 21600'
            ],
            [
                'ir',
                '*/ w 17087 21600'
            ],
            [
                'ib',
                '*/ h 17337 21600'
            ],
            [
                'g27',
                '*/ w 67 21600'
            ],
            [
                'g28',
                '*/ h 21577 21600'
            ],
            [
                'g29',
                '*/ w 21582 21600'
            ],
            [
                'g30',
                '*/ h 1235 21600'
            ],
            [
                'pang',
                'at2 dxPos dyPos'
            ]
        ],
        'paths': [
            {
                'width': '43200',
                'height': '43200',
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '3900',
                                'y': '14370'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6753',
                        'heightRadius': '9190',
                        'startAngle': '-11429249',
                        'sweepAngle': '7426832'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '5333',
                        'heightRadius': '7267',
                        'startAngle': '-8646143',
                        'sweepAngle': '5396714'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4365',
                        'heightRadius': '5945',
                        'startAngle': '-8748475',
                        'sweepAngle': '5983381'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4857',
                        'heightRadius': '6595',
                        'startAngle': '-7859164',
                        'sweepAngle': '7034504'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '5333',
                        'heightRadius': '7273',
                        'startAngle': '-4722533',
                        'sweepAngle': '6541615'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6775',
                        'heightRadius': '9220',
                        'startAngle': '-2776035',
                        'sweepAngle': '7816140'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '5785',
                        'heightRadius': '7867',
                        'startAngle': '37501',
                        'sweepAngle': '6842000'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6752',
                        'heightRadius': '9215',
                        'startAngle': '1347096',
                        'sweepAngle': '6910353'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '7720',
                        'heightRadius': '10543',
                        'startAngle': '3974558',
                        'sweepAngle': '4542661'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4360',
                        'heightRadius': '5918',
                        'startAngle': '-16496525',
                        'sweepAngle': '8804134'
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4345',
                        'heightRadius': '5945',
                        'startAngle': '-14809710',
                        'sweepAngle': '9151131'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x23',
                                'y': 'yPos'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'g26',
                        'heightRadius': 'g26',
                        'startAngle': '0',
                        'sweepAngle': '21600000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x24',
                                'y': 'g17'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'g25',
                        'heightRadius': 'g25',
                        'startAngle': '0',
                        'sweepAngle': '21600000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x25',
                                'y': 'g24'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': 'g12',
                        'heightRadius': 'g12',
                        'startAngle': '0',
                        'sweepAngle': '21600000'
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'width': '43200',
                'height': '43200',
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '4693',
                                'y': '26177'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4345',
                        'heightRadius': '5945',
                        'startAngle': '5204520',
                        'sweepAngle': '1585770'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '6928',
                                'y': '34899'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4360',
                        'heightRadius': '5918',
                        'startAngle': '4416628',
                        'sweepAngle': '686848'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '16478',
                                'y': '39090'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6752',
                        'heightRadius': '9215',
                        'startAngle': '8257449',
                        'sweepAngle': '844866'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '28827',
                                'y': '34751'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6752',
                        'heightRadius': '9215',
                        'startAngle': '387196',
                        'sweepAngle': '959901'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '34129',
                                'y': '22954'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '5785',
                        'heightRadius': '7867',
                        'startAngle': '-4217541',
                        'sweepAngle': '4255042'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '41798',
                                'y': '15354'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '5333',
                        'heightRadius': '7273',
                        'startAngle': '1819082',
                        'sweepAngle': '1665090'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '38324',
                                'y': '5426'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4857',
                        'heightRadius': '6595',
                        'startAngle': '-824660',
                        'sweepAngle': '891534'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '29078',
                                'y': '3952'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4857',
                        'heightRadius': '6595',
                        'startAngle': '-8950887',
                        'sweepAngle': '1091722'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '22141',
                                'y': '4720'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '4365',
                        'heightRadius': '5945',
                        'startAngle': '-9809656',
                        'sweepAngle': '1061181'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '14000',
                                'y': '5192'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6753',
                        'heightRadius': '9190',
                        'startAngle': '-4002417',
                        'sweepAngle': '739161'
                    },
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': '4127',
                                'y': '15789'
                            }
                        ]
                    },
                    {
                        'type': 'arc',
                        'widthRadius': '6753',
                        'heightRadius': '9190',
                        'startAngle': '9459261',
                        'sweepAngle': '711490'
                    }
                ]
            }
        ]
    },
    'callout1': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 112500,
            'adj4': -38333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'callout2': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 112500,
            'adj6': -46667
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'callout3': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 100000,
            'adj6': -16667,
            'adj7': 112963,
            'adj8': -8333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ],
            [
                'y4',
                '*/ h adj7 100000'
            ],
            [
                'x4',
                '*/ w adj8 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentCallout1': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 112500,
            'adj4': -38333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentCallout2': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 112500,
            'adj6': -46667
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentCallout3': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 100000,
            'adj6': -16667,
            'adj7': 112963,
            'adj8': -8333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ],
            [
                'y4',
                '*/ h adj7 100000'
            ],
            [
                'x4',
                '*/ w adj8 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': false,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'borderCallout1': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 112500,
            'adj4': -38333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'borderCallout2': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 112500,
            'adj6': -46667
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'borderCallout3': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 100000,
            'adj6': -16667,
            'adj7': 112963,
            'adj8': -8333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ],
            [
                'y4',
                '*/ h adj7 100000'
            ],
            [
                'x4',
                '*/ w adj8 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentBorderCallout1': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 112500,
            'adj4': -38333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentBorderCallout2': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 112500,
            'adj6': -46667
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'accentBorderCallout3': {
        'family': 'callouts',
        'defaults': {
            'adj1': 18750,
            'adj2': -8333,
            'adj3': 18750,
            'adj4': -16667,
            'adj5': 100000,
            'adj6': -16667,
            'adj7': 112963,
            'adj8': -8333
        },
        'guides': [
            [
                'y1',
                '*/ h adj1 100000'
            ],
            [
                'x1',
                '*/ w adj2 100000'
            ],
            [
                'y2',
                '*/ h adj3 100000'
            ],
            [
                'x2',
                '*/ w adj4 100000'
            ],
            [
                'y3',
                '*/ h adj5 100000'
            ],
            [
                'x3',
                '*/ w adj6 100000'
            ],
            [
                'y4',
                '*/ h adj7 100000'
            ],
            [
                'x4',
                '*/ w adj8 100000'
            ]
        ],
        'paths': [
            {
                'fill': 'norm',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'l',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'r',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'l',
                                'y': 'b'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 't'
                            }
                        ]
                    },
                    {
                        'type': 'close'
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'b'
                            }
                        ]
                    }
                ]
            },
            {
                'fill': 'none',
                'stroke': true,
                'commands': [
                    {
                        'type': 'move',
                        'points': [
                            {
                                'x': 'x1',
                                'y': 'y1'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x2',
                                'y': 'y2'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x3',
                                'y': 'y3'
                            }
                        ]
                    },
                    {
                        'type': 'line',
                        'points': [
                            {
                                'x': 'x4',
                                'y': 'y4'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
